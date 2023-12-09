import re  
import os
from flask import Flask, render_template, request, redirect, url_for, session
from flask_cors import CORS
from database import db, get_connection
from post import post
from document import document
from appointment import appointment
from user import user
from administrator import administrator

CORS(db)

db.register_blueprint(post)
db.register_blueprint(document)
db.register_blueprint(appointment)
db.register_blueprint(user)
db.register_blueprint(administrator)

# Initialize Flask app
@db.route('/')

# login endpoint for REST API
@db.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Fetch form data
        userDetails = request.form
        username = userDetails['username']  
        password = userDetails['password']
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM users WHERE username = %s AND password = %s', (username, password))
        account = cursor.fetchone()
        if account:
            session['loggedin'] = True
            session['id'] = account[0]
            session['username'] = account[1]
            return redirect(url_for('home'))
        else:
            # Account doesnt exist or username/password incorrect
            return render_template('login.html', msg='Incorrect username/password!')
    return render_template('login.html')

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    db.run(debug=True, host='0.0.0.0', port=port)
