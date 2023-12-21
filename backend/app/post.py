import datetime
from flask import Blueprint, Response, request, jsonify
from database import get_connection
import pytz

post = Blueprint('post', __name__, url_prefix='/post')

# CRUD
# Create Post - POST
@post.route('/create', methods=['POST'])
def create_post():
    data = request.json
    title = data['title']
    content = data['content']
    post_date = datetime.datetime.now(pytz.timezone('Europe/Istanbul'))
    poster_id = data['poster_ID']
    
    connection = get_connection()
    cursor = connection.cursor()
    # check if poster_id exists
    cursor.execute('SELECT * FROM User WHERE user_ID = %s', (poster_id,))
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
    
    # convert post into dictionary with keys
    post = dict(zip([key[0] for key in cursor.description], post))
    response = jsonify(post)
    response.status_code = 200
    return response

# NOTE: if you need uncomment this endpoint
# # Read A Post with Replies - GET
# @post.route('/<int:post_id>/replies', methods=['GET'])
# def get_post_with_replies(post_id):
#     connection = get_connection()
#     cursor = connection.cursor()
#     cursor.execute('SELECT * FROM Post WHERE post_ID = %s', (post_id,))
#     post = cursor.fetchone()

#     if post is None:
#         response = Response('Post does not exist!', status=400, mimetype='application/json')
#         return response

#     cursor.execute('SELECT * FROM Reply WHERE post_ID = %s', (post_id,))
#     replies = cursor.fetchall()

#     response = jsonify({'post': post, 'replies': replies})
#     response.status_code = 200
#     return response

# Read All Posts - GET
@post.route('/all', methods=['GET'])
def get_all_posts():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM Post')
    posts = cursor.fetchall()
    # convert posts into dictionary with keys
    posts = [dict(zip([key[0] for key in cursor.description], post)) for post in posts]
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
@post.route('/<int:post_id>', methods=['DELETE'])
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
    # convert replies into dictionary with keys
    replies = [dict(zip([key[0] for key in cursor.description], reply)) for reply in replies]
    response = jsonify(replies)
    response.status_code = 200
    return response

# Delete All replies of a post - DELETE
@post.route('/<int:post_id>/replies/delete', methods=['DELETE'])
def delete_all_replies(post_id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('DELETE FROM Reply WHERE post_ID = %s', (post_id,))
    connection.commit()

    response = Response('All replies of the post deleted successfully!', status=200, mimetype='application/json')
    return response

# Get All posts with poster name - GET
@post.route('/all/with-name', methods=['GET'])
def get_all_posts_with_name():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT * from PostWithPosterName')
    posts = cursor.fetchall()
    # convert posts into dictionary with keys
    posts = [dict(zip([key[0] for key in cursor.description], post)) for post in posts]
    response = jsonify(posts)
    response.status_code = 200
    response.mimetype = 'application/json'
    return response

# Get A post with poster name - GET
@post.route('/<int:post_id>/with-name', methods=['GET'])
def get_post_with_name(post_id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT * from PostWithPosterName WHERE post_ID = %s', (post_id,))
    post = cursor.fetchone()

    if post is None:
        response = Response('Post does not exist!', status=400, mimetype='application/json')
        return response
    
    # convert post into dictionary with keys
    post = dict(zip([key[0] for key in cursor.description], post))
    response = jsonify(post)
    response.status_code = 200
    response.mimetype = 'application/json'
    return response
