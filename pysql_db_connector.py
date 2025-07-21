""" 
This module contains the code to connect to the MySQL database using the databases module.
It uses code based on that module's documentation, and was was implemented on February 21st. https://github.com/encode/databases
"""

from databases import Database

# Configure the connection string for your MySQL database
DATABASE_URL = "mysql+aiomysql://usr1:my_cool_secret@127.0.0.1:3306/340_project_db"

# Create a Database instance
database = Database(DATABASE_URL)

async def get_db_connection():
    # This function now returns the Database instance directly
    return database
