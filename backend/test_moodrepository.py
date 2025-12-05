import pytest
from moodrepository import mood_repository
from datetime import date

@pytest.fixture
def test_user_id():
    return "test_mood_user@example.com"

@pytest.fixture
def test_date():
    return date.today().isoformat()

@pytest.fixture(autouse=True)
def cleanup(test_user_id):
    """Clean up test data before and after each test."""
    # Clean before
    mood_repository.collection.delete_many({"userId": test_user_id})
    yield
    # Clean after
    mood_repository.collection.delete_many({"userId": test_user_id})

def test_create_mood(test_user_id, test_date):
    """Test creating a new mood entry."""
    mood_data = {
        "userId": test_user_id,
        "date": test_date,
        "mood": "happy"
    }
    
    mood_id = mood_repository.create(mood_data)
    
    assert mood_id is not None
    assert isinstance(mood_id, str)

def test_find_by_user_and_date(test_user_id, test_date):
    """Test finding a mood entry by user and date."""
    mood_data = {
        "userId": test_user_id,
        "date": test_date,
        "mood": "calm"
    }
    
    mood_repository.create(mood_data)
    found_mood = mood_repository.find_by_user_and_date(test_user_id, test_date)
    
    assert found_mood is not None
    assert found_mood["userId"] == test_user_id
    assert found_mood["date"] == test_date
    assert found_mood["mood"] == "calm"
    assert "created_at" in found_mood

def test_find_by_user_and_date_not_found(test_user_id):
    """Test finding a mood entry that doesn't exist."""
    found_mood = mood_repository.find_by_user_and_date(test_user_id, "2099-12-31")
    
    assert found_mood is None

def test_find_by_user(test_user_id, test_date):
    """Test finding all mood entries for a user."""
    moods = [
        {"userId": test_user_id, "date": "2024-01-01", "mood": "happy"},
        {"userId": test_user_id, "date": "2024-01-02", "mood": "tired"},
        {"userId": test_user_id, "date": "2024-01-03", "mood": "anxious"}
    ]
    
    for mood in moods:
        mood_repository.create(mood)
    
    found_moods = mood_repository.find_by_user(test_user_id)
    
    assert len(found_moods) == 3
    # Should be sorted by date descending
    assert found_moods[0]["date"] == "2024-01-03"
    assert found_moods[1]["date"] == "2024-01-02"
    assert found_moods[2]["date"] == "2024-01-01"

def test_update_mood(test_user_id, test_date):
    """Test updating a mood entry."""
    mood_data = {
        "userId": test_user_id,
        "date": test_date,
        "mood": "happy"
    }
    
    mood_repository.create(mood_data)
    success = mood_repository.update(test_user_id, test_date, "unwell")
    
    assert success is True
    
    updated_mood = mood_repository.find_by_user_and_date(test_user_id, test_date)
    assert updated_mood["mood"] == "unwell"
    assert "updated_at" in updated_mood

def test_update_nonexistent_mood(test_user_id, test_date):
    """Test updating a mood entry that doesn't exist."""
    success = mood_repository.update(test_user_id, "2099-12-31", "happy")
    
    assert success is False

def test_delete_mood(test_user_id, test_date):
    """Test deleting a mood entry."""
    mood_data = {
        "userId": test_user_id,
        "date": test_date,
        "mood": "calm"
    }
    
    mood_repository.create(mood_data)
    success = mood_repository.delete(test_user_id, test_date)
    
    assert success is True
    
    found_mood = mood_repository.find_by_user_and_date(test_user_id, test_date)
    assert found_mood is None

def test_delete_nonexistent_mood(test_user_id):
    """Test deleting a mood entry that doesn't exist."""
    success = mood_repository.delete(test_user_id, "2099-12-31")
    
    assert success is False
