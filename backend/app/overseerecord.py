from flask import Blueprint, Response, request, jsonify
from database import get_connection

overseerecord = Blueprint('overseerecord', __name__, url_prefix='/overseerecord')

'''
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
'''

# Create Overseer Record - POST
@overseerecord.route('/create', methods=['POST'])
def create_overseerecord():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        data = request.get_json()
        administrator_ID = data['administrator_ID']
        adopter_ID = data['adopter_ID']
        date = data['date']
        details = data['details']
        verification_status = 'True' ==  data['verification_status'] # if the value is 'True', then it is True, otherwise it is False

        # Check if the administrator exists
        cursor.execute('SELECT * FROM Administrator WHERE user_ID = %s', (administrator_ID,))
        administrator = cursor.fetchone()

        if not administrator:
            return Response(f'Administrator with user ID {administrator_ID} does not exist', status=409)

        # Check if the adopter exists
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID,))
        adopter = cursor.fetchone()

        if not adopter:
            return Response(f'Adopter with user ID {adopter_ID} does not exist', status=409)

        cursor.execute('INSERT INTO OverseeRecord VALUES (%s, %s, %s, %s, %s, %s)', (administrator_ID, adopter_ID, date, details, verification_status))
        connection.commit()
        return Response(f'Overseer record created!', status=201)
    except Exception as e:
        return Response(f'Failed to create overseer record\n{e}', status=500)
    
# Get Overseer Record - GET
@overseerecord.route('/<int:record_ID>', methods=['GET'])
def get_overseerecord(record_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM OverseeRecord WHERE record_ID = %s', (record_ID,))
        overseerecord = cursor.fetchone()
        if not overseerecord:
            return Response(f'Overseer record with record ID {record_ID} does not exist', status=404)
        return jsonify(overseerecord)
    except Exception as e:
        return Response(f'Failed to get overseer record\n{e}', status=500)
    
# Update Overseer Record - PUT
@overseerecord.route('/<int:record_ID>', methods=['PUT'])
def update_overseerecord(record_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        data = request.get_json()
        administrator_ID = data['administrator_ID']
        adopter_ID = data['adopter_ID']
        date = data['date']
        details = data['details']
        verification_status = 'True' ==  data['verification_status'] # if the value is 'True', then it is True, otherwise it is False

        # Check if the administrator exists
        cursor.execute('SELECT * FROM Administrator WHERE user_ID = %s', (administrator_ID,))
        administrator = cursor.fetchone()

        if not administrator:
            return Response(f'Administrator with user ID {administrator_ID} does not exist', status=409)

        # Check if the adopter exists
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID,))
        adopter = cursor.fetchone()

        if not adopter:
            return Response(f'Adopter with user ID {adopter_ID} does not exist', status=409)

        cursor.execute('UPDATE OverseeRecord SET administrator_ID = %s, adopter_ID = %s, date = %s, details = %s, verification_status = %s WHERE record_ID = %s', (administrator_ID, adopter_ID, date, details, verification_status, record_ID))
        connection.commit()
        return Response(f'Overseer record updated!', status=200)
    except Exception as e:
        return Response(f'Failed to update overseer record\n{e}', status=500)
    
# Get overseer records by adopter ID - GET
@overseerecord.route('/adopter/<int:adopter_ID>', methods=['GET'])
def get_overseerecord_by_adopter(adopter_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM OverseeRecord WHERE adopter_ID = %s', (adopter_ID,))
        overseerecords = cursor.fetchall()
        if not overseerecords:
            return Response(f'Overseer records with adopter ID {adopter_ID} do not exist', status=404)
        return jsonify(overseerecords)
    except Exception as e:
        return Response(f'Failed to get overseer records\n{e}', status=500)
    
# Get overseer records by administrator ID - GET
@overseerecord.route('/administrator/<int:administrator_ID>', methods=['GET'])
def get_overseerecord_by_administrator(administrator_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM OverseeRecord WHERE administrator_ID = %s', (administrator_ID,))
        overseerecords = cursor.fetchall()
        if not overseerecords:
            return Response(f'Overseer records with administrator ID {administrator_ID} do not exist', status=404)
        return jsonify(overseerecords)
    except Exception as e:
        return Response(f'Failed to get overseer records\n{e}', status=500)
    
# Delete Overseer Record - DELETE
@overseerecord.route('/<int:record_ID>', methods=['DELETE'])
def delete_overseerecord(record_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('DELETE FROM OverseeRecord WHERE record_ID = %s', (record_ID,))
        connection.commit()
        return Response(f'Overseer record deleted!', status=200)
    except Exception as e:
        return Response(f'Failed to delete overseer record\n{e}', status=500)
    
# Get All Overseer Records - GET
@overseerecord.route('/all', methods=['GET'])
def get_all_overseerecords():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM OverseeRecord')
        overseerecords = cursor.fetchall()
        if not overseerecords:
            return Response(f'Overseer records do not exist', status=404)
        return jsonify(overseerecords)
    except Exception as e:
        return Response(f'Failed to get overseer records\n{e}', status=500)
    
# Get All Overseer Records by verification status - GET
@overseerecord.route('/verification_status/<int:verification_status>', methods=['GET'])
def get_all_overseerecords_by_verification_status(verification_status):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM OverseeRecord WHERE verification_status = %s', (verification_status,))
        overseerecords = cursor.fetchall()
        if not overseerecords:
            return Response(f'Overseer records with verification status {verification_status} do not exist', status=404)
        return jsonify(overseerecords)
    except Exception as e:
        return Response(f'Failed to get overseer records\n{e}', status=500)

# Delete All Overseer Records of a certain Administrator - DELETE
@overseerecord.route('/administrator/<int:administrator_ID>', methods=['DELETE'])
def delete_all_overseerecords_by_administrator(administrator_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('DELETE FROM OverseeRecord WHERE administrator_ID = %s', (administrator_ID,))
        connection.commit()
        return Response(f'Overseer records deleted!', status=200)
    except Exception as e:
        return Response(f'Failed to delete overseer records\n{e}', status=500)
