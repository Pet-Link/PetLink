from datetime import timedelta
from flask import Blueprint, Response, request, jsonify
from database import get_connection
from auxiliary import send_email_mes

appointment = Blueprint('appointment', __name__, url_prefix='/appointment')

# CRUD
# Create Appointment - POST
@appointment.route('/create', methods=['POST'])
def create_appointment():
    connection = get_connection()
    cursor = connection.cursor()
    try:
        # Fetch form data
        appointmentDetails = request.json
        adopter_ID = appointmentDetails['adopter_ID']
        veterinarian_ID = appointmentDetails['veterinarian_ID']
        date = appointmentDetails['date'] # if you get an error consider the seconds of the datetime parameter (00:00:00)
        approval_status = None # default value
        details = appointmentDetails['details']
        pet_ID = appointmentDetails['pet_ID']

        # Check if the adopter exists
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID,))
        adopter = cursor.fetchone()
        if not adopter:
            return Response(f"Adopter with ID {adopter_ID} not found", status=400, mimetype='application/json')

        # Check if the veterinarian exists
        cursor.execute('SELECT * FROM Veterinarian WHERE user_ID = %s', (veterinarian_ID,))
        veterinarian = cursor.fetchone()
        if not veterinarian:
            return Response(f"Veterinarian with ID {veterinarian_ID} not found", status=400, mimetype='application/json')
        
        # Check if the pet exists
        cursor.execute('SELECT * FROM Pet WHERE pet_ID = %s', (pet_ID,))
        pet = cursor.fetchone()
        if not pet:
            return Response(f"Pet with ID {pet_ID} not found", status=400, mimetype='application/json')
        
        # Check if veterinarin is available at the given date and time (30 minutes)
        # COMPLEX QUERY EXAMPLE BETWEEN
        cursor.execute('SELECT * FROM Appointment WHERE veterinarian_ID = %s AND date BETWEEN %s AND %s', (veterinarian_ID, date, str(date + str(timedelta(minutes=30)))))
        appointment = cursor.fetchone()
        if appointment:
            return Response(f"Veterinarian with ID {veterinarian_ID} is not available at the given date and time", status=400, mimetype='application/json')
        
        # Check if the appointment exists
        cursor.execute('SELECT * FROM Appointment WHERE veterinarian_ID = %s AND adopter_ID = %s', (veterinarian_ID, adopter_ID))
        existing_appointment = cursor.fetchone()
        if existing_appointment:
            return Response(f"Appointment already exists.", status=400, mimetype='application/json')

        cursor.execute('INSERT INTO Appointment(adopter_ID, veterinarian_ID, date, pet_ID, approval_status, details) VALUES (%s, %s, %s, %s, %s, %s)', (adopter_ID, veterinarian_ID, date, pet_ID, approval_status, details))
        connection.commit()
        
        return Response('Appointment created', status=200, mimetype='application/json')
    except Exception as e:
        print(e)
        return Response(f"Appointment creation failed with exception: {e}", status=400, mimetype='application/json')
    
# Read Appointment - GET
@appointment.route('/read', methods=['GET'])
def read_appointment():
    connection = get_connection()
    cursor = connection.cursor()
    try:
        # Fetch form data
        appointmentDetails = request.json
        adopter_ID = appointmentDetails['adopter_ID']
        veterinarian_ID = appointmentDetails['veterinarian_ID']

        # Check if the adopter exists
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID))
        adopter = cursor.fetchone()
        if not adopter:
            return Response(f"Adopter with ID {adopter_ID} not found", status=400, mimetype='application/json')

        # Check if the veterinarian exists
        cursor.execute('SELECT * FROM Veterinarian WHERE user_ID = %s', (veterinarian_ID))
        veterinarian = cursor.fetchone()
        if not veterinarian:
            return Response(f"Veterinarian with ID {veterinarian_ID} not found", status=400, mimetype='application/json')

        cursor.execute('SELECT * FROM Appointment WHERE adopter_ID = %s AND veterinarian_ID = %s', (adopter_ID, veterinarian_ID))
        appointment = cursor.fetchone()
        if not appointment:
            return Response(f"Appointment with adopter ID {adopter_ID} and veterinarian ID {veterinarian_ID} not found", status=400, mimetype='application/json')
        # convert appointment to dictionary with keys
        appointment = dict(zip([column[0] for column in cursor.description], appointment))
        return jsonify(appointment)
    except Exception as e:
        print(e)
        return Response(f"Appointment read failed with exception: {e}", status=400, mimetype='application/json')

