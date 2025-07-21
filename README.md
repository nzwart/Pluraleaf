# PluraLeaf - Community Location-Sharing Platform

[Chris Bremseth](https://github.com/cbremseth) and I built PluraLeaf as a location-based social platform that's basically a map-focused take on Craigslist for local communities. The idea was to let people drop pins (we called them "leaves") on a map for want ads, stuff for sale, events, and so on. Through this app, we wanted users to experience connection with their neighborhood akin to the branches of a tree, in addition to the practical nuts-and-bolts uses of such a bulletin board. We used FastAPI with its Pydantic integration for data validation to handle the backend, SQLAlchemy for data storage, and kept the frontend simple with Bootstrap and JS.

This was a three-week development process. Chris and I had to move fast on this one and wear multiple hats, but my main task was the backend and database architecture. Despite -- or because of -- the tight timeline, we ended up with a working platform that actually demonstrates how much better local community interaction could be when you build it around geography instead of just text lists.

## My Core Technical Implementations

### 1. **Database Design for Geographic Social Data**

I built a normalized SQL schema that efficiently handled complex relationships between users, pins, and categories of pins, with Pydantic models for data validation:

```python
class Pin(BaseModel):
    pinID: Optional[int] = None
    userID: int
    categoryID: int
    title: Annotated[str, StringConstraints(max_length=100)]
    description: Annotated[str, StringConstraints(max_length=500)]
    latitude: Annotated[Decimal, Field(max_digits=9, decimal_places=6)]
    longitude: Annotated[Decimal, Field(max_digits=9, decimal_places=6)]
    createdAt: Optional[datetime] = None
```

The schema design eliminates data redundancy through proper normalization. User information is stored once and referenced via foreign keys in each `Pin`, preventing inconsistencies that would occur in a denormalized structure.

### 2. **Async API Architecture with Comprehensive CRUD**

I built a FastAPI backend with async database operations, implementing full Create, Read, Update, Delete functionality across all entities with proper error handling and data validation.

```python
@app.post("/pins/", response_model=Pin)
async def create_pin(pin: Pin, db: Database = Depends(get_db)):
    """Create a new pin with geographic coordinates."""
    values = pin.dict(exclude_unset=True, exclude={"pinID"})
    query = (
        "INSERT INTO Pins (userID, categoryID, title, description, latitude, longitude, createdAt) "
        "VALUES (:userID, :categoryID, :title, :description, :latitude, :longitude, NOW())"
    )

    try:
        last_record_id = await db.execute(query=query, values=values)
        values["pinID"] = last_record_id
        return values
    except SQLAlchemyError as e:
        raise HTTPException(status_code=400, detail="Error creating the pin")
```

### 3. **Complex Social Feature Implementation**

I implemented saved pins functionality with many-to-many relationships, allowing users to bookmark others' pins without breaking the data structure, and allowing us also to track when saves/bookmarks happen.

```python
@app.get("/saved-pins/", response_model=List[SavedPin])
async def get_saved_pins(db: Database = Depends(get_db)):
    """Get all saved pins with user and pin details."""
    query = """
    SELECT SavedPins.savedPinID, SavedPins.userID, Pins.pinID, Pins.title,
           Pins.createdAt, SavedPins.savedAt, Users.firstName, Users.lastName
    FROM SavedPins
    INNER JOIN Pins ON SavedPins.pinID = Pins.pinID
    INNER JOIN Users ON SavedPins.userID = Users.userID
    ORDER BY SavedPins.savedAt DESC
    """
    return await db.fetch_all(query=query)
```
