
import pandas as pd
import numpy as np
from csv import reader
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import MinMaxScaler
import joblib
from sklearn.preprocessing import OneHotEncoder
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


def preprocess_row(row):
    # Convert the row to a DataFrame
    row = pd.DataFrame([row])

    # Handle missing values if any
    row = row.fillna(0.5)

    # Convert 'tDateRet' and 'tDateDeb' columns to datetime
    row['tDateRet'] = pd.to_datetime(row['tDateRet'])
    row['tDateDeb'] = pd.to_datetime(row['tDateDeb'])

    # Calculate the duration as timedelta
    diff = row['tDateRet'] - row['tDateDeb']
    # Extract the duration in days
    duration_days = diff.dt.days
    # Store the duration in a new column
    row['duree'] = duration_days

    # Load the label encoders
    label_encoders = joblib.load('codifications.joblib')

    columns_to_update = ['structure', 'type', 'pays', 'destination']

    # Iterate over the specified columns and update the label encoders
    for col in columns_to_update:
        if col in row.columns and col in label_encoders:
            # Get unique values in the column
            unique_values = row[col].unique()

            # Add new values to the label encoder
            new_values = set(unique_values) - set(label_encoders[col].classes_)
            if new_values:
                label_encoder = label_encoders[col]
                label_encoder.classes_ = np.concatenate(
                    [label_encoder.classes_, list(new_values)])
                label_encoders[col] = label_encoder

            # Transform the values using the updated label encoder
            label_encoder = label_encoders[col]
            row[col] = label_encoder.transform(row[col])

    # Calculate employees count
    employes = row.at[0, "employes"]  # Get the array from the "taches" column
    row.at[0, "NbEmployes"] = len(employes)

    # Drop unnecessary columns
    columns_to_drop = ['oldDuree', 'employes', 'taches', 'etat', 'tDateDeb', 'tDateRet', '_id', 'uid', 'objetMission', 'budgetConsome', 'NbTachesAccomplies', 'NbTachesTotal', 'NbTickets',
                       'updatedAt', '__v', 'updatedBy', 'createdAt', 'DateDebA', 'DateRetA', 'observation', 'raisonRefus', 'createdBy', 'moyenTransport', 'lieuDep', 'moyenTransportRet']
    columns_to_drop_existing = [
        col for col in columns_to_drop if col in row.columns]
    row = row.drop(columns_to_drop_existing, axis=1)

    scaler = joblib.load('scaler.joblib')
    numerical_features = ['structure', 'type', 'budget',
                          'pays', 'destination', 'NbEmployes', 'duree']

    row = scaler.transform(row[numerical_features])

    print(row)
    return row


def preprocess_data(datasetMissions, datasetTickets):

    datasetMissions = pd.DataFrame(datasetMissions)
    datasetTickets = pd.DataFrame(datasetTickets)

    # print(len(datasetMissions))
    # get only data that has etat ==="terminée"
    datasetMissions = datasetMissions[datasetMissions['etat'] == 'terminée']
    # print(len(datasetMissions))

    # Handle missing values if any
    # Replace missing values with 0.5
    # print(datasetMissions.isnull().sum())
    datasetMissions = datasetMissions.fillna(0.5)
    # print(datasetMissions.isnull().sum())
    # Encode categorical variables if any
    # Specify the column names of categorical variables
    categorical_cols = ['structure', 'pays', 'type', 'destination']
    label_encoders = {}  # Dictionary to store label encoders for each categorical column

    for col in categorical_cols:
        label_encoder = LabelEncoder()
        datasetMissions[col] = label_encoder.fit_transform(
            datasetMissions[col])  # Encode categorical column
        # Store the label encoder for future reference
        label_encoders[col] = label_encoder

    joblib.dump(label_encoders, 'codifications.joblib')
# ____________________________________________________________________________________
    # GETTING CRITERIA ITEMS#
# ____________________________________________________________________________________

    # Iterate over each row in the DataFrame
    for index, row in datasetMissions.iterrows():
        taches = row["taches"]  # Get the array from the "taches" column
        # Filter the array based on the "state" field and calculate the length
        filtered_length = len(
            [tache for tache in taches if tache["state"] == "accomplie"])

        # Replace the value in the "taches" column with the filtered length
        datasetMissions.at[index, "NbTachesAccomplies"] = filtered_length
        datasetMissions.at[index, "NbTachesTotal"] = len(taches)

        # Iterate over each row in the DataFrame
    for index, row in datasetMissions.iterrows():
        employes = row["employes"]  # Get the array from the "taches" column
        # Filter the array based on the "state" field and calculate the length
        datasetMissions.at[index, "NbEmployes"] = len(employes)
        # GETTING NB TICKETS TOTALE FOR EACH MISSION
        # Iterate over each mission
    for index, mission in datasetMissions.iterrows():
        mission_id = mission['_id']
        # Filter the ticket dataset for the current mission
        mission_tickets = datasetTickets[datasetTickets['mission'] == mission_id]
        # Count the number of tickets for the current mission
        num_tickets = len(mission_tickets)
        # Update the NumTickets column in the mission dataset
        datasetMissions.at[index, 'NbTickets'] = num_tickets

    for index, mission in datasetMissions.iterrows():
        mission_id = mission['_id']
        # Filter the ticket dataset for the current mission and solved tickets
        mission_tickets = datasetTickets[(datasetTickets['mission'] == mission_id) & (
            datasetTickets['isSolved'] == True)]
        # Count the number of solved tickets for the current mission
        num_solved_tickets = len(mission_tickets)
        # Update the NumSolvedTickets column in the mission dataset
        datasetMissions.at[index, 'NbTicketsCloture'] = num_solved_tickets

    for index, mission in datasetMissions.iterrows():
        # Calculate the duration as timedelta
        # Convert 'tDateRet' and 'tDateDeb' columns to datetime
        mission['tDateRet'] = pd.to_datetime(mission['tDateRet'])
        mission['tDateDeb'] = pd.to_datetime(mission['tDateDeb'])

        diff = mission['tDateRet'] - mission['tDateDeb']
        # Extract the duration in days
        duration_days = diff.days
        # Store the duration in a new column
        datasetMissions.at[index, 'duree'] = duration_days
