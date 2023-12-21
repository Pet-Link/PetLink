from flask import Blueprint, Response, request, jsonify
from database import get_connection
import datetime

applyadopt = Blueprint('applyadopt', __name__, url_prefix='/applyadopt')

'''
consider the following mysql schemas

CREATE TABLE IF NOT EXISTS Apply_Adopt(
    adopter_ID INT NOT NULL,
    pet_ID INT NOT NULL,
    administrator_ID INT,
    date DATETIME NOT NULL,
    pet_ownership BOOLEAN,
    pet_care_experience INT,
    housing_situation TEXT NOT NULL,
    adoption_reason TEXT NOT NULL,
    approval_status BOOLEAN,
    admin_remarks TEXT,
    FOREIGN KEY(adopter_ID) REFERENCES Adopter(user_ID)
    ON DELETE CASCADE,
    FOREIGN KEY(pet_ID) REFERENCES Pet(pet_ID)
    ON DELETE CASCADE,
    FOREIGN KEY(administrator_ID) REFERENCES Administrator(user_ID)
    ON DELETE CASCADE,
    PRIMARY KEY (adopter_ID, pet_ID)
);
'''


# CRUD operations
# Create Apply_Adopt - POST
@applyadopt.route('/create', methods=['POST'])
def create_applyadopt():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        data = request.get_json()

        adopter_ID = data['adopter_ID']
        pet_ID = data['pet_ID']
        date = datetime.datetime.now()
        pet_ownership = data['pet_ownership']
        pet_care_experience = data['pet_care_experience']
        housing_situation = data['housing_situation']
        adoption_reason = data['adoption_reason']
        approval_status = None

        # Check if the provided adopter ID and pet ID are valid
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID,))
        adopter = cursor.fetchone()
        if not adopter:
            return Response(f'Adopter with ID {adopter_ID} does not exist.', status=404)

        cursor.execute('SELECT * FROM Pet WHERE pet_ID = %s', (pet_ID,))
        pet = cursor.fetchone()
        if not pet:
            return Response(f'Pet with ID {pet_ID} does not exist.', status=404)

        # Check if the pet is already adopted
        cursor.execute('SELECT * FROM Pet WHERE pet_ID = %s AND adoption_status = 1', (pet_ID,))
        adopted_pet = cursor.fetchone()
        if adopted_pet:
            return Response(f'Pet with ID {pet_ID} is already adopted.', status=404)

        # Check if the application already exists
        cursor.execute('SELECT * FROM Apply_Adopt WHERE adopter_ID = %s AND pet_ID = %s', (adopter_ID, pet_ID))
        existing_application = cursor.fetchone()
        if existing_application:
            return Response(f'Application for adopter ID {adopter_ID} and pet ID {pet_ID} already exists',
                            status=409)

        # Check if adopter's balance is enough
        if adopter[4] < pet[13]:  # adopter's balance < pet's adoption fee
            return Response('Adoption cannot be processed. Insufficient balance.', status=400)
        
        # Get the administrator with the least amount of applications
        cursor.execute('''
                        SELECT user_ID
                        FROM Administrator_with_Least_Applications
                        ''')
        admin_result = cursor.fetchone()
        if not admin_result:
            return Response(f'There are no administrators to evaluate this application.', status=404)
        administrator_ID = admin_result[0]

        # Insert into Apply_Adopt table
        cursor.execute('INSERT INTO Apply_Adopt (adopter_ID, pet_ID, administrator_ID, date, pet_ownership, '
                       'pet_care_experience, housing_situation, adoption_reason, approval_status) '
                       'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)',
                       (adopter_ID, pet_ID, administrator_ID, date, pet_ownership, pet_care_experience,
                        housing_situation, adoption_reason, approval_status))

        connection.commit()

        return Response(f'Application for adoption created successfully', status=201)

    except Exception as e:
        print(e)
        return Response(f'Error creating application for adoption with exception {e}', status=500)


