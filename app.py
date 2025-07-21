from typing import List

from databases import Database  # Import the Database class for type hinting.
from fastapi import Depends, FastAPI, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import SQLAlchemyError

from models import Category, Comment, Pin, SavedPin, SavedPinUpdate, User, CommentUpdate
from pysql_db_connector import database  # Import the database instance.

# The follwing FastAPI app instance code was adapted from the FastAPI documentation and was implemented on February 21st, 2024: https://fastapi.tiangolo.com/tutorial/first-steps/
app = FastAPI()

# Make the src directory available to the FastAPI app.
app.mount("/src", StaticFiles(directory="src"), name="src")

# / End FastAPI app instance code adapted from the FastAPI documentation.

# The following event code was implemented on Feb. 25th and adapted from the FastAPI documentation on events: https://fastapi.tiangolo.com/advanced/events/

# Connect to the database when the app starts and disconnect when it stops. 
@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


# Dependency to provide a database connection for routes.
async def get_db():
    return database

# / End of event code adapted from the FastAPI documentation.


#### Endpoints ####

### Index ###

# The follwing FastAPI index route code was adapted from the FastAPI documentation and was implemented on February 21st, 2024: https://fastapi.tiangolo.com/tutorial/first-steps/

@app.get("/", response_class=RedirectResponse, status_code=302)
async def read_index():
    """Redirect to the index.html file."""
    return "/src/index.html"

# / End of FastAPI index route code adapted from the FastAPI documentation.


### Pins ###

# The following route code was implemented from Feb 21st until March 11th and based on code in the FastAPI documentation on creating "path operations": https://fastapi.tiangolo.com/tutorial/first-steps/#step-3-create-a-path-operation

# The SQL queries in the following route code were implemented from Feb 21st until March 11th and were all original, based on examples from CS340 modules 1, 3, 4, and 5.

# Get all pins
@app.get("/pins/", response_model=List[Pin])
async def read_pins(db: Database = Depends(get_db)):
    """Get all pins."""
    query = "SELECT * FROM Pins"
    return await db.fetch_all(query=query)


# Get pin by ID
@app.get("/pins/{id}", response_model=Pin)
async def read_pin(id: int, db: Database = Depends(get_db)):
    """Get a pin by its ID."""
    query = "SELECT * FROM Pins WHERE pinID = :id"
    return await db.fetch_one(query=query, values={"id": id})


@app.post("/pins/", response_model=Pin)
async def create_pin(pin: Pin, db: Database = Depends(get_db)):
    """Create a new pin."""

    # Convert the Pin Pydantic model to a dict and exclude any unset fields.
    values = pin.dict(exclude_unset=True, exclude={"pinID"})
    query = (
        "INSERT INTO Pins (userID, categoryID, title, description, latitude, longitude, createdAt) "
        "VALUES (:userID, :categoryID, :title, :description, :latitude, :longitude, NOW())"
    )

    # Execute the query while handling any exceptions.
    try:
        last_record_id = await db.execute(query=query, values=values)
        values["pinID"] = last_record_id
        return values
    except SQLAlchemyError as e:
        print("sqlalchemy error", e)
        raise HTTPException(status_code=400, detail="Error creating the pin")
    except Exception as e:
        print("exception section error", e)
        raise HTTPException(status_code=500, detail="Internal server error")


### Saved Pins ###


@app.get("/saved-pins/", response_model=List[SavedPin])
async def get_saved_pins(db: Database = Depends(get_db)):
    """Get all saved pins."""
    query = """
    SELECT SavedPins.savedPinID, SavedPins.userID, Pins.pinID, Pins.title, Pins.createdAt, SavedPins.savedAt, Users.firstName, Users.lastName
    FROM SavedPins
    INNER JOIN Pins ON SavedPins.pinID = Pins.pinID
    INNER JOIN Users ON SavedPins.userID = Users.userID
    ORDER BY SavedPins.savedAt DESC
    """
    return await db.fetch_all(query=query)


@app.post("/saved-pins/", response_model=SavedPin)
async def save_pin(saved_pin: SavedPin, db: Database = Depends(get_db)):
    """Save a pin to a user's saved pins."""

    # Convert the SavedPins Pydantic model to a dict and exclude any unset fields.
    values = saved_pin.dict(exclude_unset=True)
    query = (
        "INSERT INTO SavedPins (userID, pinID, savedAt) VALUES (:userID, :pinID, NOW())"
    )
    print("values", values)

    # Execute the query while handling any exceptions.
    try:
        await db.execute(query=query, values=values)
        print("SavedPin created successfully")
        return values
    except Exception as e:
        print(f"Failed to create SavedPin: {e}")
        raise HTTPException(status_code=500, detail="Failed to create user")


@app.delete("/saved-pins/{saved_pin_id}")
async def delete_saved_pin(saved_pin_id: int, db: Database = Depends(get_db)):
    """Delete a saved pin by its ID."""
    query = "DELETE FROM SavedPins WHERE savedPinID = :saved_pin_id"
    await db.execute(query=query, values={"saved_pin_id": saved_pin_id})
    return {"message": "Saved pin deleted successfully"}


