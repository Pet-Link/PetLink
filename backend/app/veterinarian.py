from flask import Blueprint, Response, request, jsonify
from database import get_connection, db
from flask_bcrypt import Bcrypt

veterinarian = Blueprint('veterinarian', __name__, url_prefix='/veterinarian')
bcrypt = Bcrypt(db)

'''
consider the following mysql schemas

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

# Create Veterinarian - POST
# Check if the veterinarian exists if not create a user and then create a veterinarian
@veterinarian.route('/create', methods=['POST'])
def create_veterinarian():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        data = request.get_json()
        name = data['name']
        e_mail = data['e_mail']
        phone_number = data['phone_number']
        password = data['password']
        year_of_experience = data['year_of_experience']
        speciality = data['speciality']

        street = data['street']
        district = data['district']
        apartment_no = data['apartment_no']
        city = data['city']
        zip_no = data['zip']
        country = data['country']

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
        cursor.execute('INSERT INTO Veterinarian (user_ID, year_of_experience, speciality, street, district, '
                       'apartment_no, city, zip, country) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)',
                       (user_ID, year_of_experience, speciality, street, district, apartment_no, city, zip_no, country))
        connection.commit()

        # Return the response with a message
        return Response(f'Veterinarian with user_ID {user_ID} is created', status=201)
    except Exception as e:
        print(e)
        return Response(f'Veterinarian could not be created, {e}', status=500)


# Get Veterinarian with the user id - GET
@veterinarian.route('/user_id/<int:user_ID>', methods=['GET'])
def get_veterinarian(user_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Veterinarian WHERE user_ID = %s', (user_ID,))
        veterinarian = cursor.fetchone()
        if veterinarian:
            return jsonify(veterinarian)
        return Response(f'Veterinarian with user_ID {user_ID} does not exist', status=404)
    except Exception as e:
        print(e)
        return Response(f'Veterinarian with user_ID {user_ID} could not be fetched with exception {e}', status=500)


# Get all Veterinarians - GET
@veterinarian.route('/all', methods=['GET'])
def get_all_veterinarians():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT v.*, u.name AS veterinarian_name FROM Veterinarian v JOIN User u ON v.user_ID = u.user_ID')
        veterinarians = cursor.fetchall()
        if veterinarians:
            veterinarians = [dict(zip([key[0] for key in cursor.description], vet)) for vet in veterinarians]
            return jsonify(veterinarians)
        return Response(f'No veterinarians exist', status=404)
    except Exception as e:
        print(e)
        return Response(f'Veterinarians could not be fetched with exception {e}', status=500)

# Search and filter Veterinarians - PUT
# COMPLEX LIKE QUERY EXAMPLE
@veterinarian.route('/search', methods=['PUT'])
def search_veterinarians():
    try:
        # Get query parameters for name and city
        data = request.get_json()
        name = data['name']
        city = data['city']
        
        connection = get_connection()
        cursor = connection.cursor()

        query = "SELECT v.*, u.name AS veterinarian_name FROM Veterinarian v JOIN User u on v.user_ID = u.user_ID WHERE 1=1"
        params = []

        # Veterinarians can be searched based on name or city or both
        if name:
            query += " AND u.name LIKE %s"
            params.append(f"%{name}%")  # wildcards
        if city:
            query += " AND city = %s"
            params.append(city)
            
        cursor.execute(query, params)
        veterinarians = cursor.fetchall()
        
        if not veterinarians:
            return Response(f'No veterinarians found with the given filters', status=404)

        # Convert veterinarians to a list of dictionaries to return as JSON
        veterinarians = [dict(zip([key[0] for key in cursor.description], vet)) for vet in veterinarians]
        return jsonify(veterinarians)
    
    except Exception as e:
        return Response(f'Error while searching veterinarians: {e}', status=500)


# Update Veterinarian - PUT
# Veterinarians can only update their description and address
# Updating their name, password and phone number should be done from user's endpoint
@veterinarian.route('/<int:user_id>/update', methods=['PUT'])
def update_veterinarian(user_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # check if the user exists
        cursor.execute('SELECT * FROM User WHERE user_ID = %s', (user_ID,))
        result = cursor.fetchone()
        if not result:
            return Response(f'User with id {user_ID} does not exist', 404)

        # check if the user has a veterinarian record
        cursor.execute('SELECT * FROM Veterinarian WHERE user_ID = %s', (user_ID,))
        veterinarian_result = cursor.fetchone()
        if not veterinarian_result:
            return Response(f'User with id {user_ID} does not have a veterinarian record', 404)

        data = request.get_json()
        year_of_experience = data['year_of_experience']
        speciality = data['speciality']
        street = data['street']
        district = data['district']
        apartment_no = data['apartment_no']
        city = data['city']
        zip_no = data['zip']
        country = data['country']

        # update the user
        cursor.execute('''
                        UPDATE Veterinarian
                        SET year_of_experience = %s, speciality = %s, street = %s, district = %s, apartment_no = %s,
                            city = %s, zip_no = %s, country = %s
                        WHERE user_ID = %s 
                        ''',
                       (year_of_experience, speciality, street, district, apartment_no, city, zip_no, country, user_ID))

        # Commit the changes to the database
        connection.commit()

        return Response('Veterinarian updated successfully', 200)
    except Exception as e:
        # return the error
        return Response(f'Veterinarian with user_ID {user_ID} could not be updated with exception {e}', 500)


# Delete Veterinarian with the user id - DELETE
@veterinarian.route('/user_id/<int:user_ID>', methods=['DELETE'])
def delete_veterinarian(user_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Veterinarian WHERE user_ID = %s', (user_ID,))
        veterinarian = cursor.fetchone()
        if not veterinarian:
            return Response(f'Veterinarian with user_ID {user_ID} does not exist', status=404)

        cursor.execute('DELETE FROM User WHERE user_ID = %s', (user_ID,))  # ON DELETE CASCADE relation
        connection.commit()
        return Response(f'Veterinarian with user_ID {user_ID} is deleted', status=200)

    except Exception as e:
        print(e)
        return Response(f'Veterinarian with user_ID {user_ID} could not be deleted with exception {e}', status=500)
    
# return the distinct veterinarian cities in the database - GET
@veterinarian.route('/cities', methods=['GET'])
def get_cities():
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Get distinct cities
        cursor.execute('''
            SELECT DISTINCT city
            FROM Veterinarian
        ''')

        cities = cursor.fetchall()
        
        return jsonify(cities)

    except Exception as e:
        print(e)
        return Response(f'Error fetching cities with exception {e}', status=500)
