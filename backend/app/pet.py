from flask import Blueprint, Response, request, jsonify
from database import get_connection

pet = Blueprint('pet', __name__, url_prefix='/pet')

'''
consider the following mysql schemas

CREATE TABLE IF NOT EXISTS Pet(
    pet_ID INT NOT NULL AUTO_INCREMENT,
    shelter_ID INT,
    adopter_ID INT,
    species VARCHAR(150) NOT NULL,
    breed VARCHAR(150) NOT NULL,
    age INT NOT NULL,
    neutered_status BOOLEAN,
    sex VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    name VARCHAR(150) NOT NULL,
    vaccination_status BOOLEAN,
    house_trained_status BOOLEAN,
    adoption_status BOOLEAN,
    adoption_fee DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY(shelter_ID) REFERENCES Shelter(user_ID)
    ON DELETE SET NULL,
    FOREIGN KEY(adopter_ID) REFERENCES Adopter(user_ID)
    ON DELETE CASCADE,
    PRIMARY KEY (pet_ID)
);
'''


# CRUD operations

# Create Pet - POST
@pet.route('/create', methods=['POST'])
def create_pet():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        data = request.get_json()

        species = data['species']
        breed = data['breed']
        age = data['age']
        neutered_status = data['neutered_status']
        sex = data['sex']
        description = data['description']
        name = data['name']
        vaccination_status = data['vaccination_status']
        house_trained_status = data['house_trained_status']
        adoption_fee = data['adoption_fee']
        adoption_status = 0

        shelter_ID = data.get('shelter_ID')  # Can be None
        adopter_ID = data.get('adopter_ID')  # Can be None

        # Check if only one of shelter_ID or adopter_ID is non-null
        # Since all pets are listed either by shelters to be adopted or by adopters after already being adopted
        if (shelter_ID is None and adopter_ID is None) or (shelter_ID is not None and adopter_ID is not None):
            return Response(f'Only one of shelter_ID or adopter_ID should be non-null.', status=400)

        # Check if the given shelter ID is valid
        if shelter_ID is not None:
            cursor.execute('SELECT * FROM Shelter WHERE user_ID = %s', (shelter_ID,))
            shelter = cursor.fetchone()
            if not shelter:
                return Response(f'Shelter with ID {shelter_ID} does not exist.', status=404)
            adoption_status = 0

        # Check if the given adopter ID is valid
        if adopter_ID is not None:
            cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID,))
            adopter = cursor.fetchone()
            if not adopter:
                return Response(f'Adopter with ID {adopter_ID} does not exist.', status=404)
            adoption_status = 1  # already adopted

        cursor.execute('INSERT INTO Pet (shelter_ID, adopter_ID, species, breed, age, neutered_status, sex, '
                       'description, name, vaccination_status, house_trained_status, adoption_status, adoption_fee) '
                       'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',
                       (shelter_ID, adopter_ID, species, breed, age, neutered_status, sex, description, name,
                        vaccination_status, house_trained_status, adoption_status, adoption_fee))

        connection.commit()

        return Response(f'Pet {name} is created', status=201)
    except Exception as e:
        print(e)
        return Response(f'Pet could not be created with exception {e}', status=500)


# Get Pet with the pet ID - GET
@pet.route('/pet_id/<int:pet_ID>', methods=['GET'])
def get_pet(pet_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Pet WHERE pet_ID = %s', (pet_ID,))
        pet = cursor.fetchone()
        if pet:
            return jsonify(pet)
        return Response(f'Pet with pet_ID {pet_ID} does not exist', status=404)
    except Exception as e:
        print(e)
        return Response(f'Pet with pet_ID {pet_ID} could not be fetched with exception {e}', status=500)


# Get all Pets - GET
@pet.route('/all', methods=['GET'])
def get_all_pets():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Pet')
        pets = cursor.fetchall()
        if pets:
            return jsonify(pets)
        return Response(f'No pets exist', status=404)
    except Exception as e:
        print(e)
        return Response(f'Pets could not be fetched with exception {e}', status=500)

# Get all pets of an adopter - GET
@pet.route('/adopter/<int:adopter_ID>', methods=['GET'])
def get_adopter_pets(adopter_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Check if the adopter exists
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID,))
        adopter = cursor.fetchone()
        if not adopter:
            return Response(f'Adopter with ID {adopter_ID} does not exist', status=404)

        # Get all pets of the adopter
        cursor.execute('SELECT * FROM Pet WHERE adopter_ID = %s', adopter_ID)
        pets = cursor.fetchall()

        return jsonify(pets)

    except Exception as e:
        print(e)
        return Response(f'Error fetching pets for adopter with ID {adopter_ID} with exception {e}', status=500)

