from flask import Blueprint, Response, request, jsonify
from database import get_connection

medicalrecord = Blueprint('medicalrecord', __name__, url_prefix='/medicalrecord')

'''
Consider the following schema:
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
'''

# Create Medical Record - POST
@medicalrecord.route('/create', methods=['POST'])
def create_medicalrecord():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        data = request.get_json()
        pet_ID = data['pet_ID']
        veterinarian_ID = data['veterinarian_ID']
        date = data['date']
        operation = data['operation']

        # Check if the pet exists
        cursor.execute('SELECT * FROM Pet WHERE pet_ID = %s', (pet_ID,))
        pet = cursor.fetchone()
        # Check if the veterinarian exists
        cursor.execute('SELECT * FROM Veterinarian WHERE user_ID = %s', (veterinarian_ID,))
        veterinarian = cursor.fetchone()

        if not pet:
            return Response(f'Pet with pet ID {pet_ID} does not exist', status=409)
        if not veterinarian:
            return Response(f'Veterinarian with user ID {veterinarian_ID} does not exist', status=409)

        cursor.execute('INSERT INTO MedicalRecord(pet_ID, veterinarian_ID, date, operation) VALUES (%s, %s, %s, %s)', (pet_ID, veterinarian_ID, date, operation))
        connection.commit()
        return Response(f'Medical record created!', status=201)
    except Exception as e:
        return Response(f'Failed to create medical record\n{e}', status=500)
    
# Get Medical Record - GET
@medicalrecord.route('/<int:record_ID>', methods=['GET'])
def get_medicalrecord(record_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM MedicalRecord WHERE record_ID = %s', (record_ID,))
        medicalrecord = cursor.fetchone()
        if not medicalrecord:
            return Response(f'Medical record with record ID {record_ID} does not exist', status=409)
        return jsonify(medicalrecord)
    except Exception as e:
        return Response(f'Failed to get medical record\n{e}', status=500)
    
# Update Medical Record - PUT
@medicalrecord.route('/update/<int:record_ID>', methods=['PUT'])
def update_medicalrecord(record_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        data = request.get_json()
        pet_ID = data['pet_ID']
        veterinarian_ID = data['veterinarian_ID']
        date = data['date']
        operation = data['operation']

        # Check if the pet exists
        cursor.execute('SELECT * FROM Pet WHERE pet_ID = %s', (pet_ID,))
        pet = cursor.fetchone()
        # Check if the veterinarian exists
        cursor.execute('SELECT * FROM Veterinarian WHERE user_ID = %s', (veterinarian_ID,))
        veterinarian = cursor.fetchone()

        if not pet:
            return Response(f'Pet with pet ID {pet_ID} does not exist', status=409)
        if not veterinarian:
            return Response(f'Veterinarian with user ID {veterinarian_ID} does not exist', status=409)

        cursor.execute('UPDATE MedicalRecord (pet_ID, veterinarian_ID, date, operation, record_ID) SET pet_ID = %s, veterinarian_ID = %s, date = %s, operation = %s WHERE record_ID = %s', (pet_ID, veterinarian_ID, date, operation, record_ID))
        connection.commit()
        return Response(f'Medical record updated!', status=200)
    except Exception as e:
        return Response(f'Failed to update medical record\n{e}', status=500)
    
# Delete Medical Record - DELETE
@medicalrecord.route('/delete/<int:record_ID>', methods=['DELETE'])
def delete_medicalrecord(record_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('DELETE FROM MedicalRecord WHERE record_ID = %s', (record_ID,))
        connection.commit()
        return Response(f'Medical record deleted!', status=200)
    except Exception as e:
        return Response(f'Failed to delete medical record\n{e}', status=500)

# Delete all Medical record of a pet - DELETE
@medicalrecord.route('/delete/pet/<int:pet_ID>', methods=['DELETE'])
def delete_medicalrecord_pet(pet_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('DELETE FROM MedicalRecord WHERE pet_ID = %s', (pet_ID,))
        connection.commit()
        return Response(f'Medical record deleted!', status=200)
    except Exception as e:
        return Response(f'Failed to delete medical record\n{e}', status=500)

# Delete all Medical record of a veterinarian - DELETE
@medicalrecord.route('/delete/veterinarian/<int:veterinarian_ID>', methods=['DELETE'])
def delete_medicalrecord_veterinarian(veterinarian_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('DELETE FROM MedicalRecord WHERE veterinarian_ID = %s', (veterinarian_ID,))
        connection.commit()
        return Response(f'Medical record deleted!', status=200)
    except Exception as e:
        return Response(f'Failed to delete medical record\n{e}', status=500)

# Get all Medical Record - GET
@medicalrecord.route('/all', methods=['GET'])
def get_all_medicalrecord():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM MedicalRecord')
        medicalrecord = cursor.fetchall()
        # convert medical record to dictionary with keys
        medicalrecord = [dict(zip([key[0] for key in cursor.description], medicalrecord)) for medicalrecord in medicalrecord]
        return jsonify(medicalrecord)
    except Exception as e:
        return Response(f'Failed to get medical record\n{e}', status=500)

# Get all Medical Record of a pet - GET
@medicalrecord.route('/all/pet/<int:pet_ID>', methods=['GET'])
def get_all_medicalrecord_pet(pet_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM MedicalRecord WHERE pet_ID = %s', (pet_ID,))
        medicalrecord = cursor.fetchall()
        # convert medical record to dictionary with keys
        medicalrecord = [dict(zip([key[0] for key in cursor.description], medicalrecord)) for medicalrecord in medicalrecord]
        return jsonify(medicalrecord)
    except Exception as e:
        return Response(f'Failed to get medical record\n{e}', status=500)
    
# Get all Medical Record of a veterinarian - GET
@medicalrecord.route('/all/veterinarian/<int:veterinarian_ID>', methods=['GET'])
def get_all_medicalrecord_veterinarian(veterinarian_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM MedicalRecord WHERE veterinarian_ID = %s', (veterinarian_ID,))
        medicalrecord = cursor.fetchall()
        # convert medical record to dictionary with keys
        medicalrecord = [dict(zip([key[0] for key in cursor.description], medicalrecord)) for medicalrecord in medicalrecord]
        return jsonify(medicalrecord)
    except Exception as e:
        return Response(f'Failed to get medical record\n{e}', status=500)

# Get all Medical Records of an adopter - GET
@medicalrecord.route('/all/adopter/<int:adopter_ID>', methods=['GET'])
def get_all_medicalrecord_adopter(adopter_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()


        query = '''
        SELECT MedicalRecord.*, Pet.name AS pet_name, User.name AS veterinarian_name
        FROM MedicalRecord
        JOIN Pet ON MedicalRecord.pet_ID = Pet.pet_ID
        JOIN User ON MedicalRecord.veterinarian_ID = User.user_ID
        WHERE Pet.adopter_ID = %s
        '''
        cursor.execute(query, (adopter_ID,))
        records = cursor.fetchall()
        
        if not records:
            return Response(f'No medical records for adopter with ID {adopter_ID} exists.', status=404)
        
        records_dict = [dict(zip([key[0] for key in cursor.description], record)) for record in records]
        return jsonify(records_dict)
    except Exception as e:
        return Response(f'Failed to get medical records for adopter\n{e}', status=500)
