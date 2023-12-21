import random
import string
from flask import Blueprint, Response, app, request, jsonify, session
from database import get_connection, db
from auxiliary import send_email
from flask_bcrypt import Bcrypt

user = Blueprint('user', __name__, url_prefix='/user')
bcrypt = Bcrypt(db)

# consider the following mysql schema for the crud operation methods (endpoints)
'''
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

# CRUD
# Create User - POST
@user.route('/create', methods=['POST'])
def create_user():
    try:
        connection = get_connection()
        body = request.json
        cursor = connection.cursor()
        phone_number = body['phone_number']
        e_mail = body['e_mail']
        password = body['password']
        name = body['name']

        # check if the user is already registered
        cursor.execute('SELECT * FROM User WHERE e_mail = %s', (e_mail,))
        result = cursor.fetchone()
        if result:
            return Response(f'User with e-mail {e_mail} already registered', 409)

        # check if the user is already registered
        cursor.execute('SELECT * FROM User WHERE phone_number = %s', (phone_number,))
        result = cursor.fetchone()
        if result:
            return Response(f'User already registered with the phone number: {phone_number}', 409)

        # hash the password
        hashed_password = bcrypt.generate_password_hash (password).decode('utf-8')

        # execute the query
        cursor.execute(
            'INSERT INTO User (password, name, phone_number, e_mail, verification_code) VALUES (%s, %s, %s, %s, NULL)',
            (hashed_password, name, phone_number, e_mail))
        connection.commit()


        return Response('User created successfully', 201)
    except Exception as e:
        # return the error
        return Response(f'An error occurred {e}', 500)

# Delete User with e-mail - DELETE
@user.route('/delete/e_mail/<string:e_mail>', methods=['DELETE'])
def delete_user(e_mail):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM User WHERE e_mail = %s', (e_mail,))
        result = cursor.fetchone()

        # check if the user exists
        if not result:
            return Response(f'User with e-mail {e_mail} does not exist', 404)

        # execute the query
        cursor.execute('DELETE FROM User WHERE e_mail = %s', (e_mail,))
        connection.commit()


        return Response('User deleted successfully', 200)
    except Exception as e:
        # return the error
        return Response(f'An error occurred {e}', 500)

# Delete User with phone number - DELETE
@user.route('/delete/phone/<string:phone_number>', methods=['DELETE'])
def delete_user_with_phone_number(phone_number):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM User WHERE phone_number = %s', (phone_number,))
        result = cursor.fetchone()

        # check if the user exists
        if not result:
            return Response(f'User with phone number {phone_number} does not exist', 404)

        # execute the query
        cursor.execute('DELETE FROM User WHERE phone_number = %s', (phone_number,))
        connection.commit()


        return Response('User deleted successfully', 200)
    except Exception as e:
        # return the error
        return Response(f'An error occurred {e}', 500)

# Read User - GET
@user.route('/<int:user_id>', methods=['GET'])
def read_user(user_id):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM User WHERE user_ID = %s', (user_id,))
        result = cursor.fetchone()

        # convert result to dictionary with keys
        result = dict(zip([key[0] for key in cursor.description], result))
        return jsonify(result)
    except Exception as e:
        # return the error
        return Response(f'An error occurred {e}', 500)

# Read User by Email - GET
@user.route('/email/<string:e_mail>', methods=['GET'])
def read_user_by_email(e_mail):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM User WHERE e_mail = %s', (e_mail,))
        result = cursor.fetchone()

        # convert result to dictionary with keys
        result = dict(zip([key[0] for key in cursor.description], result))
        return jsonify(result)
    except Exception as e:
        # return the error
        return Response(f'An error occurred {e}', 500)

# Read User by Phone Number - GET
@user.route('/phone/<string:phone_number>', methods=['GET'])
def read_user_by_phone_number(phone_number):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM User WHERE phone_number = %s', (phone_number,))
        result = cursor.fetchone()

        # convert result to dictionary with keys
        result = dict(zip([key[0] for key in cursor.description], result))
        return jsonify(result)
    except Exception as e:
        # return the error
        return Response(f'An error occurred {e}', 500)

# Create a verification code for the user - POST
@user.route('/verification_code/create/<string:e_mail>', methods=['POST'])
def create_verification_code(e_mail):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM User WHERE e_mail = %s', (e_mail,))
        result = cursor.fetchone()

        # check if the user exists
        if not result:
            return Response(f'User with e-mail {e_mail} does not exist', 404)

        # generate a random 4 digit code
        verification_code = ''.join(random.choices(string.digits, k=4))

        # update the verification code
        cursor.execute('UPDATE User SET verification_code = %s WHERE e_mail = %s', (verification_code, e_mail))
        connection.commit()

        # Send e-mail to the user with the verification code
        if not send_email(verification_code, e_mail):
            return Response(f'Verification code could not be sent to {e_mail}', 500)
        # convert verification code to key:value pair
        verification_code = {'verification_code': verification_code}
        # return the verification code
        return jsonify(verification_code)
    except Exception as e:
        # return the error
        return Response(f'An error occurred {e}', 500)


# Check the verification code for the user - POST
@user.route('/verification_code/check/<string:e_mail>', methods=['POST'])
def check_verification_code(e_mail):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        body = request.json
        verification_code = body['verification_code']

        # check if the user exists
        cursor.execute('SELECT * FROM User WHERE e_mail = %s', (e_mail,))
        result = cursor.fetchone()
        if not result:
            return Response(f'User with e-mail {e_mail} does not exist', 404)

        # get the verification code from the db with the given e-mail
        cursor.execute('SELECT verification_code FROM User WHERE e_mail = %s', (e_mail,))
        verification_code_db = cursor.fetchone()

        # check if the verification code is null
        if not verification_code_db[0]:
            return Response(f'Verification code for user with e-mail {e_mail} does not exist', 404)
        
        verification_code_db = int(verification_code_db[0])
        verification_code = int(verification_code)
        if verification_code_db != verification_code:
            return Response(f'Verification code incorrect {verification_code_db}', 404)

        # update the verification code
        cursor.execute('UPDATE User SET verification_code = NULL WHERE e_mail = %s', (e_mail,))
        connection.commit()

        # return the verification code
        return Response('Verification code correct', 200)
    except Exception as e:
        # return the error
        return Response(f'An error occurred {e}', 500)

# Update Password - PUT
@user.route('/update/password/<int:user_id>', methods=['PUT'])
def update_password(user_id):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        body = request.json
        password = body['password']

        # check if the user exists
        cursor.execute('SELECT * FROM User WHERE user_id = %s', (user_id,))
        result = cursor.fetchone()
        if not result:
            return Response(f'User with user_id {user_id} does not exist', 404)

        # hash & update the password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        cursor.execute('UPDATE User SET password = %s WHERE user_id = %s', (hashed_password, user_id))
        connection.commit()

        return Response('Password updated successfully', 200)
    except Exception as e:
        # return the error
        return Response(f'An error occurred {e}', 500)

# Update User - PUT
# Note that, the user can only update their name, phone number and e-mail
# The user cannot update their password, verification code and user_id from this endpoint
@user.route('/<int:user_id>/update', methods=['PUT'])
def update_user(user_id):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        body = request.json
        phone_number = body['phone_number']
        e_mail = body['e_mail']
        name = body['name']

        # check if the user exists
        cursor.execute('SELECT * FROM User WHERE user_ID = %s', (user_id,))
        result = cursor.fetchone()
        if not result:
            return Response(f'User with id {user_id} does not exist', 404)

        # if user changed their e-mail, check if the new e-mail is already registered
        if result[5] != e_mail:
            cursor.execute('SELECT * FROM User WHERE e_mail = %s', (e_mail,))
            result = cursor.fetchone()
            if result:
                return Response(f'User with e-mail {e_mail} already registered', 409)

        # if user changed their phone number, check if the new phone number is already registered
        if result[4] != phone_number:
            cursor.execute('SELECT * FROM User WHERE phone_number = %s', (phone_number,))
            result = cursor.fetchone()
            if result:
                return Response(f'User already registered with the phone number: {phone_number}', 409)

        # update the user
        cursor.execute(
            'UPDATE User SET name = %s, phone_number = %s, e_mail = %s WHERE user_ID = %s',
            (name, phone_number, e_mail, user_id))
        connection.commit()

        return Response('User updated successfully', 200)
    except Exception as e:
        # return the error
        return Response(f'An error occurred {e}', 500)

# Login
@user.route('/login', methods=['POST'])
def login():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        body = request.json

        email = body['e_mail']
        password = body['password']

        # Check whether the user with the given email exists and whether the password is correct
        cursor.execute("SELECT * FROM User WHERE e_mail=%s", (email,))
        result = cursor.fetchone()

        if not result or not bcrypt.check_password_hash(result[1], password):
            return Response('Invalid email or password', 409)

        user_id = result[0]
        
        cursor.execute(
            "SELECT user_type FROM User_Types_View u WHERE u.user_id = %s", (user_id,)
        )
        
        result = cursor.fetchone()
        user_role = result[0]

        session['loggedin'] = True
        session['user_id'] = user_id
        session['user_role'] = user_role

        # return user role and user id
        return_message = jsonify({
            'user_id': user_id,
            'user_role': user_role
        })
        return Response(return_message.data, 200, content_type='application/json')
    except Exception as e:
        # return the error
        return Response(f'An error occurred {e}\n{password}', 500)
    
# Get the documents of a user - GET
@user.route('/<int:user_id>/document', methods=['GET'])
def get_documents_of_user(user_id):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        # check if user exists
        cursor.execute('SELECT * FROM User WHERE user_ID = %s', (user_id,))
        result = cursor.fetchone()
        if not result:
            return Response(f'User with id {user_id} does not exist!', 404)

        cursor.execute('SELECT * FROM Document WHERE user_ID = %s', (user_id,))
        result = cursor.fetchall()
        # convert result into dictionary with keys
        result = [dict(zip([key[0] for key in cursor.description], document)) for document in result]
        return jsonify(result)
    except Exception as e:
        # return the error
        return Response(f'An error occurred {e}', 500)