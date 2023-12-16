from flask import Blueprint, Response, request, jsonify
from database import get_connection
import datetime
import uuid

reply = Blueprint('reply', __name__, url_prefix='/reply')

'''
Consider the following schema:

CREATE TABLE IF NOT EXISTS Reply(
    post_ID INT NOT NULL,
    discriminator_ID INT NOT NULL,
    date DATETIME NOT NULL,
    expert_verify_status BOOLEAN,
    content TEXT NOT NULL,
    replier_ID INT NOT NULL,
    FOREIGN KEY(post_ID) REFERENCES Post(post_ID)
    ON DELETE CASCADE,
    FOREIGN KEY(replier_ID) REFERENCES User(user_ID)
    ON DELETE CASCADE,
    PRIMARY KEY (post_ID, discriminator_ID)
);
'''

# Create a reply to a post - POST
@reply.route('/create', methods=['POST'])
def create_reply():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        data = request.get_json()
        post_ID = data['post_ID']
        # create a globally unique identifier for the discriminator_ID
        discriminator_ID = uuid.uuid4().int 
        # trunkate the discriminator_ID to fall into range ot int of mysql
        discriminator_ID = discriminator_ID % 2147483647
        date = datetime.datetime.now()
        expert_verify_status = False
        content = data['content']
        replier_ID = data['replier_ID']

        # Check if the post exists
        cursor.execute('SELECT * FROM Post WHERE post_ID = %s', (post_ID,))
        post = cursor.fetchone()

        if not post:
            return Response(f'Post with ID {post_ID} does not exist', status=409)

        # Check if the user exists
        cursor.execute('SELECT * FROM User WHERE user_ID = %s', (replier_ID,))
        user = cursor.fetchone()

        if not user:
            return Response(f'User with ID {replier_ID} does not exist', status=409)

        cursor.execute('INSERT INTO Reply (post_ID, discriminator_ID, date, expert_verify_status, content, replier_ID) VALUES (%s, %s, %s, %s, %s, %s)', (post_ID, discriminator_ID, date, expert_verify_status, content, replier_ID))
        connection.commit()
        return Response(f'Reply created!', status=201)
    except Exception as e:
        return Response(f'Failed to create reply\n{e}\n{discriminator_ID}', status=500)
    
# Get a reply - GET
@reply.route('/<int:post_ID>/<int:discriminator_ID>', methods=['GET'])
def get_reply(post_ID, discriminator_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Reply WHERE post_ID = %s AND discriminator_ID = %s', (post_ID, discriminator_ID))
        reply = cursor.fetchone()
        if reply:
            # convert reply to dictionary with keys
            reply = dict(zip([key[0] for key in cursor.description], reply))
            return jsonify(reply)
        else:
            return Response(f'Reply with post ID {post_ID} and discriminator ID {discriminator_ID} does not exist', status=404)
    except Exception as e:
        return Response(f'Failed to get reply\n{e}', status=500)
    
# Delete a reply - DELETE
@reply.route('/<int:post_ID>/<int:discriminator_ID>', methods=['DELETE'])
def delete_reply(post_ID, discriminator_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('DELETE FROM Reply WHERE post_ID = %s AND discriminator_ID = %s', (post_ID, discriminator_ID))
        connection.commit()
        return Response(f'Reply with post ID {post_ID} and discriminator ID {discriminator_ID} deleted!', status=200)
    except Exception as e:
        return Response(f'Failed to delete reply\n{e}', status=500)

# Update a reply - PUT
@reply.route('/<int:post_ID>/<int:discriminator_ID>/update', methods=['PUT'])
def update_reply(post_ID, discriminator_ID):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        data = request.get_json()
        content = data['content']

        cursor.execute('UPDATE Reply SET content = %s WHERE post_ID = %s AND discriminator_ID = %s', (content, post_ID, discriminator_ID))
        connection.commit()
        return Response(f'Reply with post ID {post_ID} and discriminator ID {discriminator_ID} updated!', status=200)
    except Exception as e:
        return Response(f'Failed to update reply\n{e}', status=500)
