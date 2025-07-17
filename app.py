from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import io
import json
import os

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.naive_bayes import MultinomialNB

app = Flask(__name__)
CORS(app)

model = joblib.load('Diabetes_Regression_model_final.pkl')

df = pd.read_csv("C:/Users/aniru/OneDrive/Desktop/early+stage+diabetes+risk+prediction+dataset/diabetes_data_upload.csv")

df["class_encoded"] = pd.factorize(df["class"])[0]
df["Gender_encoded"] = pd.factorize(df["Gender"])[0]
df["Polyuria_encoded"] = pd.factorize(df["Polyuria"])[0]
df["Polydipsia_encoded"] = pd.factorize(df["Polydipsia"])[0]
df["sudden weight loss_encoded"] = pd.factorize(df["sudden weight loss"])[0]
df["weakness_encoded"] = pd.factorize(df["weakness"])[0]
df["Polyphagia_encoded"] = pd.factorize(df["Polyphagia"])[0]
df["Genital thrush_encoded"] = pd.factorize(df["Genital thrush"])[0]
df["visual blurring_encoded"] = pd.factorize(df["visual blurring"])[0]
df["Itching_encoded"] = pd.factorize(df["Itching"])[0]
df["Irritability_encoded"] = pd.factorize(df["Irritability"])[0]
df["delayed healing_encoded"] = pd.factorize(df["delayed healing"])[0]
df["partial paresis_encoded"] = pd.factorize(df["partial paresis"])[0]
df["muscle stiffness_encoded"] = pd.factorize(df["muscle stiffness"])[0]
df["Alopecia_encoded"] = pd.factorize(df["Alopecia"])[0]
df["Obesity_encoded"] = pd.factorize(df["Obesity"])[0]

from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

@app.route('/evaluateModel', methods=['GET'])
def evaluate_model():
    try:
        # Load model
        model = joblib.load('Diabetes_Regression_model_final.pkl')

        # Features to use — based on your encoded fields
        feature_cols = [
            'Polydipsia_encoded',
    'weakness_encoded',
    'muscle stiffness_encoded',
    'Polyuria_encoded',
    'partial paresis_encoded',
    'sudden weight loss_encoded',
    'Gender_encoded',
    'Polyphagia_encoded',
    'Irritability_encoded',
    'Age'
        ]

        X = df[feature_cols]
        y = df["class_encoded"]

        predictions = model.predict(X)

        acc = accuracy_score(y, predictions)
        prec = precision_score(y, predictions)
        rec = recall_score(y, predictions)
        f1 = f1_score(y, predictions)

        return jsonify({
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/getCols', methods=['GET'])
def getCols():
    filtered_columns = [
        col for col in df.columns
        if not col.endswith('_encoded') and col not in ['Age', 'Gender', 'class']
    ]
    return jsonify(filtered_columns)

@app.route('/modelSubmit', methods=['POST'])
def makeModel():
    data = request.get_json()

    selected_columns = data.get("Selected_Columns", [])
    selected_model = data.get("Selected_Model")
    selected_params = data.get("Selected_parameters", {})  # Only for saving

    if not selected_columns or not selected_model:
        return jsonify({"error": "Missing required fields"}), 400

    # Add _encoded suffix
    encoded_columns = [col + "_encoded" for col in selected_columns]
    print(f"Encoded columns used: {encoded_columns}")

    try:
        X = df[encoded_columns]
        y = df['class_encoded']
    except KeyError as e:
        return jsonify({"error": f"Missing column: {str(e)}"}), 400

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    # Create model WITHOUT using selected_params
    model = None
    if selected_model == "logistic_regression":
        model = LogisticRegression()
    elif selected_model == "knn":
        model = KNeighborsClassifier()
    elif selected_model == "svm":
        model = SVC()
    elif selected_model == "decision_tree":
        model = DecisionTreeClassifier()
    elif selected_model == "random_forest":
        model = RandomForestClassifier()
    elif selected_model == "xgboost":
        model = XGBClassifier(use_label_encoder=False, eval_metric='logloss')
    elif selected_model == "naive_bayes":
        model = MultinomialNB()

    if model:
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)
        accuracy = accuracy_score(y_test, predictions)

        # Save model
        filename = f"{selected_model}_DiabetesModel.pkl"
        joblib.dump(model, filename)

        # Save config (includes unused params for record-keeping)
        model_config = {
            "selected_model": selected_model,
            "selected_hyperparameters": selected_params,
            "selected_columns": selected_columns
        }

        config_path = os.path.join(os.getcwd(), "model_config.json")
        with open(config_path, "w") as f:
            json.dump(model_config, f, indent=4)

        return jsonify({
            "message": "Model trained and saved successfully",
            "accuracy": accuracy
        })

    return jsonify({"error": "Invalid model selected"}), 400


@app.route('/visualisations', methods=['GET'])
def all_visualisations():

    plots =[]

    # Get feature importances from the model
    feature_importances = model.feature_importances_

    selected_features_encoded = [
    'Polydipsia_encoded', 'weakness_encoded', 'muscle stiffness_encoded', 'Polyuria_encoded',
    'partial paresis_encoded', 'sudden weight loss_encoded', 'Gender_encoded', 'Polyphagia_encoded', 'Irritability_encoded','Age'
]
    cleaned_features = [feat.replace("_encoded", "") for feat in selected_features_encoded]

    # Create a DataFrame for selected encoded features and their importance
    feature_df = pd.DataFrame({
        'Feature': cleaned_features,
        'Importance': feature_importances
    })

    # Sort the DataFrame by Importance
    feature_df = feature_df.sort_values(by='Importance', ascending=False)

    # Plotting the feature importance
    plt.figure(figsize=(10, 6))
    sns.barplot(x='Importance', y='Feature', data=feature_df, palette='viridis')
    plt.title('Feature Importance')
    plt.xlabel('Importance')
    plt.ylabel('Feature')

    # Save the plot to a BytesIO object
    img1 = io.BytesIO()
    plt.savefig(img1, format='png')
    img1.seek(0)
    plots.append(('Feature_importance', img1))

    # 2. Correlation Heatmap
    plt.figure(figsize=(10,8))
    numeric_df = df.select_dtypes(include=["number"])
    sns.heatmap(numeric_df.corr(),annot=True, cmap='coolwarm', fmt='.2f')
    plt.title("Correlation Heatmap")
    img2 = io.BytesIO()
    plt.savefig(img2, format='png')
    img2.seek(0)
    plots.append(('Correlation_heatmap', img2))

    #3. Class Distribution
    plt.figure(figsize=(6,4))
    sns.countplot(x='class', data=df, palette='Set2')
    plt.title("Class Distribution")
    img3 = io.BytesIO()
    plt.savefig(img3, format='png')
    img3.seek(0)
    plots.append(('Class_distribution', img3))
    import zipfile
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'a', zipfile.ZIP_DEFLATED) as zip_file:
        for name, img in plots:
            zip_file.writestr(f"{name}.png", img.getvalue())

    zip_buffer.seek(0)
    return send_file(zip_buffer, mimetype='application/zip', as_attachment=True, download_name='visualisations.zip')





