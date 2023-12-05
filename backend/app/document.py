from flask import Blueprint, Response, request, jsonify
from database import get_connection
from enums import VerificationStatus

document = Blueprint('document', __name__, url_prefix='/document')

enum_values = [item.value for item in VerificationStatus]

def check_verification_status(verification_status):
    if verification_status not in enum_values:
        return Response(f"Invalid verification status", status=400, mimetype='application/json')
    return None

# CRUD
# Create Document - POST
@document.route('/create', methods=['POST'])
def create_document():
    connection = get_connection()
    cursor = connection.cursor()
    try:
        # Fetch form data
        documentDetails = request.form
        title = documentDetails['title']
        content = documentDetails['content']
        verification_status = VerificationStatus.PENDING.value
        user_ID = documentDetails['user_ID']

        # Check if the user is exist
        cursor.execute('SELECT * FROM User WHERE user_ID = %s', (user_ID))
        user = cursor.fetchone()
        if not user:
            return Response(f"User with ID {user_ID} not found", status=400, mimetype='application/json')

        cursor.execute('INSERT INTO Document(title, content, verification_status, user_ID) VALUES (%s, %s, %s, %s)', (title, content, verification_status, user_ID))
        connection.commit()
        cursor.close()
        return Response('Document created', status=200, mimetype='application/json')
    except Exception as e:
        print(e)
        return Response(f"Document creation failed with exception: {e}", status=400, mimetype='application/json')
    
# Read Document with ID - GET
@document.route('/<int:document_ID>', methods=['GET'])
def read_document(document_ID):
    connection = get_connection()
    cursor = connection.cursor()
    try:
        cursor.execute('SELECT * FROM Document WHERE document_ID = %s', (document_ID))
        document = cursor.fetchone()
        if not document:
            return Response(f"Document with ID {document_ID} not found", status=400, mimetype='application/json')
        cursor.close()
        return jsonify(document)
    except Exception as e:
        print(e)
        return Response(f"Document read failed with exception: {e}", status=400, mimetype='application/json')

# Read All Documents - GET
@document.route('/all', methods=['GET'])
def read_all_documents():
    connection = get_connection()
    cursor = connection.cursor()
    try:
        cursor.execute('SELECT * FROM Document')
        documents = cursor.fetchall()
        cursor.close()
        return jsonify(documents)
    except Exception as e:
        print(e)
        return Response(f"Documents read failed with exception: {e}", status=400, mimetype='application/json')
    
# Update Document with ID - PUT
@document.route('/update/<int:document_ID>', methods=['PUT'])
def update_document(document_ID):
    connection = get_connection()
    cursor = connection.cursor()
    try:
        # Fetch form data
        documentDetails = request.form
        title = documentDetails['title']
        content = documentDetails['content']

        # check if the verification status is valid
        response = check_verification_status(documentDetails['verification_status'])
        if response is not None:
            return response

        verification_status = documentDetails['verification_status']
        user_ID = documentDetails['user_ID']

        # Check if the user is exist
        cursor.execute('SELECT * FROM User WHERE user_ID = %s', (user_ID))
        user = cursor.fetchone()
        if not user:
            return Response(f"User with ID {user_ID} not found", status=400, mimetype='application/json')

        # Check if the document is exist
        cursor.execute('SELECT * FROM Document WHERE document_ID = %s', (document_ID))
        document = cursor.fetchone()
        if not document:
            return Response(f"Document with ID {document_ID} not found", status=400, mimetype='application/json')

        cursor.execute('UPDATE Document SET title = %s, content = %s, verification_status = %s, user_ID = %s WHERE document_ID = %s', (title, content, verification_status, user_ID, document_ID))
        connection.commit()
        cursor.close()
        return Response('Document updated', status=200, mimetype='application/json')
    except Exception as e:
        print(e)
        return Response(f"Document update failed with exception: {e}", status=400, mimetype='application/json')
    
# Approve Document with ID - PUT
@document.route('/approve/<int:document_ID>', methods=['PUT'])
def approve_document(document_ID):
    connection = get_connection()
    cursor = connection.cursor()
    try:
        # Fetch form data
        verification_status = VerificationStatus.APPROVED.value

        # Check if the document is exist
        cursor.execute('SELECT * FROM Document WHERE document_ID = %s', (document_ID))
        document = cursor.fetchone()
        if not document:
            return Response(f"Document with ID {document_ID} not found", status=400, mimetype='application/json')

        cursor.execute('UPDATE Document SET verification_status = %s WHERE document_ID = %s', (verification_status, document_ID))
        connection.commit()
        cursor.close()
        return Response('Document approved', status=200, mimetype='application/json')
    except Exception as e:
        print(e)
        return Response(f"Document approval failed with exception: {e}", status=400, mimetype='application/json')
    
# Reject Document with ID - PUT
@document.route('/reject/<int:document_ID>', methods=['PUT'])
def reject_document(document_ID):
    connection = get_connection()
    cursor = connection.cursor()
    try:
        # Fetch form data
        verification_status = VerificationStatus.REJECTED.value

        # Check if the document is exist
        cursor.execute('SELECT * FROM Document WHERE document_ID = %s', (document_ID))
        document = cursor.fetchone()
        if not document:
            return Response(f"Document with ID {document_ID} not found", status=400, mimetype='application/json')

        cursor.execute('UPDATE Document SET verification_status = %s WHERE document_ID = %s', (verification_status, document_ID))
        connection.commit()
        cursor.close()
        return Response('Document rejected', status=200, mimetype='application/json')
    except Exception as e:
        print(e)
        return Response(f"Document rejection failed with exception: {e}", status=400, mimetype='application/json')

# Delete Document with ID - DELETE
@document.route('/delete/<int:document_ID>', methods=['DELETE'])
def delete_document(document_ID):
    connection = get_connection()
    cursor = connection.cursor()
    try:
        # Check if the document is exist
        cursor.execute('SELECT * FROM Document WHERE document_ID = %s', (document_ID))
        document = cursor.fetchone()
        if not document:
            return Response(f"Document with ID {document_ID} not found", status=400, mimetype='application/json')

        cursor.execute('DELETE FROM Document WHERE document_ID = %s', (document_ID))
        connection.commit()
        cursor.close()
        return Response(f'Document with id {document_ID} has been deleted!', status=200, mimetype='application/json')
    except Exception as e:
        print(e)
        return Response(f"Document deletion failed with exception: {e}", status=400, mimetype='application/json')