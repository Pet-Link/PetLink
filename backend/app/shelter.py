from flask import Blueprint, Response, request, jsonify
from database import get_connection, db
from flask_bcrypt import Bcrypt

shelter = Blueprint('shelter', __name__, url_prefix='/shelter')
bcrypt = Bcrypt(db)

'''
consider the following mysql schemas

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
'''


# CRUD operations

# Create Shelter - POST
# Check if the shelter exists if not create a user and then create a shelter
@shelter.route('/create', methods=['POST'])
def create_shelter():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        data = request.get_json()
        name = data['name']
        e_mail = data['e_mail']
        phone_number = data['phone_number']
        password = data['password']

        street = data['street']
        district = data['district']
        apartment_no = data['apartment_no']
        city = data['city']
        zip_no = data['zip']
        country = data['country']
        description = data['description']

        # Check if the user exists with an e_mail
        cursor.execute('SELECT * FROM User WHERE e_mail = %s', (e_mail,))
        user1 = cursor.fetchone()
        # Check if the user exists with a phone number
        cursor.execute('SELECT * FROM User WHERE phone_number = %s', (phone_number,))
        user2 = cursor.fetchone()

        if user1:
            return Response(f'User with e_mail {e_mail} already exists', status=409)
        if user2:
            return Response(f'User with phone number {phone_number} already exists', status=409)

        # hash the password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Create a user
        cursor.execute('INSERT INTO User(password, name, phone_number, e_mail) VALUES (%s, %s, %s, %s)',
                       (hashed_password, name, phone_number, e_mail))
        connection.commit()
        cursor.execute('SELECT user_ID FROM User WHERE e_mail = %s', (e_mail,))
        user_ID = cursor.fetchone()[0]
        cursor.execute('INSERT INTO Shelter (user_ID, street, district, apartment_no, city, zip, country, description) VALUES (%s, '
                       '%s, %s, %s, %s, %s, %s, %s)',
                       (user_ID, street, district, apartment_no, city, zip_no, country, description))
        connection.commit()

        # Return the response with a message
        return Response(f'Shelter with user_ID {user_ID} is created', status=201)
    except Exception as e:
        return Response(f'Shelter could not be created, {e}', status=500)


# Get Shelter with the user id - GET
@shelter.route('/user_id/<int:user_ID>', methods=['GET'])
def get_shelter(user_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Shelter WHERE user_ID = %s', (user_ID,))
        shelter = cursor.fetchone()
        if shelter:
            # convert shelter to dictionary with keys
            shelter = dict(zip([key[0] for key in cursor.description], shelter))
            return jsonify(shelter)
        return Response(f'Shelter with user_ID {user_ID} does not exist', status=404)
    except Exception as e:
        print(e)
        return Response(f'Shelter with user_ID {user_ID} could not be fetched with exception {e}', status=500)


# Get all Shelters - GET
@shelter.route('/all', methods=['GET'])
def get_all_shelters():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Shelter')
        shelters = cursor.fetchall()
        if shelters:
            # convert shelters to dictionary with keys
            shelters = [dict(zip([key[0] for key in cursor.description], shelter)) for shelter in shelters]
            return jsonify(shelters)
        return Response(f'No shelters exist', status=404)
    except Exception as e:
        print(e)
        return Response(f'Shelters could not be fetched with exception {e}', status=500)


# Update Shelter - PUT
# Shelters can only update their description and address
# Updating their name, password and phone number should be done from user's endpoint
@shelter.route('/<int:user_id>/update', methods=['PUT'])
def update_shelter(user_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # check if the user exists
        cursor.execute('SELECT * FROM User WHERE user_ID = %s', (user_ID,))
        result = cursor.fetchone()
        if not result:
            return Response(f'User with id {user_ID} does not exist', 404)

        # check if the user has a shelter record
        cursor.execute('SELECT * FROM Shelter WHERE user_ID = %s', (user_ID,))
        shelter_result = cursor.fetchone()
        if not shelter_result:
            return Response(f'User with id {user_ID} does not have a shelter record', 404)

        data = request.get_json()
        description = data['description']
        street = data['street']
        district = data['district']
        apartment_no = data['apartment_no']
        city = data['city']
        zip_no = data['zip']
        country = data['country']

        # update the user
        cursor.execute('''
                        UPDATE Shelter
                        SET description = %s, street = %s, district = %s, apartment_no = %s,
                            city = %s, zip_no = %s, country = %s
                        WHERE user_ID = %s 
                        ''',
                       (description, street, district, apartment_no, city, zip_no, country, user_ID))

        # Commit the changes to the database
        connection.commit()

        return Response('Shelter updated successfully', 200)
    except Exception as e:
        # return the error
        return Response(f'Shelter with user_ID {user_ID} could not be updated with exception {e}', 500)


# Delete Shelter with the user id - DELETE
@shelter.route('/user_id/<int:user_ID>', methods=['DELETE'])
def delete_shelter(user_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Shelter WHERE user_ID = %s', (user_ID,))
        shelter = cursor.fetchone()
        if not shelter:
            return Response(f'Shelter with user_ID {user_ID} does not exist', status=404)

        cursor.execute('DELETE FROM User WHERE user_ID = %s', (user_ID,))  # ON DELETE CASCADE relation
        connection.commit()
        return Response(f'Shelter with user_ID {user_ID} is deleted', status=200)

    except Exception as e:
        print(e)
        return Response(f'Shelter with user_ID {user_ID} could not be deleted with exception {e}', status=500)
