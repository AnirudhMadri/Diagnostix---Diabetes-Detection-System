import React, { useState } from "react";
import axios from "axios";

export default function ModelSetup() {
  const [columns, setColumns] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedHyperparam, setSelectedHyperparam] = useState([]);
  const [responses, setResponses] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/modelSubmit", {
        Selected_Columns: selected,
        Selected_Model: selectedModel,
        Selected_parameters: selectedHyperparam,
      });
      setResponses(response.data);
      alert("Successfully Saved Model.");
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const fetchColumns = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/getCols");
      setColumns(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { value, checked } = e.target;
    setSelected((prev) =>
      checked ? [...prev, value] : prev.filter((col) => col !== value)
    );
  };

  const handleSelectChange = (e) => {
    setSelectedModel(e.target.value); // This updates the state with the selected value
    setSelectedHyperparam([]); // Reset hyperparameters when changing model
  };

  // Define hyperparameters and their recommended ranges for each model
  const modelHyperparams = {
    logistic_regression: [
      { param: "C", range: "0.001 to 1000" },
      { param: "penalty", range: "l1, l2" },
      { param: "solver", range: "liblinear, lbfgs" },
    ],
    knn: [
      { param: "n_neighbors", range: "1 to 50" },
      { param: "weights", range: "uniform, distance" },
      { param: "algorithm", range: "auto, ball_tree, kd_tree, brute" },
    ],
    svm: [
      { param: "C", range: "0.001 to 1000" },
      { param: "kernel", range: "linear, rbf, poly" },
      { param: "gamma", range: "scale, auto, 0.001 to 1" },
    ],
    decision_tree: [
      { param: "max_depth", range: "None, 1 to 20" },
      { param: "min_samples_split", range: "2 to 20" },
      { param: "criterion", range: "gini, entropy" },
    ],
    random_forest: [
      { param: "n_estimators", range: "10 to 200" },
      { param: "max_depth", range: "None, 1 to 20" },
      { param: "min_samples_split", range: "2 to 20" },
    ],
    xgboost: [
      { param: "learning_rate", range: "0.01 to 1" },
      { param: "n_estimators", range: "10 to 200" },
      { param: "max_depth", range: "3 to 10" },
    ],
    naive_bayes: [
      { param: "alpha", range: "0.001 to 1" },
      { param: "fit_prior", range: "True, False" },
    ],
  };

  const handleHyperparamChange = (e) => {
    const { value, checked } = e.target;
    setSelectedHyperparam((prev) =>
      checked ? [...prev, value] : prev.filter((param) => param !== value)
    );
  };

  return (
    <div>
      <p className="text-5xl font-medium rounded-md bg-purple-100 p-4 mb-5">
        Setup Model Parameters to continue.
      </p>
      <div className="w-full grid grid-cols-[50%_50%] gap-4 p-4">
        <div className="border mx-3 border-gray-300 p-4 rounded-md">
          <button
            onClick={fetchColumns}
            className="border-2 text-gray-700 font-bold hover:cursor-pointer hover:bg-blue-200 border-blue-500 bg-blue-100 py-2 rounded-md my-3 px-4"
          >
            Select Features
          </button>

          {columns.map((col, index) => (
            <div key={index}>
              <input
                className=" mx-3"
                type="checkbox"
                value={col}
                checked={selected.includes(col)}
                onChange={handleChange}
              />
              <label className="font-medium">{col}</label>
            </div>
          ))}
        </div>

        <div className="border mx-3 border-gray-300 p-4 rounded-md">
          <p className="text-2xl font-medium rounded-md mb-5">
            Select Classification Model:
          </p>
          <select
            className="border-2 border-gray-300 px-4 py-1 my-3 font-medium rounded-md"
            onChange={handleSelectChange}
            value={selectedModel}
          >
            <option className="font-medium" value="">
              Select a model
            </option>
            <option className="font-medium" value="logistic_regression">
              Logistic Regression
            </option>
            <option className="font-medium" value="knn">
              K-Nearest Neighbors (KNN)
            </option>
            <option className="font-medium" value="svm">
              Support Vector Machine (SVM)
            </option>
            <option className="font-medium" value="decision_tree">
              Decision Tree
            </option>
            <option className="font-medium" value="random_forest">
              Random Forest
            </option>
            <option className="font-medium" value="xgboost">
              XGBoost
            </option>
            <option className="font-medium" value="naive_bayes">
              Naive Bayes
            </option>
          </select>

          {/* Display the selected model */}
          {selectedModel && (
            <p className="font-medium my-2">Selected Model: {selectedModel}</p>
          )}

          {selectedModel && (
            <div>
              <p className="font-medium mb-2">Select Hyperparameters:</p>
              <div>
                {modelHyperparams[selectedModel]?.map((paramObj, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      id={paramObj.param}
                      value={paramObj.param}
                      checked={selectedHyperparam.includes(paramObj.param)}
                      onChange={handleHyperparamChange}
                    />
                    <label
                      className="font-medium mx-3"
                      htmlFor={paramObj.param}
                    >
                      {paramObj.param} (Recommended Range: {paramObj.range})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Display the selected model and hyperparameters */}
      {selectedModel && selectedHyperparam.length > 0 && (
        <p className="font-medium my-3">
          Selected Model: {selectedModel}, Selected Hyperparameters:{" "}
          {selectedHyperparam.join(", ")}
        </p>
      )}
      <button
        onClick={handleSubmit}
        className="border-2 border-purple-500 px-3 py-1 bg-purple-50 font-medium hover:bg-purple-200 hover:cursor-pointer rounded-md"
      >
        Generate
      </button>
    </div>
  );
}