# Get Apply_Adopt details by adopter ID and pet ID - GET
@applyadopt.route('/<int:adopter_ID>/<int:pet_ID>', methods=['GET'])
def get_applyadopt(adopter_ID, pet_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Check if the application exists  
        cursor.execute('''
            SELECT *
            FROM Adoption_Application_Details_View a
            WHERE a.adopter_ID = %s AND a.pet_ID = %s
            ''', (adopter_ID, pet_ID))
        
        application = cursor.fetchone()
        if not application:
            return Response(f'Application for adopter ID {adopter_ID} and pet ID {pet_ID} does not exist', status=404)
        # convert the application to a dictionary with the keys
        application = dict(zip([key[0] for key in cursor.description], application))
        return jsonify(application)
    except Exception as e:
        print(e)
        return Response(f'Error fetching application details with exception {e}', status=500)


# Get all Apply_Adopt entries - GET
@applyadopt.route('/all', methods=['GET'])
def get_all_applyadopt():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Apply_Adopt')
        all_applyadopt = cursor.fetchall()
        if all_applyadopt:
            # convert the applications to a dictionary with the keys
            all_applyadopt = [dict(zip([key[0] for key in cursor.description], application)) for application in
                              all_applyadopt]
            return jsonify(all_applyadopt)
        return Response(f'No adoption applications exist', status=404)
    except Exception as e:
        print(e)
        return Response(f'Adoption applications could not be fetched with exception {e}', status=500)


# Get Apply_Adopt records for an administrator - GET
@applyadopt.route('/admin/<int:administrator_ID>', methods=['GET'])
def get_applyadopts_for_admin(administrator_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Check if the administrator exists
        cursor.execute('SELECT * FROM Administrator WHERE user_ID = %s', (administrator_ID,))
        administrator = cursor.fetchone()
        if not administrator:
            return Response(f'Administrator with ID {administrator_ID} does not exist', status=404)

        # Get Apply_Adopt records for the specified administrator
        cursor.execute('''
            SELECT *
            FROM Adoption_Application_Details_View a
            WHERE a.administrator_ID = %s 
            ORDER BY a.date DESC
            ''', (administrator_ID,))
        applyadopts = cursor.fetchall()
        # convert the applications to a dictionary with the keys
        applyadopts = [dict(zip([key[0] for key in cursor.description], application)) for application in applyadopts]
        return jsonify(applyadopts)

    except Exception as e:
        print(e)
        return Response(f'Error fetching Apply_Adopt records for administrator with exception {e}', status=500)


# Get Apply_Adopt records for an adopter - GET
@applyadopt.route('/adopter/<int:adopter_ID>', methods=['GET'])
def get_applyadopts_for_adopter(adopter_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Check if the adopter exists
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID,))
        adopter = cursor.fetchone()
        if not adopter:
            return Response(f'Adopter with ID {adopter_ID} does not exist', status=404)

        # Get Apply_Adopt records for the specified adopter
        cursor.execute('SELECT * FROM Apply_Adopt WHERE adopter_ID = %s', (adopter_ID,))
        applyadopts = cursor.fetchall()

        # convert the applications to a dictionary with the keys
        applyadopts = [dict(zip([key[0] for key in cursor.description], application)) for application in applyadopts]
        return jsonify(applyadopts)

    except Exception as e:
        print(e)
        return Response(f'Error fetching Apply_Adopt records for adopter with exception {e}', status=500)


# Evaluate (approve or reject) Apply_Adopt - PUT
@applyadopt.route('/evaluate/<int:adopter_ID>/<int:pet_ID>', methods=['PUT'])
def evaluate_applyadopt(adopter_ID, pet_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        data = request.get_json()

        approval_status = data['approval_status']
        admin_remarks = data.get('admin_remarks')
        
        # Check if the application was already evaluated
        cursor.execute('SELECT approval_status FROM Apply_Adopt WHERE adopter_ID = %s AND pet_ID = %s', (adopter_ID, pet_ID))
        existing_status = cursor.fetchone()
        
        if existing_status is not None and existing_status[0] is not None:
            # Already evaluated, return a response
            return Response(f'Application for adopter ID {adopter_ID} and pet ID {pet_ID} has already been evaluated.', status=400)

        
        if approval_status == 1:
            # Check if the adopter's balance is enough
            cursor.execute("""
                           SELECT 
                           (a.balance >= p.adoption_fee) AS is_balance_sufficient 
                           FROM Adopter a
                           JOIN Pet p ON a.user_ID = %s AND p.pet_ID = %s
                            """,
                           (adopter_ID, pet_ID))
            
            result = cursor.fetchone()
            if not result or not result[0]:
                return Response('Adoption cannot be processed. Insufficient balance.', status=400)

            # If application is approved, update pet's adopter ID and set as adopted
            cursor.execute('UPDATE Pet SET adopter_ID = %s, adoption_status = 1 WHERE pet_ID = %s',
                           (adopter_ID, pet_ID))

            # Deduct pet's adoption fee from adopter's balance
            cursor.execute('UPDATE Adopter SET balance = balance - (SELECT adoption_fee FROM Pet WHERE pet_ID = %s) WHERE user_ID = %s',
                           (pet_ID, adopter_ID))

        
         # Update the application evaluation
        cursor.execute(
            'UPDATE Apply_Adopt SET approval_status = %s, admin_remarks = %s WHERE adopter_ID = %s AND pet_ID = %s',
            (approval_status, admin_remarks, adopter_ID, pet_ID))
        connection.commit()

        outcome = "approved" if approval_status == 1 else "declined"

        # Return the response with the appropriate message
        return Response(f'Application for adopter ID {adopter_ID} and pet ID {pet_ID} {outcome} successfully', status=200)
        
    except Exception as e:
        connection.rollback()
        print(e)
        return Response(f'Error evaluating application for adoption with exception {e}', status=500)


# Delete Apply_Adopt - DELETE
@applyadopt.route('/delete/<int:adopter_ID>/<int:pet_ID>', methods=['DELETE'])
def delete_applyadopt(adopter_ID, pet_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Check if the application exists
        cursor.execute('SELECT * FROM Apply_Adopt WHERE adopter_ID = %s AND pet_ID = %s', (adopter_ID, pet_ID,))
        application = cursor.fetchone()
        if not application:
            return Response(f'Application for adopter ID {adopter_ID} and pet ID {pet_ID} does not exist', status=404)

        # Delete the application
        cursor.execute('DELETE FROM Apply_Adopt WHERE adopter_ID = %s AND pet_ID = %s', (adopter_ID, pet_ID,))
        connection.commit()

        return Response(f'Application for adopter ID {adopter_ID} and pet ID {pet_ID} deleted successfully', status=200)

    except Exception as e:
        print(e)
        return Response(f'Error deleting application for adoption with exception {e}', status=500)
