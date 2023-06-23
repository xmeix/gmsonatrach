
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import MinMaxScaler
import joblib
from sklearn import tree






def train_model(missions, tickets):

    datasetMissions = cleanData(missions, tickets)

     # Splitting data
    X_train, X_test, y_train, y_test = train_test_split(datasetMissions.drop(
        "resultat", axis=1), datasetMissions["resultat"], test_size=0.2)

    X_train_scaled, feature_names = preprocessData(X_train)

    X_test_scaled = preprocessTestData(X_test, feature_names)

    # train_accuracies_dt = []  # Track decision tree accuracies for each iteration
    # train_accuracies_rf = []  # Track random forest accuracies for each iteration

    dt_model = tree.DecisionTreeClassifier(
        max_depth=10, min_samples_split=10, min_samples_leaf=6, max_features="sqrt").fit(X_train_scaled, y_train)
    acc_dt = round(dt_model.score(X_test_scaled, y_test) * 100, 2)
    # train_accuracies_dt.append(acc_dt)
    print("Decision Tree Accuracy: %s" % acc_dt)

    randf = RandomForestClassifier(
        n_estimators=100, max_depth=10, min_samples_split=2, min_samples_leaf=1, max_features="sqrt")
    rf_model = randf.fit(X_train_scaled, y_train)
    acc_rf = round(rf_model.score(X_test_scaled, y_test) * 100, 2)
    # train_accuracies_rf.append(acc_rf)
    print("Random Forest Accuracy: %s" % acc_rf)

    if acc_dt > acc_rf:
        score = acc_dt
        model = dt_model
        model_name = "decision tree"
        score2 = acc_rf

    else:
        score = acc_rf
        model = rf_model
        model_name = "random forest"
        score2 = acc_dt
 
    return score, model, model_name , X_test_scaled, y_test, score2

def cleanData(missions, tickets):
    datasetMissions = list(missions.find())
    datasetTickets = list(tickets.find())

    datasetMissions = pd.DataFrame(datasetMissions)
    datasetTickets = pd.DataFrame(datasetTickets)

    datasetMissions = datasetMissions[datasetMissions['etat'] == 'terminée']

    datasetMissions = datasetMissions.fillna(method='ffill')
    datasetMissions = datasetMissions.drop(['observation'], axis=1)

    # FIXING CRITERIA AND ADDING NEW FEATURES TO THE CLASSIFICATION DATA
    for index, row in datasetMissions.iterrows():
        taches = row["taches"]
        filtered_length = len(
            [tache for tache in taches if tache["state"] == "accomplie"])
        datasetMissions.at[index, "NbTachesAccomplies"] = filtered_length
        datasetMissions.at[index, "NbTachesTotal"] = len(taches)

    for index, row in datasetMissions.iterrows():
        employes = row["employes"]  # Get the array from the "taches" column
        datasetMissions.at[index, "NbEmployes"] = len(employes)

    for index, mission in datasetMissions.iterrows():
        mission_id = mission['_id']
        mission_tickets = datasetTickets[datasetTickets['mission'] == mission_id]
        num_tickets = len(mission_tickets)
        datasetMissions.at[index, 'NbTickets'] = num_tickets

    for index, mission in datasetMissions.iterrows():
        mission_id = mission['_id']
        mission_tickets = datasetTickets[(datasetTickets['mission'] == mission_id) & (
            datasetTickets['isSolved'] == True)]
        num_solved_tickets = len(mission_tickets)
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

    # DROPPING UNNECESSARY COLUMNS
    columns_to_drop = ['oldDuree', 'employes', 'taches', 'etat', 'tDateDeb', 'tDateRet', '_id', 'uid', 'objetMission', 'budgetConsome', 'NbTachesAccomplies', 'NbTachesTotal',
                       'NbTickets', 'NbTicketsCloture', 'updatedAt', '__v', 'updatedBy', 'createdAt', 'DateDebA', 'DateRetA',
                       'observation', 'raisonRefus', 'createdBy', 'moyenTransport', 'lieuDep', 'moyenTransportRet']

    existing_columns = [
        col for col in columns_to_drop if col in datasetMissions.columns]
    datasetMissions.drop(existing_columns, axis=1, inplace=True)

    print("datasetMissions.columns")
    # print(datasetMissions.columns)

    return datasetMissions



