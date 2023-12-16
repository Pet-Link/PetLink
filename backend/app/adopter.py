from flask import Blueprint, Response, request, jsonify
from database import get_connection, db
from flask_bcrypt import Bcrypt

adopter = Blueprint('adopter', __name__, url_prefix='/adopter')
bcrypt = Bcrypt(db)

'''
consider the following mysql schemas

CREATE TABLE IF NOT EXISTS Adopter(
    user_ID INT NOT NULL,
    description TEXT,
    age INT,
    sex VARCHAR(10),
    balance DECIMAL(10, 2),
    profile_picture_path VARCHAR(300),
    species VARCHAR(50),
    breed VARCHAR(50),
    adoption_age INT NOT NULL,
    neuter_status VARCHAR(20),
    adoption_sex VARCHAR(10),
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


# TODO: Add updating profile picture - through Google cloud perhaps?

# CRUD operations

# Create adopter - POST
# Check if the adopter exists if not create a user and then create an adopter
@adopter.route('/create', methods=['POST'])
def create_adopter():
    print("request.get_json()")
    try:
        connection = get_connection()
        cursor = connection.cursor()
        data = request.get_json()
        name = data['name']
        e_mail = data['e_mail']
        phone_number = data['phone_number']
        password = data['password']

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
        cursor.execute('INSERT INTO Adopter (user_ID, balance) VALUES (%s, %s)',
                       (user_ID, 0))
        connection.commit()

        # Return the response with a message
        return Response(f'Adopter with user_ID {user_ID} is created', status=201)
    except Exception as e:
        print(e)
        return Response(f'Adopter could not be created with exception {e}', status=500)


# Get adopter with the user id - GET
@adopter.route('/user_id/<int:user_ID>', methods=['GET'])
def get_adopter(user_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', user_ID)
        adopter = cursor.fetchone()
        if not adopter:
            return Response(f'Adopter with user_ID {user_ID} does not exist', status=404)
        return jsonify(adopter)
    except Exception as e:
        print(e)
        return Response(f'Adopter with user_ID {user_ID} could not be fetched with exception {e}', status=500)


# Get all adopters - GET
@adopter.route('/all', methods=['GET'])
def get_all_adopters():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Adopter')
        adopters = cursor.fetchall()
        # result = []
        # # append the user information to the adopter
        # for adopter in adopters:
        #     cursor.execute('SELECT * FROM User WHERE user_ID = %s', (adopter[0],))
        #     user = cursor.fetchone()
        #     adopter = adopter + user
        #     result.append(adopter)
        # return the appended adopters
        if adopters:
            return jsonify(adopters)
        else:
            return Response(f'No adopters exist', status=404)
    except Exception as e:
        print(e)
        return Response(f'Adopters could not be fetched with exception {e}', status=500)


# Update adopter - PUT
# Adopters can only update their description and adoption preferences
# Updating their name, password and phone number should be done from user's endpoint
@adopter.route('/<int:user_id>/update', methods=['PUT'])
def update_adopter(user_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # check if the user exists
        cursor.execute('SELECT * FROM User WHERE user_ID = %s', (user_ID,))
        result = cursor.fetchone()
        if not result:
            return Response(f'User with id {user_ID} does not exist', 404)

        # check if the user has an adopter record
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (user_ID,))
        adopter_result = cursor.fetchone()
        if not adopter_result:
            return Response(f'User with id {user_ID} does not have an adopter record', 404)

        data = request.get_json()
        description = data['description']
        age = data['age']
        sex = data['sex']
        species = data['species']
        breed = data['breed']
        adoption_age = data['adoption_age']
        neuter_status = data['neuter_status']
        adoption_sex = data['adoption_sex']

        # update the user
        cursor.execute('''
                        UPDATE Adopter
                        SET description = %s, age = %s, sex = %s, species = %s,
                            breed = %s, adoption_age = %s, neuter_status = %s, adoption_sex = %s
                        WHERE user_ID = %s 
                        ''',
                       (description, age, sex, species, breed, adoption_age, neuter_status, adoption_sex, user_ID))

        # Commit the changes to the database
        connection.commit()

        return Response('Adopter updated successfully', 200)
    except Exception as e:
        # return the error
        return Response(f'Adopter with user_ID {user_ID} could not be updated with exception {e}', 500)


# Update adopter balance - PUT
@adopter.route('/<int:user_ID>/update_balance', methods=['PUT'])
def update_adopter_balance(user_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        data = request.get_json()
        top_up_amount = data['top_up_amount']

        # Check if adopter with the given user ID exists
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (user_ID,))
        adopter = cursor.fetchone()
        if not adopter:
            return Response(f'Adopter with user_ID {user_ID} does not exist', status=404)

        # Update the adopter's balance
        cursor.execute(
            '''
            UPDATE Adopter
            SET balance = balance + %s
            WHERE user_ID = %s
            ''',
            (top_up_amount, user_ID))

        # Commit the changes to the database
        connection.commit()

        return Response(f'Adopter balance for user {user_ID} updated successfully', status=200)

    except Exception as e:
        return Response(f'Error updating adopter balance: {e}', status=500)


# Delete adopter with the user id - DELETE
@adopter.route('/user_id/<int:user_ID>', methods=['DELETE'])
def delete_adopter(user_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (user_ID,))
        adopter = cursor.fetchone()
        if not adopter:
            return Response(f'Adopter with user_ID {user_ID} does not exist', status=404)

        cursor.execute('DELETE FROM User WHERE user_ID = %s', (user_ID,))  # ON DELETE CASCADE relation
        connection.commit()
        return Response(f'Adopter with user_ID {user_ID} is deleted', status=200)

    except Exception as e:
        print(e)
        return Response(f'Adopter with user_ID {user_ID} could not be deleted with exception {e}', status=500)
