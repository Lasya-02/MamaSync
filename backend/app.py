from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from pymongo import MongoClient
from bson import ObjectId

app = FastAPI()

# CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- MongoDB connection ----
client = MongoClient(
    "mongodb+srv://sharmaanugya05:sharmaanugya05@mamasync.hqy4yen.mongodb.net/"
)
db = client["mamasync"]
tasks_collection = db["daily_tasks"]      # 👈 ONE collection we use


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
