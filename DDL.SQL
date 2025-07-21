-- The following SQL table creation and data insertion queries were implemented from Feb 21st until March 11th and were original (other than the "SET" and final "COMMIT" queries), and based on learning from CS340 modules 1, 3, 4, and 5.
-- The "SET" and final "COMMIT" queries were adapted from the CS340 Project Step 2 Draft assignment page: https://canvas.oregonstate.edu/courses/1946034/assignments/9456214?module_item_id=23809320 

SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

-- Drop tables if they exist, starting with tables that have foreign keys
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS SavedPins;
DROP TABLE IF EXISTS Pins;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Categories;

-- Users table
CREATE TABLE IF NOT EXISTS Users (
    userID int AUTO_INCREMENT PRIMARY KEY,
    firstName varchar(50) NOT NULL,
    lastName varchar(50) NOT NULL,
    email varchar(50) UNIQUE NOT NULL,
    phoneNumber varchar(30) UNIQUE NOT NULL,
    passwordHash varchar(50) NOT NULL,
    createdAt datetime NOT NULL
);

-- Pins table
CREATE TABLE IF NOT EXISTS Pins (
    pinID int AUTO_INCREMENT PRIMARY KEY,
    userID int NOT NULL,
    categoryID int NOT NULL,
    title varchar(100) NOT NULL,
    description varchar(500) NOT NULL,
    latitude decimal(9, 6) NOT NULL,
    longitude decimal(9, 6) NOT NULL,
    createdAt datetime NOT NULL,
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (categoryID) REFERENCES Categories(categoryID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Categories table
CREATE TABLE IF NOT EXISTS Categories (
    categoryID int AUTO_INCREMENT PRIMARY KEY,
    name varchar(25) UNIQUE NOT NULL,
    description varchar(200) NOT NULL
);

-- SavedPins table
CREATE TABLE IF NOT EXISTS SavedPins (
    savedPinID int AUTO_INCREMENT PRIMARY KEY,
    userID int NOT NULL,
    pinID int NOT NULL,
    savedAt datetime NOT NULL,
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (pinID) REFERENCES Pins(pinID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Comments table
CREATE TABLE IF NOT EXISTS Comments (
    commentID int AUTO_INCREMENT PRIMARY KEY,
    pinID int NOT NULL,
    userID int, -- formerly not null
    text varchar(500) NOT NULL,
    createdAt datetime NOT NULL,
    FOREIGN KEY (pinID) REFERENCES Pins(pinID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Inserting data into Users
INSERT INTO Users (firstName, lastName, email, phoneNumber, passwordHash, createdAt) VALUES
('Alex', 'Turner', 'alex.turner@example.com', '555-0100', '1958715897', '2023-01-10 10:00:00'),
('Casey', 'Jones', 'casey.jones@example.com', '555-0101', '2123459829', '2023-01-15 11:30:00'),
('Morgan', 'Reed', 'morgan.reed@example.com', '555-0102', '9847293847', '2023-02-01 09:45:00'),
('Jordan', 'Blake', 'jordan.blake@example.com', '555-0103', '1359813759', '2023-02-05 16:20:00'),
('Samantha', 'Powers', 'samantha.powers@example.com', '555-0104', '1239129159', '2023-02-10 14:55:00');

-- Inserting data into Categories
INSERT INTO Categories (name, description) VALUES
('Free Stuff', 'Items offered at no cost, ideal for individuals looking to declutter or find useful items without spending. This category promotes recycling and reusing, reducing waste by giving items a new life.'),
('Event', 'Includes various gatherings like concerts, art exhibitions, and workshops, offering opportunities for community engagement, entertainment, and learning across diverse interests.'),
('News', 'Covers a broad spectrum of current events and informative content, aiming to keep the community informed about significant happenings locally, nationally, and globally.'),
('For Sale', 'List goods for purchase, ranging from electronics to furniture, facilitating the buying and selling of new and used items.'),
('Review', 'Features opinions and evaluations on a wide array of products, services, or experiences, providing insights to assist others in making informed decisions.'),
('Missed Connection', 'Personal ads recounting moments of chance encounters missed opportunities for interaction, hoping to reconnect with someone felt a unique or special connection with.');

-- Inserting data into Pins
INSERT INTO Pins (userID, categoryID, title, description, latitude, longitude, createdAt) VALUES
(1, 2, 'Road closed', 'Attention neighbors, due to unexpected maintenance, Maple Street will be closed from January 15th to January 20th. Please plan your commutes accordingly and consider alternative routes to avoid delays.', 45.07642998, -93.45108032, '2024-01-03 18:03:01'),
(2, 1, 'Free couch', 'Offering a gently used beige couch, free to a good home. It''s comfortable and in decent condition, perfect for a student or someone in need of furniture. Pick up only, available this weekend.', 45.11714569, -93.11599731, '2024-01-01 18:04:02'),
(1, 5, 'Cutie at the coffee shop', 'Saw you at Brew & Bean this morning, wearing a green jacket and reading a novel. You had the most infectious smile. If you remember someone awkwardly waving at you, that was me. Coffee on me next time?', 44.8860395, -93.36868286, '2024-01-17 08:54:07'),
(3, 2, 'Local election', 'Reminder to all community members: the local election is coming up on February 5th. Make your voice heard and vote for the future of our town. Polls open from 7 AM to 8 PM at the community center.', 44.97937098, -93.24783325, '2024-01-03 08:59:55'),
(4, 3, 'Used Bike for sale', 'Selling my Trek mountain bike, 2019 model, barely used and in excellent condition. Perfect for both city commuting and off-road adventures. Asking $350, helmet included. Contact me for pictures and more info.', 44.8568423, -93.07479858, '2024-01-31 13:50:34');

-- Inserting data into SavedPins
INSERT INTO SavedPins (userID, pinID, savedAt) VALUES
(1, 2, '2024-01-17 08:54:08'),
(1, 1, '2024-01-18 20:04:22'),
(2, 3, '2024-01-20 08:24:52'),
(3, 1, '2024-01-21 08:14:32'),
(4, 2, '2051-05-30 01:01:00');

-- Inserting data into Comments
INSERT INTO Comments (pinID, userID, text, createdAt) VALUES
(2, 1, 'Wow this is super creepy', '2024-01-17 08:54:08'),
(1, 1, 'Does the couch smell at all? How well will it hold up to cats?', '2024-01-18 20:04:22'),
(3, 2, 'Saw you at the coffee shop, brown hat and glasses. I was in a blue shirt. Let''s get coffee together sometime?', '2024-01-20 08:24:52'),
(1, 3, 'This road being closed is my worst nightmare! Thanks Mr. Mayor', '2024-01-21 08:14:32'),
(2, 4, 'Hey! This was me! I''d love to get coffee with you!', '2051-05-30 01:01:01');

SET FOREIGN_KEY_CHECKS=1;
COMMIT;

-- / End of SQL queries adapted from the sources mentioned above, cited beginning on line 1. / --
