from flask import Blueprint, Response, request, jsonify
from database import get_connection, db
from flask_cors import CORS

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

CORS(db)

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

        # convert breed and species to lowercase
        breed = breed.lower()
        species = species.lower()

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
        return Response(f'Pet could not be created, {e}', status=500)


# Get Pet with the pet ID - GET
@pet.route('/<int:pet_ID>', methods=['GET'])
def get_pet(pet_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("""
                       SELECT *
                       FROM Pet_Shelter_Details_View
                       WHERE pet_ID = %s
                       """, (pet_ID,))
        pet = cursor.fetchone()
        if pet:
            # convert pet to dictionary with keys
            pet = dict(zip([key[0] for key in cursor.description], pet))
            return jsonify(pet)
        return Response(f'Pet with pet_ID {pet_ID} does not exist', status=404)
    except Exception as e:
        print(e)
        return Response(f'Pet with pet_ID {pet_ID} could not be fetched with exception {e}', status=500)
    
# Get Pet with the pet ID - GET
@pet.route('/adopter-pet/<int:pet_ID>', methods=['GET'])
def get_pet_adopter(pet_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("""
                       SELECT *
                       FROM Pet
                       WHERE pet_ID = %s
                       """, (pet_ID,))
        pet = cursor.fetchone()
        if pet:
            # convert pet to dictionary with keys
            pet = dict(zip([key[0] for key in cursor.description], pet))
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
            # convert pets to dictionary with keys
            pets = [dict(zip([key[0] for key in cursor.description], pet)) for pet in pets]
            return jsonify(pets)
    except Exception as e:
        print(e)
        return Response(f'Pets could not be fetched with exception {e}', status=500)
    
# Get all unadopted Pets with Shelter Names - GET
@pet.route('/all/with-shelters', methods=['GET'])
def get_all_pets_with_shelter():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("""
                       SELECT *
                       FROM Pet_Shelter_Details_View
                       """)
        pets = cursor.fetchall()
        if pets:
            # convert pets to dictionary with keys
            pets = [dict(zip([key[0] for key in cursor.description], pet)) for pet in pets]
        return jsonify(pets)
    except Exception as e:
        print(e)
        return Response(f'Pets could not be fetched with exception {e}', status=500)
    
# Get all unadopted Pets with Shelter Names - GET
@pet.route('/all-unadopted-shelter-names', methods=['GET'])
def get_all_unadopted_pets_with_shelter():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("""
                       SELECT *
                       FROM Pet_Shelter_Details_View
                       WHERE adoption_status = 0
                       """)
        pets = cursor.fetchall()
        if pets:
            # convert pets to dictionary with keys
            pets = [dict(zip([key[0] for key in cursor.description], pet)) for pet in pets]
        return jsonify(pets)
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
        cursor.execute('SELECT * FROM Pet WHERE adopter_ID = %s', (adopter_ID,))
        pets = cursor.fetchall()

        # convert pets to dictionary with keys
        pets = [dict(zip([key[0] for key in cursor.description], pet)) for pet in pets]
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
        # convert pets to dictionary with keys
        shelter_pets = [dict(zip([key[0] for key in cursor.description], pet)) for pet in shelter_pets]
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
        # convert pets to dictionary with keys
        unadopted_pets = [dict(zip([key[0] for key in cursor.description], pet)) for pet in unadopted_pets]
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
    
# return the distinct species in the database - GET
@pet.route('/species', methods=['GET'])
def get_species():
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Get distinct species
        cursor.execute('''
            SELECT DISTINCT species
            FROM Pet
        ''')

        species = cursor.fetchall()
        
        return jsonify(species)

    except Exception as e:
        print(e)
        return Response(f'Error fetching species with exception {e}', status=500)
    
# return the distinct breeds in the database - GET
@pet.route('/breeds', methods=['GET'])
def get_breeds():
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Get distinct breeds
        cursor.execute('''
            SELECT DISTINCT breed
            FROM Pet
        ''')

        breeds = cursor.fetchall()
        
        return jsonify(breeds)

    except Exception as e:
        print(e)
        return Response(f'Error fetching breeds with exception {e}', status=500)


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

        # convert breed and species to lowercase
        breed = breed.lower()
        species = species.lower()
        
        # Check if pet exists
        cursor.execute('SELECT * FROM Pet WHERE pet_ID = %s', (pet_ID,))
        existing_pet = cursor.fetchone()
        if not existing_pet:
            return Response(f'Pet with ID {pet_ID} does not exist', status=404)

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
@pet.route('/<int:pet_ID>/delete', methods=['DELETE'])
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
    
# get the shelter name of the pet
@pet.route('/pet_id/<int:pet_ID>/shelter', methods=['GET'])
def get_pet_shelter(pet_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT shelter_name FROM Pet_Shelter_Details WHERE pet_ID = %s', (pet_ID,))
        shelter_name = cursor.fetchone()
        if not shelter_name:
            return Response(f'Shelter for pet with id {pet_ID} does not exist', status=404)
        return jsonify(shelter_name)
    except Exception as e:
        print(e)
        return Response(f'Pet with pet_ID {pet_ID} could not be fetched with exception {e}', status=500)
    
@pet.route('/filter/<int:adopted>', methods=['PUT']) # 0 = unadopted, 1 = all pets except the ones added by the adopter
def filter_pets(adopted):
    try:
        data = request.get_json()

        # Get filter parameters from the request
        species = data['species']
        breed = data['breed']
        age = data['age']
        vaccination_status = data['vaccination_status']
        house_trained_status = data['house_trained_status']
        sex = data['sex']
        neutered_status = data['neutered_status']

        # Start building the query
        query = "SELECT * FROM Pet WHERE 1=1"
        params = []

        # Append to the query and parameters if filters exist
        # check if species is not an empty string
        if species:
            query += " AND species = %s"
            params.append(species)
        if breed:
            query += " AND breed = %s"
            params.append(breed)
        if age:
            query += " AND age = %s"
            params.append(age)
        if vaccination_status:
            query += " AND vaccination_status = %s"
            params.append(vaccination_status)
        if house_trained_status:
            query += " AND house_trained_status = %s"
            params.append(house_trained_status)
        if sex:
            query += " AND sex = %s"
            params.append(sex)
        if neutered_status:
            query += " AND neutered_status = %s"
            params.append(neutered_status)

        if adopted == 0:
            query += " AND adoption_status = 0"

        # Connect to the database and execute the query
        connection = get_connection()
        cursor = connection.cursor()

        # Execute the initial query
        cursor.execute(query, params)
        pets = cursor.fetchall()

        # Check if any pets are found
        if not pets:
            return Response('No pets found with the given filters', status=404)

        # Fetch additional details for each pet
        result = []
        for pet in pets:
            pet_dict = dict(zip([key[0] for key in cursor.description], pet))
            cursor.execute("""
                SELECT *
                FROM Pet_Shelter_Details_View
                WHERE pet_ID = %s
                """, (pet_dict['pet_ID'],))
            
            pet_details = cursor.fetchone()
            if pet_details:
                pet_detail_dict = dict(zip([key[0] for key in cursor.description], pet_details))
                # Merge pet_dict with pet_detail_dict or use one of them as per requirement
                pet_dict.update(pet_detail_dict)
                result.append(pet_dict)

        # Check if no detailed records are found
        if not result:
            return Response('No pets found with the given filters', status=404)
        
        return jsonify(result)
    except Exception as e:
        print(e)
        return Response(f'Error filtering pets with exception {e}', status=500)
    
# filter the pets of a shelter
@pet.route('/filter-by-shelter/<int:shelter_ID>/<int:adopted>', methods=['PUT']) # 0 = unadopted, 1 = all pets 
def filter_pets_by_shelter(shelter_ID, adopted):
    try:
        data = request.get_json()

        # Get filter parameters from the request
        species = data['species']
        breed = data['breed']
        age = data['age']
        vaccination_status = data['vaccination_status']
        house_trained_status = data['house_trained_status']
        sex = data['sex']
        neutered_status = data['neutered_status']

        # Start building the query
        query = "SELECT * FROM Pet WHERE 1=1"
        params = []

        # Append to the query and parameters if filters exist
        # check if species is not an empty string
        if species:
            query += " AND species = %s"
            params.append(species)
        if breed:
            query += " AND breed = %s"
            params.append(breed)
        if age:
            query += " AND age = %s"
            params.append(age)
        if vaccination_status:
            query += " AND vaccination_status = %s"
            params.append(vaccination_status)
        if house_trained_status:
            query += " AND house_trained_status = %s"
            params.append(house_trained_status)
        if sex:
            query += " AND sex = %s"
            params.append(sex)
        if neutered_status:
            query += " AND neutered_status = %s"
            params.append(neutered_status)

        if adopted == 0:
            query += " AND adoption_status = 0"
        
        query += " AND shelter_ID = {0}".format(shelter_ID)

        # Connect to the database and execute the query
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute(query, params)
        pets = cursor.fetchall()
        
         # Check if any pets are found
        if not pets:
            return Response('No pets found with the given filters', status=404)

        # Fetch additional details for each pet
        result = []
        for pet in pets:
            pet_dict = dict(zip([key[0] for key in cursor.description], pet))
            cursor.execute("""
                SELECT *
                FROM Pet_Shelter_Details_View
                WHERE pet_ID = %s
                """, (pet_dict['pet_ID'],))
            
            pet_details = cursor.fetchone()
            if pet_details:
                pet_detail_dict = dict(zip([key[0] for key in cursor.description], pet_details))
                # Merge pet_dict with pet_detail_dict or use one of them as per requirement
                pet_dict.update(pet_detail_dict)
                result.append(pet_dict)

        # Check if no detailed records are found
        if not result:
            return Response('No pets found with the given filters', status=404)
        
        return jsonify(result)
    except Exception as e:
        print(e)
        return Response(f'Error filtering pets with exception {e}', status=500)
    
# Search pets by name - PUT
@pet.route('/search/<int:adopted>', methods=['PUT']) # 0 = unadopted, 1 = all pets except the ones added by the adopter
def search_pet_name(adopted):
    try:
        # Get query parameters for name and city
        data = request.get_json()
        name = data['name']
        
        connection = get_connection()
        cursor = connection.cursor()

        query = "SELECT * FROM Pet_Shelter_Details_View WHERE name LIKE %s"
        params = (f"%{name}%",) # wildcards
        
        if adopted == 0:
            query += " AND adoption_status = 0"
            
        cursor.execute(query, params)
        pets = cursor.fetchall()
        
        if not pets:
            return Response(f'No pets found with the given filters', status=404)

        # Convert pets to a list of dictionaries to return as JSON
        pets = [dict(zip([key[0] for key in cursor.description], pet)) for pet in pets]
        return jsonify(pets)
    
    except Exception as e:
        return Response(f'Error while searching pets: {e}', status=500)
    
# Search pets by name from shelters  - PUT
@pet.route('/search/<int:shelter_ID>/<int:adopted>', methods=['PUT']) # 0 = unadopted, 1 = all pets of the shelter
def search_pet_name_by_shelters(shelter_ID, adopted):
    try:
        # Get query parameters for name and city
        data = request.get_json()
        name = data['name']
        
        connection = get_connection()
        cursor = connection.cursor()

        query = "SELECT * FROM Pet_Shelter_Details_View WHERE name LIKE %s"
        params = (f"%{name}%",) # wildcards
        
        if adopted == 0:
            query += " AND adoption_status = 0"
        
        query += " AND shelter_ID = {0}".format(shelter_ID)
            
        cursor.execute(query, params)
        pets = cursor.fetchall()
        
        if not pets:
            return Response(f'No pets found with the given filters', status=404)

        # Convert pets to a list of dictionaries to return as JSON
        pets = [dict(zip([key[0] for key in cursor.description], pet)) for pet in pets]
        return jsonify(pets)
    
    except Exception as e:
        return Response(f'Error while searching pets: {e}', status=500)
