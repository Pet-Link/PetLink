from flask import Blueprint, Response, request, jsonify
from database import get_connection

user = Blueprint('shelter', __name__, url_prefix='/shelter')

