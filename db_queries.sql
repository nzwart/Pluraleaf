/*
Pluraleaf - Database Manipulation Queries
All original SQL queries, implemented on a sporadic basis from Feb. 21st through March 11th, and based on examples in CS340 modules 1, 3, 4, and 5.
*/

/* 
Pins Page
*/

-- Get all pins with their category name and user information for the pins page (eventually to be a map), as well as a dropdown for SavedPins creation
SELECT 
    Pins.pinID, 
    Pins.title, 
    Pins.description, 
    Pins.latitude, 
    Pins.longitude, 
    Pins.createdAt, 
    Categories.name AS categoryName, 
    Users.firstName, 
    Users.lastName
FROM Pins 
INNER JOIN Categories ON Pins.categoryID = Categories.categoryID 
INNER JOIN Users ON Pins.userID = Users.userID;

-- Add a new pin
-- :userID, :categoryID, :title, :description, :latitude, :longitude are placeholders for the values received from the frontend
INSERT INTO Pins (userID, categoryID, title, description, latitude, longitude, createdAt) 
VALUES (:userID, :categoryID, :title, :description, :latitude, :longitude, NOW());


/* 
Saved Pins Page
*/

-- Get all pins saved by any user for the Saved Pins page
SELECT 
    SavedPins.savedPinID, 
    Pins.pinID, 
    Pins.title, 
    Pins.createdAt AS pinCreatedAt, 
    SavedPins.savedAt, 
    Users.firstName, 
    Users.lastName
FROM SavedPins
INNER JOIN Pins ON SavedPins.pinID = Pins.pinID
INNER JOIN Users ON SavedPins.userID = Users.userID
ORDER BY SavedPins.savedAt DESC;

-- Save a pin to a user's Folio (M-to-M relationship addition)
-- :userID and :pinID are placeholders for the values received from the frontend, they should each be the primary key of their respective tables, in the form of a dropdown selection
INSERT INTO SavedPins (userID, pinID, savedAt) VALUES (:userID, :pinID, NOW());

-- Delete a "save" from the saved pins table, erasing the M:N relationship between the user of the given pin save
-- (The pin will still exist in the Pins table, but will no longer be associated with the user in the SavedPins table)
-- :savedPinID is a placeholder for the savedPinID value received from the frontend (the savedPinID is the primary key of the SavedPins table, not the foreign key SavedPins.pinID)
DELETE FROM SavedPins WHERE savedPinID = :savedPinID;

-- Update the savedAt datetime for a specific saved pin
-- :newSavedAt is a placeholder for the new savedAt value received from the frontend, and :savedPinID is a placeholder for the savedPinID value received from the frontend
UPDATE SavedPins SET savedAt = :newSavedAt WHERE savedPinID = :savedPinID;


/* 
Categories Page
*/

-- Retrieve all categories to support category-related operations, similar to read_categories FastAPI endpoint
SELECT 
    categoryID, 
    name, 
    description 
FROM Categories;

-- Add a new category
-- :name and :description are placeholders for the string values received from the frontend via two textbox inputs
INSERT INTO Categories (name, description) VALUES (:name, :description);


/* 
Users Page
*/

-- Fetch all users to populate the All Users table, or to populate a dropdown for pin assignment.
SELECT 
    userID, 
    firstName, 
    lastName, 
    email, 
    phoneNumber 
FROM Users;

-- Add a new user
-- :firstName, :lastName, :email, :phoneNumber, :passwordHash are placeholders for the values received from the frontend
INSERT INTO Users (firstName, lastName, email, phoneNumber, passwordHash, createdAt) 
VALUES (:firstName, :lastName, :email, :phoneNumber, :passwordHash, NOW());


/* 
Comments Page
*/

-- Get all comments with their user information for the Comments page
SELECT 
    Comments.commentID, 
    Comments.text, 
    Pins.title AS pinTitle, 
    Users.firstName, 
    Users.lastName, 
    Comments.createdAt
FROM Comments
INNER JOIN Pins ON Comments.pinID = Pins.pinID
INNER JOIN Users ON Comments.userID = Users.userID;

-- Add a new comment
-- :userID, :pinID, :text are placeholders for the values received from the frontend; :userID and :pinID should be the primary key of their respective tables and chosen from a dropdown, and :commentText should be a string entered in a text input
INSERT INTO Comments (userID, pinID, text, createdAt)
VALUES (:userID, :pinID, :text, NOW());

-- / End SQL queries based on examples in CS340 modules 1, 3, 4, and 5.
