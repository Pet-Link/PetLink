from flask import Blueprint, Response, request, jsonify
from database import get_connection, db
from flask_bcrypt import Bcrypt

administrator = Blueprint('administrator', __name__, url_prefix='/administrator')
bcrypt = Bcrypt(db)

'''
consider the following mysql schemas

CREATE TABLE IF NOT EXISTS Administrator(
    user_ID INT NOT NULL,
    employee_ID INT NOT NULL,
    FOREIGN KEY(user_ID) REFERENCES User(user_ID)
    ON DELETE CASCADE,
    UNIQUE(employee_ID),
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

# Create Administrator - POST
# Check if the administrator exists if not create a user and then create an administrator
@administrator.route('/create', methods=['POST'])
def create_administrator():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        data = request.get_json()
        e_mail = data['e_mail']
        phone_number = data['phone_number']
        password = data['password']
        name = data['name']
        employee_ID = data['employee_ID']

        # check if employee ID is only in integer
        if not employee_ID.isdigit():
            return Response(f'Employee ID {employee_ID} is not in integer format', status=400)

        # Check if the user exists with an e_mail
        cursor.execute('SELECT * FROM User WHERE e_mail = %s', (e_mail,))
        user1 = cursor.fetchone()
        # Check if the user exists with a phone number
        cursor.execute('SELECT * FROM User WHERE phone_number = %s', (phone_number,))
        user2 = cursor.fetchone()
        # Check if an administrator exists with the employee ID
        cursor.execute('SELECT * FROM Administrator WHERE employee_ID = %s', (employee_ID,))
        admin = cursor.fetchone()

        if user1:
            return Response(f'User with e_mail {e_mail} already exists', status=409)
        if user2:
            return Response(f'User with phone number {phone_number} already exists', status=409)
        if admin:
            return Response(f'Administrator with employee ID {employee_ID} already exists', status=409)

        # hash the password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Create a user
        cursor.execute('INSERT INTO User(password, name, phone_number, e_mail) VALUES (%s, %s, %s, %s)',
                           (hashed_password, name, phone_number, e_mail))
        connection.commit()
        cursor.execute('SELECT user_ID FROM User WHERE e_mail = %s', (data['e_mail'],))
        user_ID = cursor.fetchone()[0]
        cursor.execute('INSERT INTO Administrator (user_ID, employee_ID) VALUES (%s, %s)',
                        (user_ID, employee_ID))
        connection.commit()

        # Return the response with a message
        return Response(f'Administrator with user_ID {user_ID} is created', status=201)
    except Exception as e:
        print(e)
        return Response(f'Administrator could not be created with exception {e}', status=500)
    
# Get Administrator with the user id - GET
@administrator.route('/user_id/<int:user_ID>', methods=['GET'])
def get_administrator(user_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Administrator WHERE user_ID = %s', (user_ID,))
        administrator = cursor.fetchone()
        if administrator:
            # convert the administrator to a dictionary with the keys
            administrator = dict(zip([key[0] for key in cursor.description], administrator))
            return jsonify(administrator)
        return Response(f'Administrator with user_ID {user_ID} does not exist', status=404)
    except Exception as e:
        print(e)
        return Response(f'Administrator with user_ID {user_ID} could not be fetched with exception {e}', status=500)
    
# Get Administrator with the employee id - GET
@administrator.route('/employee_id/<int:employee_ID>', methods=['GET'])
def get_administrator_with_employee_id(employee_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Administrator WHERE employee_ID = %s', (employee_ID,))
        administrator = cursor.fetchone()
        if administrator:
            # convert the administrator to a dictionary with the keys
            administrator = dict(zip([key[0] for key in cursor.description], administrator))
            return jsonify(administrator)
        return Response(f'Administrator with employee_ID {employee_ID} does not exist', status=404)
    except Exception as e:
        print(e)
        return Response(f'Administrator with employee_ID {employee_ID} could not be fetched with exception {e}', status=500)
    
# Get all Administrators - GET
@administrator.route('/all', methods=['GET'])
def get_all_administrators():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Administrator')
        administrators = cursor.fetchall()
        if administrators:
            # convert the administrators to a dictionary with the keys
            administrators = [dict(zip([key[0] for key in cursor.description], administrator)) for administrator in administrators]
            return jsonify(administrators)
        return Response(f'No administrators exist', status=404)
    except Exception as e:
        print(e)
        return Response(f'Administrators could not be fetched with exception {e}', status=500)
    
# Delete Administrator with the user id - DELETE
@administrator.route('/user_id/<int:user_ID>', methods=['DELETE'])
def delete_administrator(user_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Administrator WHERE user_ID = %s', (user_ID,))
        administrator = cursor.fetchone()
        if administrator:
            cursor.execute('DELETE FROM User WHERE user_ID = %s', (user_ID,))  # ON DELETE CASCADE relation
            connection.commit()
            return Response(f'Administrator with user_ID {user_ID} is deleted', status=200)
        return Response(f'Administrator with user_ID {user_ID} does not exist', status=404)
    except Exception as e:
        print(e)
        return Response(f'Administrator with user_ID {user_ID} could not be deleted with exception {e}', status=500)

# Delete Administrator with the employee id - DELETE
# Also delete the user associated with the administrator
@administrator.route('/employee_id/<int:employee_ID>', methods=['DELETE'])
def delete_administrator_with_employee_id(employee_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Administrator WHERE employee_ID = %s', (employee_ID,))
        administrator = cursor.fetchone()
        if administrator:
            user_ID = administrator[0]
            cursor.execute('DELETE FROM User WHERE user_ID = %s', (user_ID,))  # ON DELETE CASCADE relation
            connection.commit()
            return Response(f'Administrator with employee_ID {employee_ID} is deleted', status=200)
        return Response(f'Administrator with employee_ID {employee_ID} does not exist', status=404)
    except Exception as e:
        print(e)
        return Response(f'Administrator with employee_ID {employee_ID} could not be deleted with exception {e}', status=500)