CREATE DATABASE IF NOT EXISTS petlink CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE petlink;

CREATE TABLE IF NOT EXISTS User(
    user_ID INT NOT NULL AUTO_INCREMENT,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    verification_code VARCHAR(4),
    phone_number VARCHAR(20) NOT NULL,
    e_mail VARCHAR(255) NOT NULL,
    UNIQUE(e_mail),
    UNIQUE(phone_number),
    PRIMARY KEY (user_ID)
);

CREATE TABLE IF NOT EXISTS Post(
    post_ID INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    post_date DATETIME NOT NULL,
    poster_ID INT NOT NULL,
    FOREIGN KEY(poster_ID) REFERENCES User(user_ID)
    ON DELETE CASCADE,
    PRIMARY KEY(post_id)
);

CREATE TABLE IF NOT EXISTS Reply(
    post_ID INT NOT NULL,
    discriminator_ID INT NOT NULL,
    date DATETIME NOT NULL,
    expert_verify_status BOOLEAN,
    content TEXT NOT NULL,
    replier_ID INT NOT NULL,
    FOREIGN KEY(post_ID) REFERENCES Post(post_ID)
    ON DELETE CASCADE,
    FOREIGN KEY(replier_ID) REFERENCES User(user_ID)
    ON DELETE CASCADE,
    PRIMARY KEY (post_ID, discriminator_ID)
);

CREATE TABLE IF NOT EXISTS Document(
    document_ID INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    verification_status VARCHAR(50) NOT NULL,
    user_ID INT NOT NULL,
    FOREIGN KEY(user_ID) REFERENCES User(user_ID)
    ON DELETE CASCADE,
    PRIMARY KEY (document_ID)
);

CREATE TABLE IF NOT EXISTS Shelter(
    user_ID INT NOT NULL,
    description TEXT,
    street VARCHAR(255) NOT NULL,
    district VARCHAR(255) NOT NULL,
    apartment_no VARCHAR(20) NOT NULL,
    city VARCHAR(255) NOT NULL,
    zip VARCHAR(20) NOT NULL,
    country VARCHAR(255) NOT NULL,
    FOREIGN KEY(user_ID) REFERENCES User(user_ID)
    ON DELETE CASCADE,
    PRIMARY KEY (user_ID)
);

CREATE TABLE IF NOT EXISTS Administrator(
    user_ID INT NOT NULL,
    employee_ID INT NOT NULL,
    FOREIGN KEY(user_ID) REFERENCES User(user_ID)
    ON DELETE CASCADE,
    UNIQUE(employee_ID),
    PRIMARY KEY (user_ID)
);

CREATE TABLE IF NOT EXISTS Adopter(
    user_ID INT NOT NULL,
    description TEXT,
    age INT,
    sex VARCHAR(10),
    balance DECIMAL(10, 2),
    profile_picture_path VARCHAR(300),
    species VARCHAR(50),
    breed VARCHAR(50),
    adoption_age INT,
    neuter_status VARCHAR(20),
    adoption_sex VARCHAR(10),
    FOREIGN KEY(user_ID) REFERENCES User(user_ID)
    ON DELETE CASCADE,
    PRIMARY KEY (user_ID)
);

CREATE TABLE IF NOT EXISTS Veterinarian(
    user_ID INT NOT NULL,
    year_of_experience INT NOT NULL,
    speciality VARCHAR(100) NOT NULL,
    street VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    apartment_no VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    zip VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,
    FOREIGN KEY(user_ID) REFERENCES User(user_ID)
    ON DELETE CASCADE,
    PRIMARY KEY (user_ID)
);

CREATE TABLE IF NOT EXISTS PetCareInfo(
    info_ID INT NOT NULL AUTO_INCREMENT,
    content TEXT NOT NULL,
    title VARCHAR(300) NOT NULL,
    administrator_ID INT NOT NULL,
    FOREIGN KEY(administrator_ID) REFERENCES Administrator(user_ID)
    ON DELETE CASCADE,
    PRIMARY KEY (info_ID)
);

CREATE TABLE IF NOT EXISTS Pet(
    pet_ID INT NOT NULL AUTO_INCREMENT,
    shelter_ID INT,
    adopter_ID INT,
    species VARCHAR(150) NOT NULL,
    breed VARCHAR(150) NOT NULL,
    age INT NOT NULL,
    neutered_status BOOLEAN,
    sex VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    name VARCHAR(150) NOT NULL,
    vaccination_status BOOLEAN,
    house_trained_status BOOLEAN,
    adoption_status BOOLEAN,
    adoption_fee DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY(shelter_ID) REFERENCES Shelter(user_ID)
    ON DELETE SET NULL,
    FOREIGN KEY(adopter_ID) REFERENCES Adopter(user_ID)
    ON DELETE CASCADE,
    PRIMARY KEY (pet_ID)
);