# Update Appointment - PUT
@appointment.route('/update', methods=['PUT'])
def update_appointment():
    connection = get_connection()
    cursor = connection.cursor()
    try:
        # Fetch form data
        appointmentDetails = request.json
        adopter_ID = appointmentDetails['adopter_ID']
        veterinarian_ID = appointmentDetails['veterinarian_ID']
        date = appointmentDetails['date']
        approval_status = appointmentDetails['approval_status'] # must be a boolean
        details = appointmentDetails['details']
        pet_ID = appointmentDetails['pet_ID'] # cannot be updated

        # Check if the adopter exists
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID,))
        adopter = cursor.fetchone()
        if not adopter:
            return Response(f"Adopter with ID {adopter_ID} not found", status=400, mimetype='application/json')

        # Check if the veterinarian exists
        cursor.execute('SELECT * FROM Veterinarian WHERE user_ID = %s', (veterinarian_ID,))
        veterinarian = cursor.fetchone()
        if not veterinarian:
            return Response(f"Veterinarian with ID {veterinarian_ID} not found", status=400, mimetype='application/json')
        
        # Check if the veterinarian is available at the given date and time (30 minutes)
        # COMPLEX QUERY EXAMPLE BETWEEN
        cursor.execute('SELECT * FROM Appointment WHERE veterinarian_ID = %s AND date BETWEEN %s AND %s', (veterinarian_ID, str(date), str(date + str(timedelta(minutes=30)))))
        appointment = cursor.fetchone()
        if appointment:
            return Response(f"Veterinarian with ID {veterinarian_ID} is not available at the given date and time", status=400, mimetype='application/json')
        
        # get the name of the veterinarian
        cursor.execute('SELECT name FROM User WHERE user_ID = %s', (veterinarian_ID,))
        veterinarian_name = cursor.fetchone()
        veterinarian_name = veterinarian_name[0]

        # get the email of the adopter
        cursor.execute('SELECT e_mail FROM User WHERE user_ID = %s', (adopter_ID,))
        adopter_email = cursor.fetchone()
        adopter_email = adopter_email[0]

        cursor.execute('UPDATE Appointment SET date = %s, approval_status = %s, details = %s WHERE adopter_ID = %s AND veterinarian_ID = %s', (date, approval_status, details, adopter_ID, veterinarian_ID))
        connection.commit()
        
        e_mail_mes = f"Your veterinarian appointment with veterinarian {veterinarian_name}, has been rescheduled to the new date: {date}. Please check your appointments for more details."
        send_email_mes(e_mail_mes, 'Appointment', adopter_email)
        return Response('Appointment updated', status=200, mimetype='application/json')
    except Exception as e:
        print(e)
        return Response(f"Appointment update failed with exception: {e}", status=400, mimetype='application/json')
    
# Delete Appointment - DELETE
@appointment.route('/delete', methods=['DELETE'])
def delete_appointment():
    connection = get_connection()
    cursor = connection.cursor()
    try:
        # Fetch form data
        appointmentDetails = request.json
        adopter_ID = appointmentDetails['adopter_ID']
        veterinarian_ID = appointmentDetails['veterinarian_ID']

        # Check if the adopter exists
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID,))
        adopter = cursor.fetchone()
        if not adopter:
            return Response(f"Adopter with ID {adopter_ID} not found", status=400, mimetype='application/json')

        # Check if the veterinarian exists
        cursor.execute('SELECT * FROM Veterinarian WHERE user_ID = %s', (veterinarian_ID,))
        veterinarian = cursor.fetchone()
        if not veterinarian:
            return Response(f"Veterinarian with ID {veterinarian_ID} not found", status=400, mimetype='application/json')

        cursor.execute('DELETE FROM Appointment WHERE adopter_ID = %s AND veterinarian_ID = %s', (adopter_ID, veterinarian_ID))
        connection.commit()
        return Response('Appointment deleted', status=200, mimetype='application/json')
    except Exception as e:
        print(e)
        return Response(f"Appointment deletion failed with exception: {e}", status=400, mimetype='application/json')

# Get all appointments - GET
@appointment.route('/all', methods=['GET'])
def get_all_appointments():
    connection = get_connection()
    cursor = connection.cursor()
    try:
        cursor.execute('SELECT * FROM Appointment')
        appointments = cursor.fetchall()
        return jsonify(appointments)
    except Exception as e:
        print(e)
        return Response(f"Appointment get all failed with exception: {e}", status=400, mimetype='application/json')
    
