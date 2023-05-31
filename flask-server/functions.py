import pandas as pd
import numpy as np
from csv import reader
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
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


def train_model():
    # Update the filename for your classification dataset
    filename = 'training_data.csv'
    dataset = pd.read_csv(filename)
    # print(len(dataset))
    # print(dataset)
    # print(dataset.head())
    # print(dataset.isnull().sum())
    data = dataset.dropna()
    # print(len(data))
    # print(data.head())
    # print(data.isnull().sum())

    # data = data.drop(['field','field','field','field'],axis=1)
    # data.nunique()
    # from sklearn import preprocessing
    # data_temp=data
    # scaler = preprocessing.MinMaxScaler()
    # names=data_temp.columns
    # d=scaler.fit_transform(data_temp)
    # data=pd.DataFrame(d,columns=names)

    # data['field'].fillna(0.5,inplace=True)
    # data['field2'].fillna(0.5,inplace=True)

# df = pd.DataFrame(dataset)

    # Split the data into training and testing sets
    # X_train, X_test, y_train, y_test = train_test_split(data.drop(
    #     "successeful", axis=1), data["successeful"], test_size=0.2, random_state=42)  # Update the target column name
    X_train = data.drop("successeful", axis=1)
    y_train = data["successeful"]
    # print(X_test)
    # print(X_train)
    # print(y_test)
    # print(y_train)

    dt_model = tree.DecisionTreeClassifier().fit(X_train, y_train)
    acc_dt = round(dt_model.score(X_train, y_train)*100, 2)
    print("Accuracy: %s" % acc_dt)

    randf = RandomForestClassifier(n_estimators=100, random_state=42)
    # Fit the classifier to the training data
    rf_model = randf.fit(X_train, y_train)
    acc_rf = round(rf_model.score(X_train, y_train)*100, 2)
    print("Accuracy: %s" % acc_rf)
    print("Model trained successfully!")
    if acc_dt > acc_rf:
        return dt_model
    else:
        return rf_model
    # return model


def predict_classification(data):
    # Create a DataFrame with the prediction data
    df = pd.DataFrame([data], columns=['nombre_employes',
                      'destination', 'duree_mission', 'budget'])
    # Make a prediction using the trained model
    prediction = rf.predict(df)

    # Return the predicted label
    return prediction[0]


# Train the model and save it
trained_model = train_model()
rf = trained_model
