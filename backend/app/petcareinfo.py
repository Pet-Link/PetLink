from flask import Blueprint, Response, request, jsonify
from database import get_connection

petcareinfo = Blueprint('petcareinfo', __name__, url_prefix='/petcareinfo')

'''
CREATE TABLE IF NOT EXISTS PetCareInfo(
    info_ID INT NOT NULL AUTO_INCREMENT,
    content TEXT NOT NULL,
    title VARCHAR(300) NOT NULL,
    administrator_ID INT NOT NULL,
    FOREIGN KEY(administrator_ID) REFERENCES Administrator(user_ID)
    ON DELETE CASCADE,
    PRIMARY KEY (info_ID)
);
'''

# Create Pet Care Info - POST
@petcareinfo.route('/create', methods=['POST'])
def create_petcareinfo():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        data = request.get_json()
        content = data['content']
        title = data['title']
        administrator_ID = data['administrator_ID']

        # Check if the administrator exists
        cursor.execute('SELECT * FROM Administrator WHERE user_ID = %s', (administrator_ID,))
        administrator = cursor.fetchone()

        if not administrator:
            return Response(f'Administrator with user ID {administrator_ID} does not exist', status=409)

        cursor.execute('INSERT INTO PetCareInfo VALUES (%s, %s, %s)', (content, title, administrator_ID))
        connection.commit()
        return Response(f'Pet care info created!', status=201)
    except Exception as e:
        return Response(f'Failed to create pet care info\n{e}', status=500)
    
# Get Pet Care Info - GET
@petcareinfo.route('/<int:info_ID>', methods=['GET'])
def get_petcareinfo(info_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM PetCareInfo WHERE info_ID = %s', (info_ID,))
        petcareinfo = cursor.fetchone()
        if not petcareinfo:
            return Response(f'Pet care info with info ID {info_ID} does not exist', status=404)
        # convert petcareinfo to dictionary with keys
        petcareinfo = dict(zip([key[0] for key in cursor.description], petcareinfo))
        return jsonify(petcareinfo)
    except Exception as e:
        return Response(f'Failed to get pet care info\n{e}', status=500)

# Update Pet Care Info - PUT
@petcareinfo.route('/<int:info_ID>', methods=['PUT'])
def update_petcareinfo(info_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        data = request.get_json()
        content = data['content']
        title = data['title']
        administrator_ID = data['administrator_ID']

        # Check if the administrator exists
        cursor.execute('SELECT * FROM Administrator WHERE user_ID = %s', (administrator_ID,))
        administrator = cursor.fetchone()

        if not administrator:
            return Response(f'Administrator with user ID {administrator_ID} does not exist', status=409)

        cursor.execute('UPDATE PetCareInfo SET content = %s, title = %s, administrator_ID = %s WHERE info_ID = %s', (content, title, administrator_ID, info_ID))
        connection.commit()
        return Response(f'Pet care info updated!', status=200)
    except Exception as e:
        return Response(f'Failed to update pet care info\n{e}', status=500)

# Delete Pet Care Info - DELETE
@petcareinfo.route('/<int:info_ID>', methods=['DELETE'])
def delete_petcareinfo(info_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('DELETE FROM PetCareInfo WHERE info_ID = %s', (info_ID,))
        connection.commit()
        return Response(f'Pet care info deleted!', status=200)
    except Exception as e:
        return Response(f'Failed to delete pet care info\n{e}', status=500)

# Get All Pet Care Info - GET
@petcareinfo.route('/all', methods=['GET'])
def get_all_petcareinfo():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM PetCareInfo')
        petcareinfo = cursor.fetchall()
        if not petcareinfo:
            return Response(f'No pet care info exists', status=404)
        # convert petcareinfo to dictionary with keys
        petcareinfo = [dict(zip([key[0] for key in cursor.description], petcareinfo)) for petcareinfo in petcareinfo]
        return jsonify(petcareinfo)
    except Exception as e:
        return Response(f'Failed to get pet care info\n{e}', status=500)