# Get all appointments for a specific veterinarian - GET
@appointment.route('/all/<int:veterinarian_ID>', methods=['GET'])
def get_all_appointments_for_veterinarian(veterinarian_ID):
    connection = get_connection()
    cursor = connection.cursor()
    try:
        # Check if the veterinarian exists
        cursor.execute('SELECT * FROM Veterinarian WHERE user_ID = %s', (veterinarian_ID,))
        veterinarian = cursor.fetchone()
        if not veterinarian:
            return Response(f"Veterinarian with ID {veterinarian_ID} not found", status=400, mimetype='application/json')

        cursor.execute(
            """
            SELECT a.*, u.name AS adopter_name, p.breed AS pet_breed, p.species AS pet_species
            FROM Appointment a
            JOIN User u ON a.adopter_ID = u.user_ID
            JOIN Pet p ON a.pet_ID = p.pet_ID
            WHERE a.veterinarian_ID = %s
            """, (veterinarian_ID,))
        appointments = cursor.fetchall()
        # convert appointments to list of dictionaries with keys
        appointments = [dict(zip([key[0] for key in cursor.description], appointment)) for appointment in appointments]
        return jsonify(appointments)
    except Exception as e:
        print(e)
        return Response(f"Appointment get all for veterinarian failed with exception: {e}", status=400, mimetype='application/json')
    
# Get all appointments for a specific adopter - GET
@appointment.route('/all/adopter/<int:adopter_ID>', methods=['GET'])
def get_all_appointments_for_adopter(adopter_ID):
    connection = get_connection()
    cursor = connection.cursor()
    try:
        # Check if the adopter exists
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID,))
        adopter = cursor.fetchone()
        if not adopter:
            return Response(f"Adopter with ID {adopter_ID} not found", status=400, mimetype='application/json')
        
        cursor.execute(
            """
            SELECT a.*, p.name AS pet_name, u.name AS veterinarian_name
            FROM Appointment a
            JOIN User u ON a.veterinarian_ID = u.user_ID
            JOIN Pet p ON a.pet_ID = p.pet_ID
            WHERE a.adopter_ID = %s
            """, (adopter_ID,))
        appointments = cursor.fetchall()
        # convert appointments to list of dictionaries with keys
        appointments = [dict(zip([key[0] for key in cursor.description], appointment)) for appointment in appointments]
        return jsonify(appointments)
    except Exception as e:
        print(e)
        return Response(f"Appointment get all for adopter failed with exception: {e}", status=400, mimetype='application/json')
    
# Approve a specific Appointment - PUT
@appointment.route('/approve', methods=['PUT'])
def approve_appointment():
    connection = get_connection()
    cursor = connection.cursor()
    try:
        # Fetch form data
        appointmentDetails = request.json
        adopter_ID = appointmentDetails['adopter_ID']
        veterinarian_ID = appointmentDetails['veterinarian_ID']

        # Check if the adopter exists
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID,))
        adopter = cursor.fetchone()
        if not adopter:
            return Response(f"Adopter with ID {adopter_ID} not found", status=400, mimetype='application/json')

        # Check if the veterinarian exists
        cursor.execute('SELECT * FROM Veterinarian WHERE user_ID = %s', (veterinarian_ID,))
        veterinarian = cursor.fetchone()
        if not veterinarian:
            return Response(f"Veterinarian with ID {veterinarian_ID} not found", status=400, mimetype='application/json')

        cursor.execute('UPDATE Appointment SET approval_status = %s WHERE adopter_ID = %s AND veterinarian_ID = %s', (True, adopter_ID, veterinarian_ID))
        connection.commit()
        return Response('Appointment approved', status=200, mimetype='application/json')
    except Exception as e:
        print(e)
        return Response(f"Appointment approval failed with exception: {e}", status=400, mimetype='application/json')
    
# Reject a specific Appointment - PUT
@appointment.route('/reject', methods=['PUT'])
def reject_appointment():
    connection = get_connection()
    cursor = connection.cursor()
    try:
        # Fetch form data
        appointmentDetails = request.json
        adopter_ID = appointmentDetails['adopter_ID']
        veterinarian_ID = appointmentDetails['veterinarian_ID']

        # Check if the adopter exists
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID,))
        adopter = cursor.fetchone()
        if not adopter:
            return Response(f"Adopter with ID {adopter_ID} not found", status=400, mimetype='application/json')

        # Check if the veterinarian exists
        cursor.execute('SELECT * FROM Veterinarian WHERE user_ID = %s', (veterinarian_ID,))
        veterinarian = cursor.fetchone()
        if not veterinarian:
            return Response(f"Veterinarian with ID {veterinarian_ID} not found", status=400, mimetype='application/json')

        cursor.execute('UPDATE Appointment SET approval_status = %s WHERE adopter_ID = %s AND veterinarian_ID = %s', (False, adopter_ID, veterinarian_ID))
        connection.commit()
        return Response('Appointment rejected', status=200, mimetype='application/json')
    except Exception as e:
        print(e)
        return Response(f"Appointment rejection failed with exception: {e}", status=400, mimetype='application/json')