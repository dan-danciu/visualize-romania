from flask import Flask, jsonify, request
from datetime import datetime
from flask_cors import CORS
import boto3
import json
import requests

app = Flask(__name__)
CORS(app, origins=["http://ro-viz.webapp.link", "https://ro-viz.webapp.link", "http://localhost:8081"] )

REDIRECT_URI = 'https://eu-semnez.webapp.link/callback'
TOKEN_URI = 'https://auth.eu-semnez.webapp.link/oauth2/token'

@app.route('/', methods = ['GET'])
def check():
    return jsonify(status = 'running'), 200

@app.route('/getapikey', methods = ['GET'])
def getApiKey():
    ssm = boto3.client('ssm', 'eu-west-1')
    maps_api_key = ssm.get_parameter(
        Name='maps_apikey',WithDecryption=False
    )
    api_key = maps_api_key['Parameter']['Value']
    return jsonify(maps_api = api_key), 200

if __name__ == '__main__':
    app.run()
