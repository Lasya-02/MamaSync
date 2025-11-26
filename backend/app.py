from fastapi import FastAPI, HTTPException,status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel,EmailStr
from typing import Optional
from pymongo import MongoClient
from bson import ObjectId
import uvicorn

from userrepository import user_repository
from datetime import date, time
from dailytaskrepository import dailytask_repository

app = FastAPI()

# CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000","http://127.0.0.1:8000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient(
    "mongodb+srv://lasya-02:lasya-02@mamasync.hqy4yen.mongodb.net/"
)
db = client["mamasync"]
tasks_collection = db["daily_tasks"]  

# ---------- MODELS ----------
class TaskCreate(BaseModel):
    userId: str
    date: str               # "YYYY-MM-DD"
    emoji: str
    title: str
    time: str
    completed: bool = False
    isPreset: bool = False


class TaskUpdate(BaseModel):
    completed: Optional[bool] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegistration(BaseModel):
    email: EmailStr
    name: str
    password: str
    pregnancyMonth: int
    working: bool
    workHours: int
    wakeTime: str  # Pydantic v2 handles time objects
    sleepTime: str
    mealTime: str
    emergencyContact: str # Stored as a simple string for the number/info
    dueDate: str   # Pydantic v2 handles date objects
    height: float
    weight: float

# ---------- HELPERS ----------
def build_task_dict(task: TaskCreate) -> dict:
    """Create a new task object with its own id."""
    return {
        "id": str(ObjectId()),            # task-level id for frontend
        "emoji": task.emoji,
        "title": task.title,
        "time": task.time,
        "completed": task.completed,
        "isPreset": task.isPreset,
    }


def find_doc(user_id: str, date: str):
    return tasks_collection.find_one({"userId": user_id, "date": date})


# ---------- ROUTES ----------

@app.post("/login",status_code=status.HTTP_200_OK)
def login_for_access_token(user_data: UserLogin):

    user_in_db = user_repository.find_by_email(user_data.email)
    print(user_in_db)
    if not user_in_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if (user_data.password != user_in_db['password']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_in_db

    #return JSONResponse(
    #    status_code=status.HTTP_200_OK,
    #    content={
    #        "message": "Login successful",
    #        "user_email": user_in_db['email'],
    #        "user_name" : user_in_db['name'],
    #        "user_id": user_in_db['_id']
    #        # "access_token": "your_generated_jwt_token_goes_here"
    #    }
    #)


@app.get("/users")
def get_user():
    return user_repository.find_all()

@app.get("/user/{id}")
def get_userbyid(id):
    return user_repository.find_by_id(id)

@app.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserRegistration):

    print(user_data)
    # Convert Pydantic model to a dictionary for PyMongo
    user_dict = user_data.model_dump()
    
    # Check if the user already exists in the database
    existing_user = user_repository.find_by_email(user_dict['email'])
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    # Create the user using the repository (which handles hashing)
    user_id = user_repository.create(user_dict)
    
    # Return a success message and the new user ID
    return {"message": "User registered successfully", "user_id": user_id, "email": user_dict['email']}

@app.put("/updateprofile", status_code=status.HTTP_200_OK)
def update_user(user_data: UserRegistration):

    print(user_data)
    # Convert Pydantic model to a dictionary for PyMongo
    user_dict = user_data.model_dump()
    
    # Check if the user already exists in the database
    existing_user = user_repository.find_by_email(user_dict['email'])
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user not found"
        )
        
    # Create the user using the repository (which handles hashing)
    user_id = user_repository.update(existing_user['_id'],user_dict)
    
    # Return a success message and the new user ID
    return {"message": "User updated successfully", "user_id": user_id, "email": user_dict['email']}

@app.get("/tasks")
def get_tasks(userId: str, date: str):
    """
    Get all tasks for a user for a given date.
    ONE document per (userId, date) with tasks array.
    """
    doc = find_doc(userId, date)
    if not doc:
        return {"tasks": []}
    return {"tasks": doc.get("tasks", [])}


@app.post("/tasks")
def create_task(task: TaskCreate):
    """
    Add one task to the user's task list for that date.
    If doc doesn't exist, create it.
    """
    existing = find_doc(task.userId, task.date)
    new_task = build_task_dict(task)

    if existing:
        tasks_collection.update_one(
            {"_id": existing["_id"]},
            {"$push": {"tasks": new_task}}
        )
    else:
        tasks_collection.insert_one(
            {
                "userId": task.userId,
                "date": task.date,
                "tasks": [new_task],
            }
        )

    return {"task": new_task}


@app.patch("/tasks/{task_id}")
def update_task(task_id: str, userId: str, date: str, patch: TaskUpdate):
    """
    Update one task in the tasks array (currently only 'completed').
    """
    update_ops = {}

    if patch.completed is not None:
        update_ops["tasks.$.completed"] = patch.completed

    if not update_ops:
        raise HTTPException(status_code=400, detail="Nothing to update")

    result = tasks_collection.update_one(
        {"userId": userId, "date": date, "tasks.id": task_id},
        {"$set": update_ops},
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")

    # fetch the updated task
    doc = find_doc(userId, date)
    tasks = doc.get("tasks", [])
    updated_task = next((t for t in tasks if t["id"] == task_id), None)

    return {"task": updated_task}


@app.delete("/tasks/{task_id}")
def delete_task(task_id: str, userId: str, date: str):
    """
    Delete one task from the tasks array.
    """
    result = tasks_collection.update_one(
        {"userId": userId, "date": date},
        {"$pull": {"tasks": {"id": task_id}}},
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"message": "Task deleted"}


@app.post("/tasks/mark-all-complete")
def mark_all_complete(userId: str, date: str):
    """
    Mark all tasks for this user & date as completed.
    """
    result = tasks_collection.update_one(
        {"userId": userId, "date": date},
        {"$set": {"tasks.$[].completed": True}},
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="No tasks for this day")

    return {"updated": result.modified_count}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)