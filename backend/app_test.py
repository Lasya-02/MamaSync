import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

# -------------------------
# USER TESTS
# -------------------------

def test_register_user(monkeypatch):
    from userrepository import user_repository

    def mock_find_by_email(email):
        return None  # simulate no existing user

    def mock_create(user_dict):
        return "mock_user_id"

    monkeypatch.setattr(user_repository, "find_by_email", mock_find_by_email)
    monkeypatch.setattr(user_repository, "create", mock_create)

    payload = {
        "email": "test@example.com",
        "name": "Test User",
        "password": "secret",
        "pregnancyMonth": 5,
        "working": True,
        "workHours": 8,
        "wakeTime": "07:00",
        "sleepTime": "22:00",
        "mealTime": "12:00",
        "emergencyContact": "1234567890",
        "dueDate": "2025-12-01",
        "height": 165.0,
        "weight": 60.0
    }

    response = client.post("/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "User registered successfully"
    assert data["user_id"] == "mock_user_id"


def test_login_user(monkeypatch):
    from userrepository import user_repository

    def mock_find_by_email(email):
        return {
            "_id": "mockid",
            "email": email,
            "password": "secret",
            "name": "Test User"
        }

    monkeypatch.setattr(user_repository, "find_by_email", mock_find_by_email)

    payload = {"email": "test@example.com", "password": "secret"}
    response = client.post("/login", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["user"]["email"] == "test@example.com"


# -------------------------
# TASK TESTS
# -------------------------

def test_create_task(monkeypatch):
    from app import tasks_collection

    def mock_find_one(query):
        return None

    def mock_insert_one(doc):
        class Result:
            inserted_id = "mockid"
        return Result()

    monkeypatch.setattr(tasks_collection, "find_one", mock_find_one)
    monkeypatch.setattr(tasks_collection, "insert_one", mock_insert_one)

    payload = {
        "userId": "user123",
        "date": "2025-11-29",
        "emoji": "😊",
        "title": "Test Task",
        "time": "10:00",
        "completed": False,
        "isPreset": False
    }

    response = client.post("/tasks", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["task"]["title"] == "Test Task"


# -------------------------
# FORUM TESTS
# -------------------------

def test_create_forum_post(monkeypatch):
    from app import forum_collection

    def mock_insert_one(doc):
        class Result:
            inserted_id = "mockid"
        return Result()

    monkeypatch.setattr(forum_collection, "insert_one", mock_insert_one)

    payload = {
        "userId": "user123",
        "title": "Hello",
        "content": "World"
    }

    response = client.post("/forum", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Hello"
    assert "replies" in data


# -------------------------
# REMINDER TESTS
# -------------------------

def test_create_reminder(monkeypatch):
    from app import reminder_collection

    def mock_find_one(query):
        return None

    def mock_insert_one(doc):
        class Result:
            inserted_id = "mockid"
        return Result()

    monkeypatch.setattr(reminder_collection, "find_one", mock_find_one)
    monkeypatch.setattr(reminder_collection, "insert_one", mock_insert_one)

    payload = {
        "userId": "user123",
        "title": "Doctor Appointment",
        "description": "Checkup",
        "date": "2025-12-01",
        "time": "09:00",
        "category": "Health",
        "repeat": "None"
    }

    response = client.post("/createreminder", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["reminders"]["title"] == "Doctor Appointment"


# -------------------------
# GUIDE TESTS
# -------------------------

def test_get_guides(monkeypatch):
    from app import guide_collection

    def mock_find(query, projection):
        return [{"_id": "mockid", "title": "Guide 1"}]

    monkeypatch.setattr(guide_collection, "find", mock_find)

    response = client.get("/guide")
    assert response.status_code == 200
    data = response.json()
    assert "documents" in data
    assert data["documents"][0]["title"] == "Guide 1"