@app.route('/correlation', methods=['GET'])
def corr():
    numeric_df = df.select_dtypes(include=["number"])
    correlations = numeric_df.corr()["class_encoded"].drop("class_encoded").sort_values(ascending=False)
    rounded = correlations.round(2)
    return jsonify(rounded.to_dict())

@app.route('/correlation/<symptom>', methods=['GET'])
def symptom_correlation(symptom):
    if symptom not in df.columns or "class_encoded" not in df.columns:
        return jsonify({"error": "Invalid symptom or class column missing"}), 400
    
    try:
        correlation = df[[symptom, "class_encoded"]].corr().iloc[0, 1]
        return jsonify({symptom: round(correlation, 2)})
    except:
        return jsonify({"error": "Unable to compute correlation"}), 500


@app.route('/prediction', methods=['POST'])
def predict():
    data = request.get_json()

    features = [
    data.get('Polydipsia', 0),            # Polydipsia (True/False)
    data.get('weakness', 0),              # weakness (True/False)
    data.get('muscle stiffness', 0),      # muscle stiffness (True/False)
    data.get('Polyuria', 0),              # Polyuria (True/False)
    data.get('partial paresis', 0),       # partial paresis (True/False)
    data.get('sudden weight loss', 0),    # sudden weight loss (True/False)
    data.get('Gender', 0),                # Gender (True/False)
    data.get('Polyphagia', 0),            # Polyphagia (True/False)
    data.get('Irritability', 0),           # Irritability (True/False)
    data.get('Age', 0)
]


    features = np.array(features).reshape(1,-1)

    prediction = model.predict(features)
    probabilities = model.predict_proba(features)[0]

    return jsonify({"Prediction": int(prediction[0]),
                    "Probability_Class_Positive": round(float(probabilities[0]),4),
                    "Probability_Class_Negative": round(float(probabilities[1]),4)})

@app.route('/', methods=['GET'])
def greet():
    return "Hello World"


if __name__ == '__main__':
    app.run(debug=True)