# Get all pets (adopted or unadopted) of a shelter - GET
@pet.route('/shelter/<int:shelter_ID>', methods=['GET'])
def get_shelter_pets(shelter_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Check if the shelter exists
        cursor.execute('SELECT * FROM Shelter WHERE user_ID = %s', (shelter_ID,))
        shelter = cursor.fetchone()
        if not shelter:
            return Response(f'Shelter with ID {shelter_ID} does not exist', status=404)

        # Get all pets of the shelter
        cursor.execute('SELECT * FROM Pet WHERE shelter_ID = %s', (shelter_ID,))
        shelter_pets = cursor.fetchall()

        return jsonify(shelter_pets)

    except Exception as e:
        print(e)
        return Response(f'Error fetching pets for shelter with ID {shelter_ID} with exception {e}', status=500)

# Get all unadopted pets of a shelter - GET
@pet.route('/shelter/<int:shelter_ID>/unadopted', methods=['GET'])
def get_unadopted_shelter_pets(shelter_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Check if the shelter exists
        cursor.execute('SELECT * FROM Shelter WHERE user_ID = %s', (shelter_ID,))
        shelter = cursor.fetchone()
        if not shelter:
            return Response(f'Shelter with ID {shelter_ID} does not exist', status=404)

        # Get all unadopted pets of the shelter
        cursor.execute('SELECT * FROM Pet WHERE shelter_ID = %s AND adoption_status = 0', shelter_ID)
        unadopted_pets = cursor.fetchall()

        return jsonify(unadopted_pets)

    except Exception as e:
        print(e)
        return Response(f'Error fetching unadopted pets for shelter with ID {shelter_ID} with exception {e}', status=500)

# Get distinct species, breeds, and counts of unadopted pets for each species for the main page - GET
@pet.route('/species-breeds', methods=['GET'])
def get_species_and_breeds():
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Get distinct species and breeds along with unadopted pet counts
        cursor.execute('''
            SELECT species, breed, COUNT(CASE WHEN adoption_status = 0 THEN 1 ELSE NULL END) AS unadopted_count
            FROM Pet
            GROUP BY species, breed
        ''')

        species_breeds_counts = cursor.fetchall()

        result = {}

        for row in species_breeds_counts:
            species_name, breed_name, unadopted_count = row

            # If species not in result, add it
            if species_name not in result:
                result[species_name] = {}

            # Add breed and unadopted count under the species
            result[species_name][breed_name] = unadopted_count

        return jsonify(result)

    except Exception as e:
        print(e)
        return Response(f'Error fetching species and breeds with exception {e}', status=500)


# Update Pet - PUT
@pet.route('/<int:pet_ID>/update', methods=['PUT'])
def update_pet(pet_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        data = request.get_json()

        species = data['species']
        breed = data['breed']
        age = data['age']
        neutered_status = data['neutered_status']
        sex = data['sex']
        description = data['description']
        name = data['name']
        vaccination_status = data['vaccination_status']
        house_trained_status = data['house_trained_status']
        adoption_status = data['adoption_status']
        adoption_fee = data['adoption_fee']

        cursor.execute('''
                        UPDATE Pet
                        SET species = %s, breed = %s, age = %s, neutered_status = %s, sex = %s, description = %s,
                            name = %s, vaccination_status = %s, house_trained_status = %s, adoption_status = %s,
                            adoption_fee = %s
                        WHERE pet_ID = %s
                        ''',
                       (species, breed, age, neutered_status, sex, description, name, vaccination_status,
                        house_trained_status, adoption_status, adoption_fee, pet_ID))

        connection.commit()

        return Response(f'Pet with pet_ID {pet_ID} updated successfully', status=200)
    except Exception as e:
        print(e)
        return Response(f'Pet with pet_ID {pet_ID} could not be updated with exception {e}', status=500)


# Delete Pet with the pet ID - DELETE
@pet.route('/pet_id/<int:pet_ID>', methods=['DELETE'])
def delete_pet(pet_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Pet WHERE pet_ID = %s', (pet_ID,))
        pet = cursor.fetchone()
        if not pet:
            return Response(f'Pet with pet_ID {pet_ID} does not exist', status=404)

        cursor.execute('DELETE FROM Pet WHERE pet_ID = %s', (pet_ID,))
        connection.commit()

        return Response(f'Pet with pet_ID {pet_ID} is deleted', status=200)

    except Exception as e:
        print(e)
        return Response(f'Pet with pet_ID {pet_ID} could not be deleted with exception {e}', status=500)
