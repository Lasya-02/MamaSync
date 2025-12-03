import pytest
from fastapi.testclient import TestClient
from bson import ObjectId

from app import app

client = TestClient(app)

# -----------------------------------------------------------
# Shared Mock Collection used for all database interactions
# -----------------------------------------------------------

class MockCollection:
    """A simple mock collection that simulates MongoDB behavior."""

    def __init__(self):
        self.find_one_result = None
        self.find_result = None
        self.insert_result = ObjectId()
        self.update_result = True

    def find_one(self, query):
        return self.find_one_result

    def find(self, query=None, projection=None):
        return self.find_result or []

    def insert_one(self, document):
        class R:
            inserted_id = str(self.insert_result)
        return R()

    def update_one(self, query, update):
        class R:
            matched_count = 1 if self.update_result else 0
            modified_count = 1 if self.update_result else 0
        return R()


VALID_ID = str(ObjectId())


# -----------------------------------------------------------
# Replace all Mongo collection objects in app.py
# -----------------------------------------------------------

@pytest.fixture(autouse=True)
def patch_collections(monkeypatch):
    fake = MockCollection()

    monkeypatch.setattr("app.tasks_collection", fake)
    monkeypatch.setattr("app.forum_collection", fake)
    monkeypatch.setattr("app.guide_collection", fake)
    monkeypatch.setattr("app.reminder_collection", fake)

    return fake


# ===========================================================
#                     USER TESTS
# ===========================================================

def test_register_user(monkeypatch):
    from userrepository import user_repository

    monkeypatch.setattr(user_repository, "find_by_email", lambda email: None)
    monkeypatch.setattr(user_repository, "create", lambda data: "mock_user")

    payload = {
        "email": "test@example.com",
        "name": "Test",
        "password": "secret",
        "pregnancyMonth": 4,
        "working": True,
        "workHours": 8,
        "wakeTime": "06:00",
        "sleepTime": "22:00",
        "mealTime": "12:00",
        "emergencyContact": "123",
        "dueDate": "2025-12-01",
        "height": 160,
        "weight": 55
    }

    r = client.post("/register", json=payload)
    assert r.status_code == 201
    assert r.json()["user_id"] == "mock_user"


def test_login_user(monkeypatch):
    from userrepository import user_repository
    monkeypatch.setattr(user_repository, "find_by_email",
                        lambda email: {"_id": VALID_ID, "email": email, "password": "secret", "name": "A"})

    monkeypatch.setattr("app.SECRET_KEY", "testkey")

    r = client.post("/login", json={"email": "x@test.com", "password": "secret"})
    assert r.status_code == 200
    assert "token" in r.json()


def test_update_profile(monkeypatch):
    from userrepository import user_repository
    monkeypatch.setattr(user_repository, "find_by_email",
                        lambda e: {"_id": VALID_ID, "email": e})
    monkeypatch.setattr(user_repository, "update", lambda id, d: id)

    payload = {
        "email": "test@example.com",
        "name": "Updated",
        "password": "secret",
        "pregnancyMonth": 4,
        "working": True,
        "workHours": 8,
        "wakeTime": "06:00",
        "sleepTime": "22:00",
        "mealTime": "12:00",
        "emergencyContact": "123",
        "dueDate": "2025-12-01",
        "height": 160,
        "weight": 55
    }

    r = client.put("/updateprofile", json=payload)
    assert r.status_code == 200


# ===========================================================
#                     TASKS TESTS
# ===========================================================

def test_create_task(patch_collections):
    patch_collections.find_one_result = None
    r = client.post("/tasks", json={
        "userId": "u1",
        "date": "d1",
        "emoji": "🙂",
        "title": "Test",
        "time": "10:00",
        "completed": False,
        "isPreset": False
    })
    assert r.status_code == 200


def test_get_tasks(patch_collections):
    patch_collections.find_one_result = {"tasks": [{"title": "X"}]}
    r = client.get("/tasks?userId=u1&date=d1")
    assert r.status_code == 200


def test_update_task(patch_collections):
    patch_collections.find_one_result = {"tasks": [{"id": "t1", "completed": False}]}
    r = client.patch("/tasks/t1?userId=u1&date=d1", json={"completed": True})
    assert r.status_code == 200


def test_delete_task(patch_collections):
    patch_collections.update_result = True
    r = client.delete("/tasks/t1?userId=u1&date=d1")
    assert r.status_code == 200


def test_mark_all_complete(patch_collections):
    patch_collections.update_result = True
    r = client.post("/tasks/mark-all-complete?userId=u1&date=d1")
    assert r.status_code == 200


# ===========================================================
#                     FORUM TESTS
# ===========================================================

def test_create_forum_post(patch_collections):
    r = client.post("/forum", json={"userId": "u1", "title": "Hello", "content": "World"})
    assert r.status_code == 201


def test_get_forum_post(patch_collections):
    patch_collections.find_one_result = {"_id": VALID_ID, "title": "Post"}
    r = client.get(f"/forum/{VALID_ID}")
    assert r.status_code == 200


def test_add_reply(patch_collections):
    patch_collections.update_result = True
    r = client.post(f"/forum/{VALID_ID}/replies", json={"userId": "u1", "content": "Hi"})
    assert r.status_code == 201


# ===========================================================
#                     GUIDE TESTS
# ===========================================================

def test_get_guides(patch_collections):
    patch_collections.find_result = [{"_id": VALID_ID, "title": "Guide"}]
    r = client.get("/guide")
    assert r.status_code == 200
    assert "Guide" in r.json()["documents"][0]["title"]


# ===========================================================
#                   REMINDER TESTS
# ===========================================================

def test_create_reminder(patch_collections):
    patch_collections.find_one_result = None
    r = client.post("/createreminder", json={
        "userId": "u1",
        "title": "A",
        "description": "B",
        "date": "2025-12-01",
        "time": "10:00",
        "category": "Health",
        "repeat": "None"
    })
    assert r.status_code == 200


def test_get_reminder(patch_collections):
    patch_collections.find_one_result = {"reminders": [{"title": "X"}]}
    r = client.get("/getreminder?userId=u1")
    assert r.status_code == 200


def test_delete_reminder(patch_collections):
    patch_collections.update_result = True
    r = client.delete("/deletereminder/r1?userId=u1")
    assert r.status_code == 200


def test_update_reminder(patch_collections):
    patch_collections.find_one_result = {"reminders": [{"id": "r1"}]}
    r = client.put("/updatereminder/r1?userId=u1", json={
        "userId": "u1",
        "title": "Updated",
        "description": "Test",
        "date": "2025-12-01",
        "time": "09:00",
        "category": "Health",
        "repeat": "None"
    })
    assert r.status_code == 200
