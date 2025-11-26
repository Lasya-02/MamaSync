from pymongo import MongoClient
import os


# ---- MongoDB connection ----
#client = MongoClient(
#    "mongodb+srv://sharmaanugya05:sharmaanugya05@mamasync.hqy4yen.mongodb.net/"
#)


#db = client["mamasync"]
#tasks_collection = db["daily_tasks"]     
#user_details = db["user"]

# Get connection details from environment variables or use local defaults
MONGO_HOST = os.environ.get('MONGO_HOST', 'mongodb+srv://lasya-02:lasya-02@mamasync.hqy4yen.mongodb.net/')
MONGO_PORT = int(os.environ.get('MONGO_PORT', 27017))
MONGO_DB = os.environ.get('MONGO_DB', 'mamasync')

class MongoInstance:
    def __init__(self):
        self.client = MongoClient(host=MONGO_HOST, port=MONGO_PORT)
        self.db = self.client[MONGO_DB]
        print(f"Connected to MongoDB at {MONGO_HOST}:{MONGO_PORT}, Database: {MONGO_DB}")

    def get_collection(self, collection_name):
        """Returns a specific collection object."""
        return self.db[collection_name]

# Create a single global instance of the database connection
mongo_db = MongoInstance()