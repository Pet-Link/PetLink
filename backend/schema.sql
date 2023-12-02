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

CREATE TABLE IF NOT EXISTS Post (
    post_ID INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    post_date DATE NOT NULL,
    poster_ID INT NOT NULL,
    FOREIGN KEY(poster_ID) REFERENCES User(user_ID)
    ON DELETE CASCADE,
    PRIMARY KEY(post_id)
);