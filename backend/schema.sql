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

CREATE VIEW User_Types_View AS
SELECT user_ID,
    CASE 
        WHEN EXISTS (SELECT 1 FROM Adopter WHERE Adopter.user_id = User.user_id) THEN 'adopter'
        WHEN EXISTS (SELECT 1 FROM Shelter WHERE Shelter.user_id = User.user_id) THEN 'shelter'
        WHEN EXISTS (SELECT 1 FROM Administrator WHERE Administrator.user_id = User.user_id) THEN 'administrator'
        WHEN EXISTS (SELECT 1 FROM Veterinarian WHERE Veterinarian.user_id = User.user_id) THEN 'veterinarian'
        ELSE 'unknown' 
    END AS user_type 
FROM User;


CREATE VIEW Adoption_Application_Details_View AS
SELECT aa.*, 
    adopter_user.name AS adopter_name,
    adopter_user.e_mail AS adopter_e_mail, 
    adopter.age AS adopter_age,
    adopter.sex AS adopter_sex,
    p.name AS pet_name, 
    shelter_user.name AS shelter_name
FROM Apply_Adopt aa
JOIN User adopter_user ON aa.adopter_ID = adopter_user.user_ID
JOIN Adopter adopter ON aa.adopter_ID = adopter.user_ID
JOIN Pet p ON aa.pet_ID = p.pet_ID
JOIN User shelter_user ON p.shelter_id = shelter_user.user_ID;

CREATE VIEW Detailed_Post_View AS
SELECT 
    p.*,
    u.name AS poster_name,
    COALESCE(rc.reply_count, 0) AS reply_count
FROM Post p
JOIN User u ON p.poster_ID = u.user_ID
LEFT JOIN (
    SELECT post_ID, COUNT(*) AS reply_count
    FROM Reply
    GROUP BY post_ID
) rc ON p.post_ID = rc.post_ID
ORDER BY p.post_date DESC;


DELIMITER $$

CREATE TRIGGER delete_unadopted_pet
AFTER DELETE ON Shelter
FOR EACH ROW
BEGIN
    DELETE FROM Pet
    WHERE Pet.shelter_ID = OLD.user_ID AND Pet.adoption_status = 0;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER change_adoption_status
AFTER UPDATE ON Apply_Adopt
FOR EACH ROW
BEGIN
    IF NEW.approval_status != OLD.approval_status THEN
        UPDATE Pet AS P
        SET P.adoption_status = NEW.approval_status
        WHERE P.pet_ID = NEW.pet_ID;
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER make_fee_payment
AFTER UPDATE ON Apply_Adopt
FOR EACH ROW
BEGIN
    IF NEW.approval_status = TRUE AND NEW.approval_status != OLD.approval_status THEN
        UPDATE Adopter AS AD
        INNER JOIN Pet AS P ON AD.user_ID = NEW.adopter_ID
        SET AD.balance = AD.balance - P.adoption_fee
        WHERE P.pet_ID = NEW.pet_ID;
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER assign_admin
AFTER INSERT ON Apply_Adopt
FOR EACH ROW
BEGIN
    IF NEW.administrator_id IS NULL THEN
        UPDATE Apply_Adopt
        SET administrator_id = (SELECT user_ID FROM Administrator_with_Least_Applications)
        WHERE adopter_ID = NEW.adopter_ID AND pet_ID = NEW.pet_ID;
    END IF;
END$$

DELIMITER ;

ALTER TABLE Adopter
ADD CONSTRAINT check_balance_non_negative_or_null
CHECK (balance >= 0 OR balance IS NULL);
