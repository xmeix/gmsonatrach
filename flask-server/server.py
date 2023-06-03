import joblib
import pandas as pd
from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from functions import rf, predict_classification, preprocess_data
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from pymongo.mongo_client import MongoClient
from functions import train_model
app = Flask(__name__)
CORS(app)  # enable CORS for all routes
# Connect to MongoDB mongodb://myuser:mypassword@localhost:27017/mydatabase


uri = "mongodb+srv://pfeuser:cxjoCXpn3zqJTru7@projetpfe.b2fxjea.mongodb.net/?retryWrites=true&w=majority"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
    db = client["test"]
    missions = db['missions']
    tickets = db['tickets']
    # Print the first 10 documents in the collection
    # trained_model = train_model(missions, tickets)
    # joblib.dump(trained_model, 'trained_model.joblib')
    best_accuracy = 72.5  # the current best accuracy is 57.5
    best_model = None  # Track the best model

    # Perform iterative training
    for i in range(200):
        print('iteration: ', i)
        score, trained_model = train_model(missions, tickets)

        if score > best_accuracy:
            best_accuracy = score
            best_model = trained_model

    # Save the best model
    if best_model is not None:
        joblib.dump(best_model, 'trained_model.joblib')
        print("Best model saved successfully!")
        print("Best accuracy: ", best_accuracy)

except Exception as e:
    print(e)


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json['data']  # Extract the data from the JSON payload
    print(data)

    # Access the second element of the tuple, which is the model

    # Call the predict_classification function
    prediction = predict_classification(data)
    print(prediction)
    # Return the predictions as a JSON response
    return jsonify({'predictions': prediction.tolist()})


if __name__ == '__main__':
    app.run()