-- changed this table by adding photo_id because the photo_path cannot be a key since it is a text (mysql doesn't allow text to be a key)
CREATE TABLE IF NOT EXISTS Photo(
    photo_id INT NOT NULL AUTO_INCREMENT,
    pet_ID INT NOT NULL,
    photo_path TEXT NOT NULL,
    FOREIGN KEY(pet_ID) REFERENCES Pet(pet_ID)
    ON DELETE CASCADE,
    PRIMARY KEY (photo_id)
);

CREATE TABLE IF NOT EXISTS MedicalRecord(
    record_ID INT NOT NULL AUTO_INCREMENT,
    pet_ID INT NOT NULL,
    veterinarian_ID INT NOT NULL,
    date DATETIME NOT NULL,
    operation TEXT,
    FOREIGN KEY(pet_ID) REFERENCES Pet(pet_ID)
    ON DELETE CASCADE,
    FOREIGN KEY(veterinarian_ID) REFERENCES Veterinarian(user_ID)
    ON DELETE CASCADE,
    PRIMARY KEY (record_ID)
);

CREATE TABLE IF NOT EXISTS OverseeRecord(
    record_ID INT NOT NULL AUTO_INCREMENT,
    administrator_ID INT NOT NULL,
    adopter_ID INT NOT NULL,
    date DATETIME NOT NULL,
    details TEXT,
    verification_status BOOLEAN,
    FOREIGN KEY(administrator_ID) REFERENCES Administrator(user_ID)
    ON DELETE CASCADE,
    FOREIGN KEY(adopter_ID) REFERENCES Adopter(user_ID)
    ON DELETE CASCADE,
    PRIMARY KEY (record_ID)
);


CREATE TABLE IF NOT EXISTS Appointment(
    adopter_ID INT NOT NULL,
    veterinarian_ID INT NOT NULL,
    date DATETIME NOT NULL,
    pet_ID INT NOT NULL,
    approval_status BOOLEAN,
    details TEXT,
    FOREIGN KEY(adopter_ID) REFERENCES Adopter(user_ID)
    ON DELETE CASCADE,
    FOREIGN KEY(veterinarian_ID) REFERENCES Veterinarian(user_ID)
    ON DELETE CASCADE,
    FOREIGN KEY(pet_ID) REFERENCES Pet(pet_ID)
    ON DELETE CASCADE,
    PRIMARY KEY (adopter_ID, veterinarian_ID)
);

CREATE TABLE IF NOT EXISTS Apply_Adopt(
    adopter_ID INT NOT NULL,
    pet_ID INT NOT NULL,
    administrator_ID INT,
    date DATETIME NOT NULL,
    pet_ownership BOOLEAN,
    pet_care_experience INT,
    housing_situation TEXT NOT NULL,
    adoption_reason TEXT NOT NULL,
    approval_status BOOLEAN,
    admin_remarks TEXT,
    FOREIGN KEY(adopter_ID) REFERENCES Adopter(user_ID)
    ON DELETE CASCADE,
    FOREIGN KEY(pet_ID) REFERENCES Pet(pet_ID)
    ON DELETE CASCADE,
    FOREIGN KEY(administrator_ID) REFERENCES Administrator(user_ID)
    ON DELETE CASCADE,
    PRIMARY KEY (adopter_ID, pet_ID)
);

CREATE TABLE IF NOT EXISTS Meet_Greet(
    adopter_ID INT NOT NULL,
    pet_ID INT NOT NULL,
    date DATETIME NOT NULL,
    FOREIGN KEY(adopter_ID) REFERENCES Adopter(user_ID)
    ON DELETE CASCADE,
    FOREIGN KEY(pet_ID) REFERENCES Pet(pet_ID)
    ON DELETE CASCADE,
    PRIMARY KEY (adopter_ID, pet_ID)
);

CREATE VIEW Administrator_with_Least_Applications AS
SELECT a.user_ID, COALESCE(COUNT(DISTINCT aa.adopter_ID, aa.pet_ID), 0) AS num_rows
FROM Administrator a
LEFT JOIN Apply_Adopt as aa ON a.user_ID = aa.administrator_ID
WHERE aa.approval_status IS NULL
GROUP BY a.user_ID
ORDER BY num_rows ASC
LIMIT 1;

CREATE VIEW Pet_Shelter_Details_View AS
SELECT Pet.*, User.name as shelter_name
FROM Pet 
JOIN User ON User.user_ID = Pet.shelter_ID;

CREATE VIEW User_Posts_And_Replies AS
SELECT 
    u.name AS UserName,
    p.title AS PostTitle,
    p.content AS PostContent,
    r.content AS ReplyContent,
    r.date AS ReplyDate
FROM User u
INNER JOIN Post p ON u.user_ID = p.poster_ID
LEFT JOIN Reply r ON p.post_ID = r.post_ID;

CREATE VIEW Shelter_Pets AS
SELECT 
    sh.description AS ShelterDescription,
    pt.name AS PetName,
    pt.species,
    pt.breed,
    pt.age,
    pt.neutered_status
FROM Shelter sh
INNER JOIN Pet pt ON sh.user_ID = pt.shelter_ID;

CREATE VIEW User_Pet_Medical_Records AS
SELECT 
    u.name AS UserName,
    pt.name AS PetName,
    mr.date AS RecordDate,
    mr.operation AS MedicalOperation
FROM User u
INNER JOIN Pet pt ON u.user_ID = pt.adopter_ID
INNER JOIN MedicalRecord mr ON pt.pet_ID = mr.pet_ID;

CREATE VIEW PetCare_Info_By_Admin AS
SELECT 
    u.name AS AdminName,
    pci.title AS InfoTitle,
    pci.content AS InfoContent
FROM Administrator ad JOIN User u
INNER JOIN PetCareInfo pci ON u.user_ID = pci.administrator_ID;

DELIMITER $$

CREATE TRIGGER After_Reply_Insertion
AFTER INSERT ON Reply
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT * FROM Veterinarian WHERE user_ID = NEW.replier_ID) THEN
        UPDATE Reply
        SET expert_verify_status = TRUE
        WHERE post_ID = NEW.post_ID AND replier_ID = NEW.replier_ID;
    END IF;
END$$

DELIMITER ;

