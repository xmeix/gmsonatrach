from pymongo import MongoClient
from pymongo.server_api import ServerApi
from pymongo.mongo_client import MongoClient
import pandas as pd
import numpy as np
from csv import reader
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
from sklearn import tree


rf = None

# Load a CSV file


def load_csv(filename):
    dataset = list()
    with open(filename, 'r') as file:
        csv_reader = reader(file)
        for row in csv_reader:
            if not row:
                continue
            dataset.append(row)
    return dataset


def preprocess_data(data):

    data = pd.DataFrame(data)

    # Handle missing values if any
    # Replace missing values with 0.5
    print(data.isnull().sum())
    data = data.fillna(0.5)
    print(data.isnull().sum())
    # Encode categorical variables if any
    # Specify the column names of categorical variables
    categorical_cols = ['structure', 'pays', 'lieuDep',
                        'type']
    label_encoders = {}  # Dictionary to store label encoders for each categorical column

    for col in categorical_cols:
        label_encoder = LabelEncoder()
        data[col] = label_encoder.fit_transform(
            data[col])  # Encode categorical column
        # Store the label encoder for future reference
        label_encoders[col] = label_encoder

    column_types = data.dtypes

    for index, row in data.iterrows():
        if row['budgetConsome'] < row['budget'] and (row['datefinmission'] - row['datedebutmission']) < 7:
            data.at[index, 'last_column'] = "Successful"
        elif row['budgetConsome'] > row['budget'] or (row['datefinmission'] - row['datedebutmission']) > 4:
            data.at[index, 'last_column'] = "Unsuccessful"
            
    print(column_types)
    data['tDateDeb'] = pd.to_datetime(data['tDateDeb'])
    data['tDateRet'] = pd.to_datetime(data['tDateRet'])
    data['dateDifference'] = (
        data['tDateRet'] - data['tDateDeb']).dt.total_seconds() / (24 * 60 * 60)

    data.drop(['tDateDeb', 'tDateRet', '_id', 'uid', 'objetMission', 'budgetConsome',
              'updatedAt', '__v', 'updatedBy', 'createdAt', 'DateDebA', 'DateRetA', 'observation', 'raisonRefus', 'createdBy', 'moyenTransport', 'moyenTransportRet', 'taches'], axis=1, inplace=True)

    print(data.head())
# # Normalize numeric features if necessary
# # Specify the column names of numeric features
# numeric_cols = ['age', 'weight']

# for col in numeric_cols:
#     # Normalize the numeric feature using mean and standard deviation
#     df[col] = (df[col] - df[col].mean()) / df[col].std()

# Return the preprocessed DataFrame and label encoders (if needed)
# return df, label_encoders


def train_model(collection):
    # Update the filename for your classification dataset
    # filename = 'training_data.csv'
    # dataset = pd.read_csv(filename)
    print('training')
    # Fetch the first 10 documents from MongoDB
    dataset = list(collection.find().limit(10))

    preprocess_data(dataset)

#     # print(len(dataset))
#     # print(dataset)
#     # print(dataset.head())
#     # print(dataset.isnull().sum())
#     data = dataset.dropna()
#     # print(len(data))
#     # print(data.head())
#     # print(data.isnull().sum())

#     # data = data.drop(['field','field','field','field'],axis=1)
#     # data.nunique()
#     # from sklearn import preprocessing
#     # data_temp=data
#     # scaler = preprocessing.MinMaxScaler()
#     # names=data_temp.columns
#     # d=scaler.fit_transform(data_temp)
#     # data=pd.DataFrame(d,columns=names)

#     # data['field'].fillna(0.5,inplace=True)
#     # data['field2'].fillna(0.5,inplace=True)

# # df = pd.DataFrame(dataset)

#     # Split the data into training and testing sets
#     # X_train, X_test, y_train, y_test = train_test_split(data.drop(
#     #     "successeful", axis=1), data["successeful"], test_size=0.2, random_state=42)  # Update the target column name
#     X_train = data.drop("successeful", axis=1)
#     y_train = data["successeful"]
#     # print(X_test)
#     # print(X_train)
#     # print(y_test)
#     # print(y_train)

#     dt_model = tree.DecisionTreeClassifier().fit(X_train, y_train)
#     acc_dt = round(dt_model.score(X_train, y_train)*100, 2)
#     print("Accuracy: %s" % acc_dt)

#     randf = RandomForestClassifier(n_estimators=100, random_state=42)
#     # Fit the classifier to the training data
#     rf_model = randf.fit(X_train, y_train)
#     acc_rf = round(rf_model.score(X_train, y_train)*100, 2)
#     print("Accuracy: %s" % acc_rf)
#     print("Model trained successfully!")
#     if acc_dt > acc_rf:
#         return dt_model
#     else:
#         return rf_model
    # return model


def predict_classification(data):
    # Create a DataFrame with the prediction data
    df = pd.DataFrame([data], columns=['nombre_employes',
                      'destination', 'duree_mission', 'budget'])
    # Make a prediction using the trained model
    prediction = rf.predict(df)

    # Return the predicted label
    return prediction[0]


# Connect to MongoDB mongodb://myuser:mypassword@localhost:27017/mydatabase


uri = "mongodb+srv://pfeuser:cxjoCXpn3zqJTru7@projetpfe.b2fxjea.mongodb.net/?retryWrites=true&w=majority"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
    db = client["test"]
    collection = db['missions']
    # Print the first 10 documents in the collection

except Exception as e:
    print(e)


# Train the model and save it
trained_model = train_model(collection)
rf = trained_model
