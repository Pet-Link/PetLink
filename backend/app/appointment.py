from flask import Blueprint, Response, request, jsonify
from database import get_connection

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
        approval_status = False
        details = appointmentDetails['details']

        # Check if the adopter is exist
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID))
        adopter = cursor.fetchone()
        if not adopter:
            return Response(f"Adopter with ID {adopter_ID} not found", status=400, mimetype='application/json')

        # Check if the veterinarian is exist
        cursor.execute('SELECT * FROM Veterinarian WHERE user_ID = %s', (veterinarian_ID))
        veterinarian = cursor.fetchone()
        if not veterinarian:
            return Response(f"Veterinarian with ID {veterinarian_ID} not found", status=400, mimetype='application/json')

        cursor.execute('INSERT INTO Appointment(adopter_ID, veterinarian_ID, date, approval_status, details) VALUES (%s, %s, %s, %s, %s)', (adopter_ID, veterinarian_ID, date, approval_status, details))
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

        # Check if the adopter is exist
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID))
        adopter = cursor.fetchone()
        if not adopter:
            return Response(f"Adopter with ID {adopter_ID} not found", status=400, mimetype='application/json')

        # Check if the veterinarian is exist
        cursor.execute('SELECT * FROM Veterinarian WHERE user_ID = %s', (veterinarian_ID))
        veterinarian = cursor.fetchone()
        if not veterinarian:
            return Response(f"Veterinarian with ID {veterinarian_ID} not found", status=400, mimetype='application/json')

        cursor.execute('SELECT * FROM Appointment WHERE adopter_ID = %s AND veterinarian_ID = %s', (adopter_ID, veterinarian_ID))
        appointment = cursor.fetchone()
        if not appointment:
            return Response(f"Appointment with adopter ID {adopter_ID} and veterinarian ID {veterinarian_ID} not found", status=400, mimetype='application/json')
        
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

        # Check if the adopter is exist
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID))
        adopter = cursor.fetchone()
        if not adopter:
            return Response(f"Adopter with ID {adopter_ID} not found", status=400, mimetype='application/json')

        # Check if the veterinarian is exist
        cursor.execute('SELECT * FROM Veterinarian WHERE user_ID = %s', (veterinarian_ID))
        veterinarian = cursor.fetchone()
        if not veterinarian:
            return Response(f"Veterinarian with ID {veterinarian_ID} not found", status=400, mimetype='application/json')

        cursor.execute('UPDATE Appointment SET date = %s, approval_status = %s, details = %s WHERE adopter_ID = %s AND veterinarian_ID = %s', (date, approval_status, details, adopter_ID, veterinarian_ID))
        connection.commit()
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

        # Check if the adopter is exist
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID))
        adopter = cursor.fetchone()
        if not adopter:
            return Response(f"Adopter with ID {adopter_ID} not found", status=400, mimetype='application/json')

        # Check if the veterinarian is exist
        cursor.execute('SELECT * FROM Veterinarian WHERE user_ID = %s', (veterinarian_ID))
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
        # Check if the veterinarian is exist
        cursor.execute('SELECT * FROM Veterinarian WHERE user_ID = %s', (veterinarian_ID))
        veterinarian = cursor.fetchone()
        if not veterinarian:
            return Response(f"Veterinarian with ID {veterinarian_ID} not found", status=400, mimetype='application/json')

        cursor.execute('SELECT * FROM Appointment WHERE veterinarian_ID = %s', (veterinarian_ID))
        appointments = cursor.fetchall()
        return jsonify(appointments)
    except Exception as e:
        print(e)
        return Response(f"Appointment get all for veterinarian failed with exception: {e}", status=400, mimetype='application/json')
    
# Get all appointments for a specific adopter - GET
@appointment.route('/all/<int:adopter_ID>', methods=['GET'])
def get_all_appointments_for_adopter(adopter_ID):
    connection = get_connection()
    cursor = connection.cursor()
    try:
        # Check if the adopter is exist
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID))
        adopter = cursor.fetchone()
        if not adopter:
            return Response(f"Adopter with ID {adopter_ID} not found", status=400, mimetype='application/json')

        cursor.execute('SELECT * FROM Appointment WHERE adopter_ID = %s', (adopter_ID))
        appointments = cursor.fetchall()
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

        # Check if the adopter is exist
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID))
        adopter = cursor.fetchone()
        if not adopter:
            return Response(f"Adopter with ID {adopter_ID} not found", status=400, mimetype='application/json')

        # Check if the veterinarian is exist
        cursor.execute('SELECT * FROM Veterinarian WHERE user_ID = %s', (veterinarian_ID))
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

        # Check if the adopter is exist
        cursor.execute('SELECT * FROM Adopter WHERE user_ID = %s', (adopter_ID))
        adopter = cursor.fetchone()
        if not adopter:
            return Response(f"Adopter with ID {adopter_ID} not found", status=400, mimetype='application/json')

        # Check if the veterinarian is exist
        cursor.execute('SELECT * FROM Veterinarian WHERE user_ID = %s', (veterinarian_ID))
        veterinarian = cursor.fetchone()
        if not veterinarian:
            return Response(f"Veterinarian with ID {veterinarian_ID} not found", status=400, mimetype='application/json')

        cursor.execute('UPDATE Appointment SET approval_status = %s WHERE adopter_ID = %s AND veterinarian_ID = %s', (False, adopter_ID, veterinarian_ID))
        connection.commit()
        return Response('Appointment rejected', status=200, mimetype='application/json')
    except Exception as e:
        print(e)
        return Response(f"Appointment rejection failed with exception: {e}", status=400, mimetype='application/json')