@app.put("/saved-pins/{saved_pin_id}", response_model=SavedPin)
async def update_saved_pin(
    saved_pin_id: int, update_data: SavedPinUpdate, db: Database = Depends(get_db)
):
    """Update a saved pin by its ID."""

    # Convert the SavedPins Pydantic model to a dict and exclude any unset fields.
    values = update_data.dict(exclude_unset=True)
    print("Received update data:", jsonable_encoder(update_data))

    if update_data.savedAt is None:
        raise HTTPException(status_code=400, detail="Missing required field: savedAt")

    # Ensure there is data to update
    if not values:
        raise HTTPException(status_code=400, detail="No data provided for update")

    # Prepare the query
    query = "UPDATE SavedPins SET "
    query += ", ".join([f"{key} = :{key}" for key in values.keys()])
    query += " WHERE savedPinID = :saved_pin_id"

    # Add the saved_pin_id to the values dict for the query.
    values["saved_pin_id"] = saved_pin_id

    # Execute the query while handling any exceptions.
    try:
        # Fetch the updated saved pin record
        await db.execute(query=query, values=values)
        fetch_query = "SELECT * FROM SavedPins WHERE savedPinID = :saved_pin_id"
        saved_pin_record = await db.fetch_one(
            fetch_query, values={"saved_pin_id": saved_pin_id}
        )

        # Ensure the record was found
        if saved_pin_record is None:
            raise HTTPException(status_code=404, detail="SavedPin not found")

        # Convert the record to a SavedPin instance
        saved_pin = SavedPin(**saved_pin_record)
        return saved_pin
    except Exception as e:
        print(f"Failed to update SavedPin: {e}")
        raise HTTPException(status_code=500, detail="Failed to update SavedPin")


### Categories ###


@app.get("/categories/")
async def read_categories(db: Database = Depends(get_db)):
    """Get all categories."""
    query = "SELECT * FROM Categories"
    return await db.fetch_all(query=query)


@app.get("/categories/{id}")
async def read_category(id: int, db: Database = Depends(get_db)):
    """Get a category by its ID."""
    query = "SELECT * FROM Categories WHERE categoryID = :id"

    # Execute the query while handling any exceptions.
    try:
        return await db.fetch_one(query=query, values={"id": id})
    except Exception as e:
        print(f"Failed to fetch category: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch category")


@app.post("/categories/")
async def create_category(category: Category, db: Database = Depends(get_db)):
    """Create a new category."""

    # Convert the category Pydantic model into a dictionary and exclude any unset fields.
    values = category.dict(exclude_unset=True)
    query = "INSERT INTO Categories (name, description) VALUES (:name, :description)"

    # Execute the query while handling any exceptions.
    try:
        await db.execute(query=query, values=values)
        print("Category created successfully")
        return values
    except Exception as e:
        print(f"Failed to create category: {e}")
        raise HTTPException(status_code=500, detail="Failed to create category")


### Users ###


@app.get("/users/", response_model=List[User])
async def read_users(db: Database = Depends(get_db)):
    """Get all users."""
    query = "SELECT * FROM Users"
    return await db.fetch_all(query=query)


@app.post("/users/", response_model=User)
async def create_user(user: User, db: Database = Depends(get_db)):
    """Create a new user."""

    # Convert the user Pydantic model into a dictionary and exclude any unset fields.
    values = user.dict(exclude_unset=True)
    query = (
        "INSERT INTO Users (firstName, lastName, email, phoneNumber, passwordHash, createdAt) "
        "VALUES (:firstName, :lastName, :email, :phoneNumber, :passwordHash, NOW())"
    )

    # Execute the query while handling any exceptions.
    try:
        await db.execute(query=query, values=values)
        print("User created successfully")
        return values
    except Exception as e:
        print(f"Failed to create user: {e}")
        raise HTTPException(status_code=500, detail="Failed to create user")


@app.get("/users/{user_id}", response_model=User)
async def get_user(user_id: int, db: Database = Depends(get_db)):
    """Get a user by their ID."""
    query = "SELECT * FROM Users WHERE userID = :user_id"
    return await db.fetch_one(query=query, values={"user_id": user_id})


### Comments ###


@app.get("/comments/")
async def read_comments(db: Database = Depends(get_db)):
    """Get all comments."""
    query = "SELECT * FROM Comments"
    return await db.fetch_all(query=query)


@app.post("/comments/")
async def create_comment(comment: Comment, db: Database = Depends(get_db)):
    """Create a new comment."""

    # Convert the comment Pydantic model into a dictionary and exclude any unset fields.
    values = comment.dict(exclude_unset=True)
    query = (
        "INSERT INTO Comments (pinID, userID, text, createdAt) "
        "VALUES (:pinID, :userID, :text, NOW())"
    )

    # Execute the query while handling any exceptions.
    try:
        await db.execute(query=query, values=values)
        print("Comment created successfully")
        return values
    except Exception as e:
        print(f"Failed to create comment: {e}")
        raise HTTPException(status_code=500, detail="Failed to create comment")


@app.put("/comments/{comment_id}")
async def update_comment(
    comment_id: int, update_data: CommentUpdate, db: Database = Depends(get_db)
):
    """Update a comment by its ID. (Can only update the userID currently.)"""

    # Convert the comment Pydantic model into a dictionary and exclude any unset fields.
    values = update_data.dict(exclude_unset=True)
    query_parts = [f"{key} = :{key}" for key in values.keys()]

    # Handle setting userID to NULL explicitly if it's None in the update
    if "userID" in values and values["userID"] is None:
        query_parts.append("userID = NULL")

    # Ensure there is data to update...
    query = (
        f"UPDATE Comments SET {', '.join(query_parts)} WHERE commentID = :comment_id"
    )
    values["comment_id"] = comment_id

    # Execute the query while handling any exceptions.
    try:
        await db.execute(query, values)
        return {"message": "Comment updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update comment: {e}")

# / End of route code based on code in the FastAPI documentation on creating "path operations".
# / End of original SQL queries in the route code based on examples from CS340 modules 1, 3, 4, and 5.