# ____________________________________________________________________________________
    # FIXING CRITERIA #
# ____________________________________________________________________________________

    for index, row in datasetMissions.iterrows():
        resultat = 0

        if float(row['budgetConsome']) <= float(row['budget']):
            resultat += 1

        if row['duree'] <= row['oldDuree']:
            resultat += 1

        if row['NbTachesAccomplies'] == row['NbTachesTotal']:
            resultat += 1

        if row['NbTickets'] == row['NbTicketsCloture']:
            resultat += 1

        datasetMissions.at[index, 'resultat'] = resultat
# ____________________________________________________________________________________
    # Dropping Stuff #
# ____________________________________________________________________________________

    columns_to_drop = ['oldDuree', 'employes', 'taches', 'etat', 'tDateDeb', 'tDateRet', '_id', 'uid', 'objetMission', 'budgetConsome', 'NbTachesAccomplies', 'NbTachesTotal',
                       'NbTickets', 'NbTicketsCloture', 'updatedAt', '__v', 'updatedBy', 'createdAt', 'DateDebA', 'DateRetA',
                       'observation', 'raisonRefus', 'createdBy', 'moyenTransport', 'lieuDep', 'moyenTransportRet']

    existing_columns = [
        col for col in columns_to_drop if col in datasetMissions.columns]
    datasetMissions.drop(existing_columns, axis=1, inplace=True)
# ____________________________________________________________________________________
    # Normalizing Stuff #
# ____________________________________________________________________________________
    # # Normalize numeric features

    numerical_features = ['structure', 'type', 'budget',
                          'pays', 'destination', 'NbEmployes', 'duree']

    # Create a MinMaxScaler object
    scaler = MinMaxScaler()
    # Fit the scaler on the numerical features
    scaler.fit(datasetMissions[numerical_features])
    # Transform the numerical features using the scaler
    normalized_features = scaler.transform(datasetMissions[numerical_features])
    # Create a new DataFrame with the normalized features
    normalized_data = pd.DataFrame(
        normalized_features, columns=numerical_features)
    joblib.dump(scaler, 'scaler.joblib')

    # Concatenate the normalized features with the non-numerical features and target variable
    datasetMissions = pd.concat(
        [normalized_data, datasetMissions[['resultat']]], axis=1)

    # print(datasetMissions)
    return datasetMissions


def train_model(missions, tickets):

    print('training')
    # Fetch the first 10 documents from MongoDB
    datasetMissions = list(missions.find())
    datasetTickets = list(tickets.find())

    data = preprocess_data(datasetMissions, datasetTickets)

    print("data training:", data.head())
    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(data.drop(
        "resultat", axis=1), data["resultat"], test_size=0.2)

    dt_model = tree.DecisionTreeClassifier().fit(X_train, y_train)
    acc_dt = round(dt_model.score(X_test, y_test)*100, 2)
    print("Accuracy: %s" % acc_dt)

    randf = RandomForestClassifier(n_estimators=100)
    rf_model = randf.fit(X_train, y_train)
    acc_rf = round(rf_model.score(X_test, y_test)*100, 2)
    print("Accuracy: %s" % acc_rf)
    # print("Model trained successfully!")

    if acc_dt > acc_rf:
        return acc_dt, dt_model
    else:
        return acc_rf, rf_model

# structure  type    budget      pays  destination  NbEmployes     duree  resultat

def predict_classification(data):
    # Perform preprocessing on the input data
    model = joblib.load('trained_model.joblib')

    preprocessed_row = preprocess_row(data)
    column_names = ['structure', 'type', 'budget',
                    'pays', 'destination', 'NbEmployes', 'duree']

    # Create a new DataFrame with the preprocessed row
    preprocessed_df = pd.DataFrame(preprocessed_row, columns=column_names)
    print(preprocessed_df)
    # Make predictions using the trained model
    prediction = model.predict(preprocessed_df)

    # Return the predicted label
    return prediction
