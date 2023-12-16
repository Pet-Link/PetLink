from flask import Blueprint, request, jsonify, Response
from database import get_connection

meetandgreet = Blueprint('meetandgreet', __name__, url_prefix='/meetandgreet')

'''
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
'''

# Create Meet and Greet - POST
@meetandgreet.route('/create', methods=['POST'])
def create_meetandgreet():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        data = request.get_json()
        adopter_ID = data['adopter_ID']
        pet_ID = data['pet_ID']
        date = data['date']

        # Check if the adopter exists
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID,))
        adopter = cursor.fetchone()

        if not adopter:
            return Response(f'Adopter with user ID {adopter_ID} does not exist', status=409)

        # Check if the pet exists
        cursor.execute('SELECT * FROM Pet WHERE pet_ID = %s', (pet_ID,))
        pet = cursor.fetchone()

        if not pet:
            return Response(f'Pet with ID {pet_ID} does not exist', status=409)

        cursor.execute('INSERT INTO Meet_Greet VALUES (%s, %s, %s)', (adopter_ID, pet_ID, date))
        connection.commit()
        return Response(f'Meet and greet created!', status=201)
    except Exception as e:
        return Response(f'Failed to create meet and greet\n{e}', status=500)

# Get Meet and Greet - GET
@meetandgreet.route('/<int:adopter_ID>/<int:pet_ID>', methods=['GET'])
def get_meetandgreet(adopter_ID, pet_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Meet_Greet WHERE adopter_ID = %s AND pet_ID = %s', (adopter_ID, pet_ID))
        meetandgreet = cursor.fetchone()
        if meetandgreet:
            return jsonify(meetandgreet)
        else:
            return Response(f'Meet and greet with adopter ID {adopter_ID} and pet ID {pet_ID} does not exist', status=404)
    except Exception as e:
        return Response(f'Failed to get meet and greet\n{e}', status=500)
    
# Update Meet and Greet - PUT
@meetandgreet.route('/update/<int:adopter_ID>/<int:pet_ID>', methods=['PUT'])
def update_meetandgreet(adopter_ID, pet_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        data = request.get_json()
        date = data['date']

        # Check if the meet and greet exists
        cursor.execute('SELECT * FROM Meet_Greet WHERE adopter_ID = %s AND pet_ID = %s', (adopter_ID, pet_ID))
        meetandgreet = cursor.fetchone()

        if not meetandgreet:
            return Response(f'Meet and greet with adopter ID {adopter_ID} and pet ID {pet_ID} does not exist', status=404)

        cursor.execute('UPDATE Meet_Greet SET date = %s WHERE adopter_ID = %s AND pet_ID = %s', (date, adopter_ID, pet_ID))
        connection.commit()
        return Response(f'Meet and greet updated!', status=200)
    except Exception as e:
        return Response(f'Failed to update meet and greet\n{e}', status=500)

# Delete Meet and Greet - DELETE
@meetandgreet.route('/delete/<int:adopter_ID>/<int:pet_ID>', methods=['DELETE'])
def delete_meetandgreet(adopter_ID, pet_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Meet_Greet WHERE adopter_ID = %s AND pet_ID = %s', (adopter_ID, pet_ID))
        meetandgreet = cursor.fetchone()
        if not meetandgreet:
            return Response(f'Meet and greet with adopter ID {adopter_ID} and pet ID {pet_ID} does not exist', status=404)
        cursor.execute('DELETE FROM Meet_Greet WHERE adopter_ID = %s AND pet_ID = %s', (adopter_ID, pet_ID))
        connection.commit()
        return Response(f'Meet and greet deleted!', status=200)
    except Exception as e:
        return Response(f'Failed to delete meet and greet\n{e}', status=500)
    
# Get All Meet and Greets - GET
@meetandgreet.route('/all', methods=['GET'])
def get_all_meetandgreets():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Meet_Greet')
        meetandgreets = cursor.fetchall()
        return jsonify(meetandgreets)
    except Exception as e:
        return Response(f'Failed to get all meet and greets\n{e}', status=500)
    
# Get All Meet and Greets by Adopter ID - GET
@meetandgreet.route('/adopter/<int:adopter_ID>', methods=['GET'])
def get_all_meetandgreets_by_adopter(adopter_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Meet_Greet WHERE adopter_ID = %s', (adopter_ID,))
        meetandgreets = cursor.fetchall()
        return jsonify(meetandgreets)
    except Exception as e:
        return Response(f'Failed to get all meet and greets\n{e}', status=500)
    
# Get All Meet and Greets by Pet ID - GET
@meetandgreet.route('/pet/<int:pet_ID>', methods=['GET'])
def get_all_meetandgreets_by_pet(pet_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Meet_Greet WHERE pet_ID = %s', (pet_ID,))
        meetandgreets = cursor.fetchall()
        return jsonify(meetandgreets)
    except Exception as e:
        return Response(f'Failed to get all meet and greets\n{e}', status=500)
    
# Get All Meet and Greets by Date - GET
@meetandgreet.route('/date/<date>', methods=['GET'])
def get_all_meetandgreets_by_date(date):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Meet_Greet WHERE date = %s', (date,))
        meetandgreets = cursor.fetchall()
        return jsonify(meetandgreets)
    except Exception as e:
        return Response(f'Failed to get all meet and greets\n{e}', status=500)