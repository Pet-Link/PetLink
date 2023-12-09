from flask import Blueprint, request, jsonify, Response
from database import get_connection

photo = Blueprint('photo', __name__, url_prefix='/photo')

'''
CREATE TABLE IF NOT EXISTS Photo(
    photo_id INT NOT NULL AUTO_INCREMENT,
    pet_ID INT NOT NULL,
    photo_path TEXT NOT NULL,
    FOREIGN KEY(pet_ID) REFERENCES Pet(pet_ID)
    ON DELETE CASCADE,
    PRIMARY KEY (photo_id)
);
'''

# TODO: look into this file

# Create Photo - POST
@photo.route('/create', methods=['POST'])
def create_photo():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        data = request.get_json()
        pet_ID = data['pet_ID']
        photo_path = data['photo_path']

        # Check if the pet exists
        cursor.execute('SELECT * FROM Pet WHERE pet_ID = %s', (pet_ID,))
        pet = cursor.fetchone()

        if not pet:
            return Response(f'Pet with ID {pet_ID} does not exist', status=409)

        cursor.execute('INSERT INTO Photo (pet_ID, photo_path) VALUES (%s, %s)', (pet_ID, photo_path))
        connection.commit()
        return Response(f'Photo created!', status=201)
    except Exception as e:
        return Response(f'Failed to create photo\n{e}', status=500)
    
# Get Photo - GET
@photo.route('/<int:photo_id>', methods=['GET'])
def get_photo(photo_id):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Photo WHERE photo_id = %s', (photo_id,))
        photo = cursor.fetchone()
        if photo:
            return jsonify(photo)
        else:
            return Response(f'Photo with ID {photo_id} does not exist', status=404)
    except Exception as e:
        return Response(f'Failed to get photo\n{e}', status=500)

# Get All Photos - GET
@photo.route('/all', methods=['GET'])
def get_all_photos():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Photo')
        photos = cursor.fetchall()
        if photos:
            return jsonify(photos)
        else:
            return Response(f'No photos exist', status=404)
    except Exception as e:
        return Response(f'Failed to get photos\n{e}', status=500)

# Update Photo - PUT
@photo.route('/update/<int:photo_id>', methods=['PUT'])
def update_photo(photo_id):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        data = request.get_json()
        pet_ID = data['pet_ID']
        photo_path = data['photo_path']

        # Check if the pet exists
        cursor.execute('SELECT * FROM Pet WHERE pet_ID = %s', (pet_ID,))
        pet = cursor.fetchone()

        if not pet:
            return Response(f'Pet with ID {pet_ID} does not exist', status=409)

        cursor.execute('UPDATE Photo SET pet_ID = %s, photo_path = %s WHERE photo_id = %s', (pet_ID, photo_path, photo_id))
        connection.commit()
        return Response(f'Photo updated!', status=200)
    except Exception as e:
        return Response(f'Failed to update photo\n{e}', status=500)
    
# Delete Photo - DELETE
@photo.route('/delete/<int:photo_id>', methods=['DELETE'])
def delete_photo(photo_id):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Photo WHERE photo_id = %s', (photo_id,))
        photo = cursor.fetchone()
        if not photo:
            return Response(f'Photo with ID {photo_id} does not exist', status=404)
        cursor.execute('DELETE FROM Photo WHERE photo_id = %s', (photo_id,))
        connection.commit()
        return Response(f'Photo deleted!', status=200)
    except Exception as e:
        return Response(f'Failed to delete photo\n{e}', status=500)
    
# Delete All Photos of a pet - DELETE
@photo.route('/delete/pet/<int:pet_ID>', methods=['DELETE'])
def delete_all_photos_of_a_pet(pet_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Photo WHERE pet_ID = %s', (pet_ID,))
        photos = cursor.fetchall()
        if not photos:
            return Response(f'Photos with pet ID {pet_ID} do not exist', status=404)
        cursor.execute('DELETE FROM Photo WHERE pet_ID = %s', (pet_ID,))
        connection.commit()
        return Response(f'Photos deleted!', status=200)
    except Exception as e:
        return Response(f'Failed to delete photos\n{e}', status=500)
