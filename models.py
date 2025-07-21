"""
This file contains the Pydantic models for all the tables in the database. The purpose of these models is to help with error checking and validation of the data that is being sent to the database.
"""

# All class-describing code in this file is original and based on code from the Pydantic documentation on arbitrary class instances. This is so we can ultimately use an ORM to access the database, even though we do not do so currently. Code was implemented on a sporadic basis from Feb. 21st through March 2nd. https://docs.pydantic.dev/latest/concepts/models/#arbitrary-class-instances

from datetime import datetime
from decimal import Decimal
from typing import Annotated, Optional

from pydantic import BaseModel, EmailStr, Field, StringConstraints


class User(BaseModel):
    userID: Optional[int] = (
        None  # Automatically managed by the db, so we don't need to modify it here. Hence, the default value is None.
    )
    firstName: Annotated[str, StringConstraints(max_length=50)]
    lastName: Annotated[str, StringConstraints(max_length=50)]
    email: EmailStr
    phoneNumber: Annotated[str, StringConstraints(max_length=30)]
    passwordHash: Annotated[str, StringConstraints(max_length=50)]
    createdAt: Optional[datetime] = None  # Same as above. Automatically set by the db.


class Pin(BaseModel):
    pinID: Optional[int] = None
    userID: int
    categoryID: int
    title: Annotated[str, StringConstraints(max_length=100)]
    description: Annotated[str, StringConstraints(max_length=500)]
    latitude: Annotated[Decimal, Field(max_digits=9, decimal_places=6)]
    longitude: Annotated[Decimal, Field(max_digits=9, decimal_places=6)]
    createdAt: Optional[datetime] = None


class Category(BaseModel):
    categoryID: Optional[int] = None
    name: Annotated[str, StringConstraints(max_length=50)]
    description: Annotated[str, StringConstraints(max_length=200)]


class SavedPin(BaseModel):
    savedPinID: Optional[int] = None
    userID: int
    pinID: int
    savedAt: Optional[datetime] = None


class SavedPinUpdate(BaseModel):
    savedAt: Optional[datetime] = None


class Comment(BaseModel):
    commentID: Optional[int] = None
    pinID: int
    userID: Optional[int] = None
    text: Annotated[str, StringConstraints(max_length=500)]
    createdAt: Optional[datetime] = None
    
class CommentUpdate(BaseModel):
    userID: Optional[int] = None
    
#  / End code based on Pydantic documentation describing arbitrary class instances.
