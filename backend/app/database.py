from flask import Flask
import mysql.connector

db = Flask(__name__) 
db.secret_key = 'abcdefgh'
connection = mysql.connector.connect(host='db',
                                         database='petlink',
                                         user='root',
                                         password='password')

def get_connection():
    return connection