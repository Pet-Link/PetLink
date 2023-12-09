import datetime
from flask import Blueprint, Response, request, jsonify
from database import get_connection

post = Blueprint('post', __name__, url_prefix='/post')

# CRUD
# Create Post - POST
@post.route('/create', methods=['POST'])
def create_post():
    data = request.json
    title = data['title']
    content = data['content']
    post_date = datetime.datetime.now()
    poster_id = data['poster_id']
    
    connection = get_connection()
    cursor = connection.cursor()
    # check if poster_id exists
    cursor.execute('SELECT * FROM User WHERE ID = %s', (poster_id,))
    user = cursor.fetchone()

    if user is None:
        response = Response('User does not exist!', status=400, mimetype='application/json')
        return response
    
    cursor.execute('INSERT INTO Post (title, content, post_date, poster_ID) VALUES (%s, %s, %s, %s)', (title, content, post_date, poster_id))
    connection.commit()

    response = Response('Post created successfully!', status=200, mimetype='application/json')
    return response

# Read Post - GET
@post.route('/<int:post_id>', methods=['GET'])
def get_post(post_id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM Post WHERE post_ID = %s', (post_id,))
    post = cursor.fetchone()

    if post is None:
        response = Response('Post does not exist!', status=400, mimetype='application/json')
        return response

    response = jsonify(post)
    response.status_code = 200
    return response

# Read All Posts - GET
@post.route('/all', methods=['GET'])
def get_all_posts():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM Post')
    posts = cursor.fetchall()

    response = jsonify(posts)
    response.status_code = 200
    return response

# Update Post - PUT
@post.route('/<int:post_id>/update', methods=['PUT'])
def update_post(post_id):
    data = request.get_json()
    title = data['title']
    content = data['content']

    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('UPDATE Post SET title = %s, content = %s WHERE post_ID = %s', (title, content, post_id))
    connection.commit()

    response = Response('Post updated successfully!', status=200, mimetype='application/json')
    return response

# Delete Post - DELETE
@post.route('/<int:post_id>/delete', methods=['DELETE'])
def delete_post(post_id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('DELETE FROM Post WHERE post_ID = %s', (post_id,))
    connection.commit()

    response = Response('Post deleted successfully!', status=200, mimetype='application/json')
    return response

# Get All replies of a post - GET
@post.route('/<int:post_id>/replies', methods=['GET'])
def get_all_replies(post_id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM Reply WHERE post_ID = %s', (post_id,))
    replies = cursor.fetchall()

    response = jsonify(replies)
    response.status_code = 200
    return response

# Detele All replies of a post - DELETE
@post.route('/<int:post_id>/replies/delete', methods=['DELETE'])
def delete_all_replies(post_id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('DELETE FROM Reply WHERE post_ID = %s', (post_id,))
    connection.commit()

    response = Response('All replies of the post deleted successfully!', status=200, mimetype='application/json')
    return response
