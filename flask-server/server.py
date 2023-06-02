import joblib
import pandas as pd
from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from functions import rf, predict_classification, preprocess_data

app = Flask(__name__)
CORS(app)  # enable CORS for all routes


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json['data']  # Extract the data from the JSON payload

    # predictions = predict_classification(data)  # Call the predict_classification function

    # Return the predictions as a JSON response
    return jsonify({'predictions': "predictions.tolist()"})


if __name__ == '__main__':
    app.run()