def preprocessData(X_train):

    X_train = pd.DataFrame(X_train)
    # ENCODING CATEGORICAL COLS
    categorical_cols = ['structure', 'pays', 'type', 'destination']
    label_encoders = {}  # Dictionary to store label encoders for each categorical column
    for col in categorical_cols:
        label_encoder = LabelEncoder()
        X_train[col] = label_encoder.fit_transform(
            X_train[col])  # Encode categorical column
        # Store the label encoder for future reference
        label_encoders[col] = label_encoder

    joblib.dump(label_encoders, 'codifications.joblib')

    # Normalizing numerical features
    numerical_features = ['structure', 'type', 'budget',
                          'pays', 'destination', 'NbEmployes', 'duree']

    scaler = MinMaxScaler()
    scaler.fit(X_train[numerical_features])
    normalized_features = scaler.transform(X_train[numerical_features])
    normalized_data = pd.DataFrame(
        normalized_features, columns=numerical_features)

    joblib.dump(scaler, 'scaler.joblib')
    X_train[numerical_features] = normalized_features

    X_train_scaled = X_train
    feature_names = ['structure', 'type', 'budget', 'pays', 'destination', 'NbEmployes', 'duree']

    print("X_train_scaled.columns")
    # print(X_train_scaled.columns)

    print("feature_names")
    # print(feature_names)
    return X_train_scaled, feature_names



def preprocessTestData(X_test,feature_names):
    label_encoders = joblib.load('codifications.joblib')
    categorical_cols = ['structure', 'pays', 'type', 'destination']

    # for col in categorical_cols:
    #     # Retrieve the label encoder for the column
    #     label_encoder = label_encoders[col]
    #     X_test[col] = X_test[col].apply(lambda x: label_encoder.transform([x])[
    #                                     0] if x in label_encoder.classes_ else -1)

    for col in categorical_cols:
        if col in X_test.columns and col in label_encoders:
            # Get unique values in the column
            unique_values = X_test[col].unique()
            print(col,unique_values)
            # Add new values to the label encoder
            new_values = set(unique_values) - set(label_encoders[col].classes_)
            if new_values:
                label_encoder = label_encoders[col]
                label_encoder.classes_ = np.concatenate(
                    [label_encoder.classes_, list(new_values)])
                label_encoders[col] = label_encoder

            # Transform the values using the updated label encoder
            label_encoder = label_encoders[col]
            X_test[col] = label_encoder.transform(X_test[col])


    scaler = joblib.load('scaler.joblib')
    numerical_features = ['structure', 'type', 'budget',
                          'pays', 'destination', 'NbEmployes', 'duree']
    X_test[numerical_features] = scaler.transform(X_test[numerical_features])
    X_test_scaled = X_test.reindex(columns=feature_names)

    print("X_test_scaled.columns")
    # print(X_test_scaled.columns)

    return X_test_scaled


def preprocessRow(row):
    row = pd.DataFrame([row])
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

    label_encoders = joblib.load('codifications.joblib')
    categorical_cols = ['structure', 'pays', 'type', 'destination']

    # for col in categorical_cols:
    #     # Retrieve the label encoder for the column
    #     label_encoder = label_encoders[col]
    #     row[col] = label_encoder.transform(row[col])

    for col in categorical_cols:
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
                joblib.dump(label_encoders, 'codifications.joblib')

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

  # Reorder columns
    row = row[['structure', 'type', 'budget', 'pays', 'destination', 'NbEmployes', 'duree']]

    # scaling
    scaler = joblib.load('scaler.joblib')
    numerical_features = ['structure', 'type', 'budget',
                          'pays', 'destination', 'NbEmployes', 'duree']
    row[numerical_features] = scaler.transform(row[numerical_features])

    print(row)
    return row

def predict_classification(data):
    # Perform preprocessing on the input data
    model = joblib.load('trained_model.joblib')
    preprocessed_row = preprocessRow(data)
    prediction = model.predict(preprocessed_row)

    # Return the predicted label
    return prediction
