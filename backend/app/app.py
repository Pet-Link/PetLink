import re  
import os
from flask import Flask, render_template, request, redirect, url_for, session
import mysql.connector

app = Flask(__name__) 

app.secret_key = 'abcdefgh'

connection = mysql.connector.connect(host='db',
                                         database='petlink',
                                         user='root',
                                         password='password')

@app.route('/')

# login endpoint for REST API
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Fetch form data
        userDetails = request.form
        username = userDetails['username']
        password = userDetails['password']
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
    app.run(debug=True, host='0.0.0.0', port=port)
