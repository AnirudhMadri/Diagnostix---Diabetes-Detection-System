import React, { useState } from "react";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function FormDiabetes() {
  const symptomDescriptions = {
    polydipsia:
      "Polydipsia is characterized by excessive thirst. In individuals with diabetes, it occurs when the body attempts to flush out excess glucose from the bloodstream through urination, leading to dehydration and an overwhelming thirst sensation.",

    weakness:
      "Weakness is a lack of physical strength and energy. In diabetes, this can be caused by high blood sugar levels preventing glucose from being properly utilized by the muscles, leaving them without an adequate energy source.",

    "muscle stiffness":
      "Muscle stiffness, or rigidity, refers to the tightness in muscles that can make movement difficult. This is often due to nerve damage (neuropathy) caused by long-term high blood sugar levels in people with diabetes.",

    polyuria:
      "Polyuria is the medical term for excessive urination. In diabetes, high blood sugar levels cause the kidneys to work harder to filter and absorb the excess glucose. As a result, more water is excreted in the urine, leading to frequent urination.",

    "partial paresis":
      "Partial paresis refers to a partial loss of movement or muscle weakness that is often a result of nerve damage. In people with diabetes, chronic high blood sugar levels can lead to diabetic neuropathy, which affects the motor function of muscles.",

    "sudden weight loss":
      "Sudden weight loss is a dramatic decrease in body weight that occurs unexpectedly. In diabetes, this can happen when the body starts to use fat and muscle tissue for energy due to an inability to properly utilize glucose, which can be a sign of poorly controlled blood sugar levels.",

    polyphagia:
      "Polyphagia, or excessive hunger, is a common symptom of diabetes. It occurs when the body cannot properly use glucose for energy, causing an increase in hunger. Despite eating more, individuals with diabetes may still feel hungry because their cells are not receiving enough glucose.",

    irritability:
      "Irritability in people with diabetes can be a result of fluctuating blood sugar levels. When blood sugar is either too high or too low, it can cause mood swings, fatigue, and emotional distress, making individuals more prone to irritability and frustration.",
  };

  const [gender, setGender] = useState(null);
  const [polydipsia, setPolydipsia] = useState(null);
  const [weakness, setWeakness] = useState(null);
  const [muscleStiffness, setMuscleStiffness] = useState(null);
  const [polyuria, setPolyuria] = useState(null);
  const [partialParesis, setPartialParesis] = useState(null);
  const [suddenWeightLoss, setSuddenWeightLoss] = useState(null);
  const [irritability, setIrritability] = useState(null);
  const [polyphagia, setPolyphagia] = useState(null);
  const [age, setAge] = useState(0);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [images, setImages] = useState([]);
  const [showImage, setShowImage] = useState(false);

  const [displaySymptoms, setDisplaySymptoms] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [symptomCorrelation, setSymptomCorrelation] = useState(null);
  const [showData, setShowData] = useState(false);
  const [showReportForm, setShowReportForm] = useState(null);

  const [formNo, setFormNo] = useState(null);
  const [testType, setTestType] = useState(null);
  const [name, setName] = useState(null);
  const [address, setAddress] = useState(null);
  const [docName, setDocName] = useState(null);
  const [dob, setDob] = useState(null);

  const [tempFormNo, setTempFormNo] = useState("");
  const [tempTestType, setTempTestType] = useState("");
  const [tempName, setTempName] = useState("");
  const [tempAddress, setTempAddress] = useState("");
  const [tempDocName, setTempDocName] = useState("Dr. Vineet Bhanushali");
  const [tempDob, setTempDob] = useState("");

  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEvaluateClick = () => {
    setLoading(true);
    setError(null);
    setMetrics(null);

    axios
      .get("http://127.0.0.1:5000/evaluateModel")
      .then((response) => {
        console.log("Eval response:", response.data);
        setMetrics(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message);
        setLoading(false);
      });
  };

  const handleGenerate = () => {
    setFormNo(tempFormNo);
    setTestType(tempTestType);
    setName(tempName);
    setAddress(tempAddress);
    setDocName(tempDocName);
    setDob(tempDob);
  };

  const [viewPDF, setViewPDF] = useState(false);
  const seePDF = () => {
    setViewPDF(!viewPDF);
  };

  // State for storing the response from the backend
  const [predictionResult, setPredictionResult] = useState(null);

  const formData = {
    Gender: gender,
    Polydipsia: polydipsia,
    weakness: weakness,
    "muscle stiffness": muscleStiffness,
    Polyuria: polyuria,
    "partial paresis": partialParesis,
    "sudden weight loss": suddenWeightLoss,
    Irritability: irritability,
    Polyphagia: polyphagia,
    Age: age,
  };

  const fetchSymptomCorrelation = async (symptom) => {
    if (symptom) {
      const symptomEncoded = `${symptom}_encoded`;

      await axios
        .get(`http://127.0.0.1:5000/correlation/${symptomEncoded}`)
        .then((res) => {
          setSymptomCorrelation(res.data[symptomEncoded]);
        })
        .catch((err) => {
          console.error("Error fetching correlation for this symptom: ", err);
        });
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/prediction",
        formData
      );

      // Set the response to the state and show it in an alert
      setPredictionResult(response.data);

      setSubmitted(true);
    } catch (error) {
      console.error("Submission error", error);
    }
  };

  const featureImportance = async () => {
    if (!showImage) {
      setDisplaySymptoms(false);
      setShowImage(true);
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/visualisations",
          {
            responseType: "arraybuffer",
          }
        );

        const zip = await JSZip.loadAsync(response.data);
        const imageFiles = [];

        zip.forEach((relativePath, zipEntry) => {
          zipEntry.async("blob").then((fileData) => {
            const imgUrl = URL.createObjectURL(fileData);
            imageFiles.push(imgUrl);

            if (imageFiles.length === 3) {
              setImages(imageFiles);
            }
          });
        });
      } catch (error) {
        console.error("Error fetching visualizations: ", error);
      }
    } else {
      setShowImage(false);
      setImages([]);
    }
  };

  const symptomsDisplay = () => {
    setDisplaySymptoms(!displaySymptoms);
    setImages([]);
  };
  const displayReportForm = () => {
    setShowReportForm(!showReportForm);
    setDisplaySymptoms(false);
    setImages([]);
  };

  const handleTestClick = () => {
    setTesting(!testing);
    setResult(false);
    setMetrics(null);
  };
  const handleResultClick = () => {
    setMetrics(null);
    setResult(!result);
    setTesting(false);
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(24);
      doc.setLineWidth(0.5);
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFont("helvetica", "bolditalic");
      doc.text(
        "Diagnostix Medical Research Labs Matunga(East).",
        pageWidth / 2,
        15,
        {
          align: "center",
        }
      );

      doc.setFont("helvetica", "italic");
      doc.setFontSize(13);
      doc.text(
        "VJTI PG Boys Hostel, H.R. Mahajani Road, Near Five Gardens, Matunga East, Mumbai-400019.",
        pageWidth / 2,
        25,
        {
          align: "center",
        }
      );
      doc.line(5, 30, 200, 30);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text("Physician: " + docName, 10, 40);
      doc.text("Yash Clinic, Matunga", 10, 45);

      doc.setFontSize(20);
      doc.setFont("helvetica", "bolditalic");
      const text = "Early Stage Diabetes " + testType + " test.";
      const textSplit = doc.splitTextToSize(text, 80);
      doc.text(textSplit, 120, 40);

      doc.setFontSize(15);
      doc.setFont("helvetica", "normal");

      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      const formattedDate = `${dd}-${mm}-${yyyy}`;

      doc.text(`Report date: ${formattedDate}`, 120, 60);
      doc.line(5, 65, 200, 65);

      doc.setFont("helvetica", "bold");
      doc.text("Patient Name: " + name, 10, 75);
      doc.setFont("helvetica", "normal");

      let gender_proper = gender == 0 ? "Male" : "Female";
      doc.text("Gender: " + gender_proper, 10, 82);
      doc.text("Age: " + age, 10, 89);
      doc.text("Address: " + address, 10, 96);

      const [year, month, day] = dob.split("-");
      const dobFormatted = `${day}-${month}-${year}`;
      doc.text("Date of birth: " + dobFormatted, 10, 103);

      doc.text("Form no.: " + formNo, 140, 75);

      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const currentTime = `${hours}:${minutes}:${seconds}`;

      doc.text("Created at: " + currentTime, 140, 89);

      doc.line(5, 115, 200, 115);
      doc.setFont("helvetica", "bold");
      doc.text("Remarks:", 10, 122);
      doc.line(5, 125, 200, 125);

      doc.setFillColor(220, 220, 220);
      doc.rect(5, 130, 195, 10, "F");
      doc.text("Sr.No.", 10, 137);
      doc.text("Symptom", 80, 137);
      doc.text("Prescence", 160, 137);

      let y = 150;
      let sr = 1;
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "Gender" || key === "Age") return;
        let presence = "";
        if (value == 0) {
          presence = "No";
        } else {
          presence = "Yes";
        }
        doc.text(`${sr}`, 10, y);
        doc.text(`${key}`, 80, y);
        doc.text(presence, 160, y);
        y += 10;
        sr += 1;
      });

      doc.line(5, 230, 200, 230);
      doc.text("Sign: ", 10, 240);
      doc.setFont("helvetica", "italic");
      doc.text("END OF REPORT", 80, 280);

      doc.save("Sample.pdf");
    } catch (error) {
      console.log("Encountered following errors: ", error);
    }
  };

  return (
    <div>
      <div className="w-full p-3 rounded-md border-1 flex flex-col items-start justify-center border-gray-300 bg-white">
        <p className="text-2xl my-2 font-bold text-gray-700">
          Detect early stage diabetes risk based on presence of symptoms.
        </p>
        <hr className="w-[90%] border-t-1 border-gray-400" />
        <div className="w-full rounded-md bg-gray-50 border-1 border-gray-300 my-3 flex justify-between items-center">
          <div className="flex flex-col mx-3 items-start justify-center">
            <p className="font-medium px-3 py-1">Dataset used:</p>
            <p className="px-3 pb-1">diabetes_data_upload.csv</p>
            <p className="font-medium px-3 pb-1">Link :</p>
            <a
              className="px-3 pb-1"
              target="_blank"
              href="https://archive.ics.uci.edu/dataset/529/early+stage+diabetes+risk+prediction+dataset"
            >
              UCI Irvine
            </a>
          </div>

          <div className="relative h-30 bg-gray-100">
            <div className="absolute left-1/2 top-[5%] h-[85%] w-px bg-gray-400"></div>
          </div>

          <div className="flex mx-3 flex-col items-start justify-center">
            <p className="font-medium px-3 py-1">Features:</p>
            <p className="px-3 pb-1">Total features: 16</p>
            <p className="px-3 pb-1">Used features: 9</p>
            <p className="px-3 pb-1">Target features: 1</p>
          </div>
          <div className="relative h-30 bg-gray-100">
            <div className="absolute left-1/2 top-[5%] h-[85%] w-px bg-gray-400"></div>
          </div>

          <div className="flex mx-3 flex-col items-start justify-center">
            <p className="font-medium px-3 py-1">Model:</p>
            <p className="px-3 pb-1">Diabetes_Regression_model.pkl</p>
            <p className="px-3 pb-1">Type: Random Forest classifier</p>
            <p className="px-3 pb-1">Hyperparams: random_state: 42 </p>
          </div>
        </div>
        <div className="flex w-full justify-between items-center">
          <div className="flex flex-col items-start justify-center">
            <p className="text-2xl my-1 font-bold text-gray-700">
              Start testing:
            </p>
            <p className=" mb-1s text-gray-700">
              Click to start testing or view results.
            </p>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handleTestClick}
              className="bg-green-500 hover:cursor-pointer hover:bg-green-600 text-green-50 mx-1 px-5 py-1 rounded-md my-2 font-medium "
            >
              Start
            </button>

            <button
              onClick={handleResultClick}
              className="bg-purple-500 hover:cursor-pointer hover:bg-purple-600 mx-1 px-5 py-1 rounded-md my-2 font-medium text-purple-50"
            >
              View Results
            </button>
            <button
              onClick={handleEvaluateClick}
              className="bg-blue-500 hover:cursor-pointer hover:bg-blue-600 mx-1 px-5 py-1 rounded-md my-2 font-medium text-blue-50"
            >
              View Performance Metrics
            </button>
          </div>
        </div>
      </div>
      {metrics && (
        <div className="p-4 border border-gray-300 rounded-md mt-4 bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-3">
            Model Performance Metrics
          </h3>
          <ul className="list-none space-y-2">
            <li>
              <span className="font-semibold">Accuracy:</span>{" "}
              {metrics.accuracy !== undefined
                ? metrics.accuracy.toFixed(4)
                : "N/A"}
            </li>
            <li>
              <span className="font-semibold">Precision:</span>{" "}
              {metrics.precision !== undefined
                ? metrics.precision.toFixed(4)
                : "N/A"}
            </li>
            <li>
              <span className="font-semibold">Recall:</span>{" "}
              {metrics.recall !== undefined ? metrics.recall.toFixed(4) : "N/A"}
            </li>
            <li>
              <span className="font-semibold">F1 Score:</span>{" "}
              {metrics.f1_score !== undefined
                ? metrics.f1_score.toFixed(4)
                : "N/A"}
            </li>
          </ul>
        </div>
      )}

      {testing && (
        <div className="w-full grid grid-rows-10">
          <div
            className={`rounded-md w-full my-3 p-2 flex justify-between mx-auto border ${
              age !== 0
                ? "bg-green-200 border-green-500"
                : "bg-white border-gray-300"
            }`}
          >
            <div className=" font-bold text-2xl text-gray-600 my-auto mx-3">
              Age
            </div>
            <input
              id="age"
              type="text"
              value={age}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setAge(isNaN(value) ? 0 : value);
              }}
              className="border p-2 rounded"
            />
          </div>

          <div className="bg-white border-gray-300 border-1 rounded-md w-full my-3 p-2 flex justify-between mx-auto">
            <div className=" font-bold text-2xl text-gray-600 my-auto mx-3">
              Gender {gender !== null ? ` : ${gender ? "Female" : "Male"}` : ""}
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setGender(false)}
                className="text-purple-50 font-medium bg-purple-500 hover:bg-purple-600 hover:cursor-pointer rounded-md p-3 m-1"
              >
                Male
              </button>
              <button
                onClick={() => setGender(true)}
                className="text-purple-50 font-medium bg-purple-500 hover:bg-purple-600 hover:cursor-pointer rounded-md p-3 m-1"
              >
                Female
              </button>
            </div>
          </div>

          <div
            className={`rounded-md w-full my-3 p-2 flex justify-between mx-auto border ${
              polyphagia === true
                ? "bg-green-200 border-green-500"
                : polyphagia === false
                ? "bg-red-200 border-red-500"
                : "bg-white border-gray-300"
            }`}
          >
            <div className="font-bold text-2xl text-gray-600 my-auto mx-3">
              Polyphagia
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setPolyphagia(true)}
                className="bg-green-400 hover:bg-green-500 hover:cursor-pointer rounded-md p-3 m-1"
              >
                Yes
              </button>
              <button
                onClick={() => setPolyphagia(false)}
                className="bg-red-400 hover:bg-red-500 hover:cursor-pointer rounded-md p-3 m-1"
              >
                No
              </button>
            </div>
          </div>

          <div
            className={`rounded-md w-full my-3 p-2 flex justify-between mx-auto border ${
              polydipsia === true
                ? "bg-green-200 border-green-500"
                : polydipsia === false
                ? "bg-red-200 border-red-500"
                : "bg-white border-gray-300"
            }`}
          >
            <div className="font-bold text-2xl text-gray-600 my-auto mx-3">
              Polydipsia
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setPolydipsia(true)}
                className="bg-green-400 hover:bg-green-500 hover:cursor-pointer rounded-md p-3 m-1"
              >
                Yes
              </button>
              <button
                onClick={() => setPolydipsia(false)}
                className="bg-red-400 hover:bg-red-500 hover:cursor-pointer rounded-md p-3 m-1"
              >
                No
              </button>
            </div>
          </div>

          <div
            className={`rounded-md w-full my-3 p-2 flex justify-between mx-auto border ${
              weakness === true
                ? "bg-green-200 border-green-500"
                : weakness === false
                ? "bg-red-200 border-red-500"
                : "bg-white border-gray-300"
            }`}
          >
            <div className="font-bold text-2xl text-gray-600 my-auto mx-3">
              Weakness
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setWeakness(true)}
                className="bg-green-400 hover:bg-green-500 hover:cursor-pointer rounded-md p-3 m-1"
              >
                Yes
              </button>
              <button
                onClick={() => setWeakness(false)}
                className="bg-red-400 hover:bg-red-500 hover:cursor-pointer rounded-md p-3 m-1"
              >
                No
              </button>
            </div>
          </div>

          <div
            className={`rounded-md w-full my-3 p-2 flex justify-between mx-auto border ${
              muscleStiffness === true
                ? "bg-green-200 border-green-500"
                : muscleStiffness === false
                ? "bg-red-200 border-red-500"
                : "bg-white border-gray-300"
            }`}
          >
            <div className="font-bold text-2xl text-gray-600 my-auto mx-3">
              Muscle Stiffness
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setMuscleStiffness(true)}
                className="bg-green-400 hover:bg-green-500 hover:cursor-pointer rounded-md p-3 m-1"
              >
                Yes
              </button>
              <button
                onClick={() => setMuscleStiffness(false)}
                className="bg-red-400 hover:bg-red-500 hover:cursor-pointer rounded-md p-3 m-1"
              >
                No
              </button>
            </div>
          </div>

          <div
            className={`rounded-md w-full my-3 p-2 flex justify-between mx-auto border ${
              polyuria === true
                ? "bg-green-200 border-green-500"
                : polyuria === false
                ? "bg-red-200 border-red-500"
                : "bg-white border-gray-300"
            }`}
          >
            <div className="font-bold text-2xl text-gray-600 my-auto mx-3">
              Polyuria
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setPolyuria(true)}
                className="bg-green-400 hover:bg-green-500 hover:cursor-pointer rounded-md p-3 m-1"
              >
                Yes
              </button>
              <button
                onClick={() => setPolyuria(false)}
                className="bg-red-400 hover:bg-red-500 hover:cursor-pointer rounded-md p-3 m-1"
              >
                No
              </button>
            </div>
          </div>

          <div
            className={`rounded-md w-full my-3 p-2 flex justify-between mx-auto border ${
              partialParesis === true
                ? "bg-green-200 border-green-500"
                : partialParesis === false
                ? "bg-red-200 border-red-500"
                : "bg-white border-gray-300"
            }`}
          >
            <div className="font-bold text-2xl text-gray-600 my-auto mx-3">
              Partial Paresis
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setPartialParesis(true)}
                className="bg-green-400 hover:bg-green-500 hover:cursor-pointer rounded-md p-3 m-1"
              >
                Yes
              </button>
              <button
                onClick={() => setPartialParesis(false)}
                className="bg-red-400 hover:bg-red-500 hover:cursor-pointer rounded-md p-3 m-1"
              >
                No
              </button>
            </div>
          </div>

          <div
            className={`rounded-md w-full my-3 p-2 flex justify-between mx-auto border ${
              suddenWeightLoss === true
                ? "bg-green-200 border-green-500"
                : suddenWeightLoss === false
                ? "bg-red-200 border-red-500"
                : "bg-white border-gray-300"
            }`}
          >
            <div className="font-bold text-2xl text-gray-600 my-auto mx-3">
              Sudden Weight Loss
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setSuddenWeightLoss(true)}
                className="bg-green-400 hover:bg-green-500 hover:cursor-pointer rounded-md p-3 m-1"
              >
                Yes
              </button>
              <button
                onClick={() => setSuddenWeightLoss(false)}
                className="bg-red-400 hover:bg-red-500 hover:cursor-pointer rounded-md p-3 m-1"
              >
                No
              </button>
            </div>
          </div>

          <div
            className={`rounded-md w-full my-3 p-2 flex justify-between mx-auto border ${
              irritability === true
                ? "bg-green-200 border-green-500"
                : irritability === false
                ? "bg-red-200 border-red-500"
                : "bg-white border-gray-300"
            }`}
          >
            <div className="font-bold text-2xl text-gray-600 my-auto mx-3">
              Irritability
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setIrritability(true)}
                className="bg-green-400 hover:bg-green-500 hover:cursor-pointer rounded-md p-3 m-1"
              >
                Yes
              </button>
              <button
                onClick={() => setIrritability(false)}
                className="bg-red-400 hover:bg-red-500 hover:cursor-pointer rounded-md p-3 m-1"
              >
                No
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="rounded-md p-3 m-2 hover:cursor-pointer h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            {submitted ? "Success!" : "Submit"}
          </button>

          {result && (
            <div className="rounded-md border-1 w-full border-gray-300">
              Hello World
            </div>
          )}
        </div>
      )}
      {result && (
        <div className="my-3 rounded-md border border-gray-300 w-full flex flex-col items-center justify-center p-4">
          {predictionResult ? (
            <>
              <div className="w-full flex items-center justify-between">
                <p className="font-bold text-3xl text-gray-700 mb-2">
                  Presence of Diabetes:{" "}
                  {predictionResult.Prediction === 0 ? "Positive" : "Negative"}
                </p>
                <div
                  className="w-64 h-6 rounded-md"
                  style={{
                    background: `linear-gradient(to right, 
      #22c55e 0%, 
      #22c55e ${predictionResult.Probability_Class_Positive * 100 - 10}%, 
      #ef4444 ${predictionResult.Probability_Class_Positive * 100 + 10}%, 
      #ef4444 100%)`,
                  }}
                ></div>
              </div>

              {/* Negative Probability */}
              <p className="text-gray-700 font-medium mb-1">
                Confidence (Negative):{" "}
                {(predictionResult.Probability_Class_Negative * 100).toFixed(2)}
                %
              </p>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                <div
                  className="bg-red-500 h-4 rounded-full transition-all duration-300 ease-in-out"
                  style={{
                    width: `${
                      predictionResult.Probability_Class_Negative * 100
                    }%`,
                  }}
                ></div>
              </div>

              {/* Positive Probability */}
              <p className="text-gray-700 font-medium mb-1">
                Confidence (Positive):{" "}
                {(predictionResult.Probability_Class_Positive * 100).toFixed(2)}
                %
              </p>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-300 ease-in-out"
                  style={{
                    width: `${
                      predictionResult.Probability_Class_Positive * 100
                    }%`,
                  }}
                ></div>
              </div>
              <div className=" w-full my-3 flex items-center justify-between">
                <div className="flex flex-col items-start justify-center">
                  <p className="text-2xl my-1 font-bold text-gray-700">
                    Further details:
                  </p>
                  <p className=" mb-1s text-gray-700">
                    Click to see correlations and graphs.
                  </p>
                </div>
                <div>
                  <button
                    onClick={displayReportForm}
                    className="bg-green-100 border-2 border-green-500 hover:cursor-pointer hover:bg-green-200 text-gray-700 mx-1 px-5 py-1 rounded-md my-2 font-medium"
                  >
                    Generate Report
                  </button>

                  <button
                    onClick={symptomsDisplay}
                    className="bg-purple-100 border-2 border-purple-500 hover:cursor-pointer hover:bg-purple-200 text-gray-700 mx-1 px-5 py-1 rounded-md my-2 font-medium"
                  >
                    Symptoms
                  </button>
                  <button
                    onClick={featureImportance}
                    className="bg-purple-500 hover:cursor-pointer hover:bg-purple-600 text-purple-50 mx-1 px-5 py-1 rounded-md my-2 font-medium"
                  >
                    {showImage ? "Back" : "Visualise Data"}
                  </button>
                </div>
              </div>
              {showImage && images.length > 0 && (
                <div className="w-full my-3">
                  <hr className="w-[90%] border-t border-gray-400 mx-auto" />

                  <div className="w-full my-3 flex flex-col ">
                    <p className="font-bold text-2xl mt-3 text-gray-700">
                      Visualisations:
                    </p>
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="my-3 flex flex-col items-center"
                      >
                        <p className="text-xl text-gray-700">
                          {getTitle(index)}
                        </p>
                        <img
                          className="mx-3"
                          src={image}
                          alt={`Visualisation ${index}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {displaySymptoms && (
                <div className="my-3 w-full flex flex-col">
                  <hr className="w-[90%] border-t-1 ml-3 mb-3 border-gray-400" />
                  <div className="my-3 flex justify-between items-center">
                    <p className="text-2xl font-bold text-gray-600">
                      Please select symptom
                    </p>
                    <select
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedSymptom(value);
                        fetchSymptomCorrelation(value);
                      }}
                      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select a symptom</option>
                      <option value="Polyuria">Polyuria</option>
                      <option value="Polydipsia">Polydipsia</option>
                      <option value="sudden weight loss">
                        Sudden Weight Loss
                      </option>
                      <option value="weakness">Weakness</option>
                      <option value="muscle stiffness">Muscle Stiffness</option>
                      <option value="partial paresis">Partial Paresis</option>
                      <option value="Itching">Itching</option>
                      <option value="Irritability">Irritability</option>
                      <option value="Gender">Gender</option>
                      <option value="Polyphagia">Polyphagia</option>
                    </select>
                  </div>
                  <p className="mt-6">
                    Symptoms play a crucial role in detecting and managing
                    diabetes. Common symptoms like excessive thirst
                    (polydipsia), frequent urination (polyuria), sudden weight
                    loss, and fatigue are early signs that the body is
                    struggling to regulate blood sugar levels. Recognizing these
                    symptoms early helps in timely diagnosis and treatment,
                    which can prevent complications and improve long-term health
                    outcomes.
                  </p>
                  {selectedSymptom && (
                    <div className="my-3 flex flex-col">
                      <hr className="mx-auto w-[90%] border-t-1  my-3 border-gray-400" />
                      <p className="font-bold text-3xl text-gray-700">
                        {selectedSymptom}
                      </p>
                      <p className=" text-gray-600 my-3">
                        {symptomDescriptions[selectedSymptom.toLowerCase()]}
                      </p>
                      <div className="flex justify-between">
                        <p className="font-bold text-3xl text-gray-700">
                          Correlation with having diabetes:
                        </p>
                        <button
                          onClick={() => setShowData(!showData)}
                          className="bg-purple-100 border-2 border-purple-500 hover:cursor-pointer hover:bg-purple-200 text-gray-700 mx-1 px-5 py-1 rounded-md my-2 font-medium"
                        >
                          View
                        </button>
                      </div>
                      {showData && symptomCorrelation !== null && (
                        <div className="my-3">
                          <p className="font-bold text-gray-700 my-3 text-lg">
                            Correlation Progress:
                          </p>
                          <div className="relative w-full h-3 bg-gray-200 rounded">
                            <div
                              className={`absolute top-0 h-3 rounded ${
                                symptomCorrelation > 0
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                left:
                                  symptomCorrelation < 0
                                    ? `${50 + symptomCorrelation * 50}%`
                                    : "50%",
                                width: `${Math.abs(symptomCorrelation) * 50}%`,
                              }}
                            ></div>
                            <div className="absolute left-1/2 top-0 h-3 w-[2px] bg-black opacity-40"></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 text-center">
                            Corr:{" "}
                            {symptomCorrelation
                              ? symptomCorrelation.toFixed(2)
                              : "N/A"}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {showReportForm && (
                <div className="w-[80%] my-10">
                  <div className="bg-white border border-gray-300 rounded-xl p-8">
                    {/* Main Heading */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                      Patient Details
                    </h2>

                    {/* Form No. & Test Type */}
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">
                          Form No.
                        </label>
                        <input
                          type="text"
                          value={formNo}
                          onChange={(e) => setFormNo(e.target.value)}
                          placeholder="e.g. 001"
                          className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring focus:ring-indigo-300"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">
                          Test Type
                        </label>
                        <select
                          value={testType}
                          onChange={(e) => setTestType(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                          <option value="">Select sample type</option>
                          <option value="blood">Blood</option>
                          <option value="general">General Symptoms</option>
                        </select>
                      </div>
                    </div>

                    {/* Patient Info Form */}
                    <form className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <textarea
                          rows="2"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Doctor Name
                        </label>
                        <input
                          type="text"
                          value={docName}
                          onChange={(e) => setDocName(e.target.value)}
                          className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault(); // just to be safe
                            seePDF(); // your function to show the div
                          }}
                          className="px-6 py-2 text-purple-50 font-medium bg-purple-500  rounded-md hover:bg-purple-600"
                        >
                          Generate
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {viewPDF && (
                <div className="p-6 w-full max-w-4xl mx-auto text-[15px]">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold italic">
                      Diagnostix Medical Research Labs Matunga-East.
                    </h1>
                    <p className="text-sm italic">
                      VJTI PG Boys Hostel, H.R. Mahajani Road, Near Five
                      Gardens, Matunga East, Mumbai-400019.
                    </p>
                  </div>
                  <hr className="my-4 border-t border-gray-500" />
                  <div className="flex justify-around">
                    <div className="mb-2">
                      <p className="font-bold">Physician: </p>
                      <p>Yash Clinic, Matunga</p>
                    </div>
                    <div className=" my-3">
                      <div>
                        <p className="text-3xl font-bold italic">
                          Early Stage Diabetes {testType} test.
                        </p>
                      </div>
                      <div>
                        <p>
                          Report date:{" "}
                          {(() => {
                            const today = new Date();
                            const dd = String(today.getDate()).padStart(2, "0");
                            const mm = String(today.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const yyyy = today.getFullYear();
                            return `${dd} ${mm} ${yyyy}`;
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <hr className="my-4 border-t w-[90%] border-gray-500" />
                  <div className="flex justify-around">
                    <div className="space-y-1">
                      <p className="font-bold">Patient Name: {name}</p>
                      <p className="font-bold">
                        Gender: {gender == 0 ? "Male" : "Female"}
                      </p>
                      <p className="font-bold">Age: {age}</p>
                      <p className="font-bold">Address: {address}</p>
                      <p className="font-bold">
                        Date of birth:
                        {(() => {
                          const [year, month, day] = dob.split("-");
                          const dobFormatted = `${day}-${month}-${year}`;

                          return ` ${dobFormatted}`;
                        })()}
                      </p>
                    </div>

                    <div className="flex flex-col mt-2">
                      <p className="font-bold">Form no.:{formNo}</p>
                      <p className="font-bold">
                        Created at:{" "}
                        {(() => {
                          const now = new Date();
                          const hours = String(now.getHours()).padStart(2, "0");
                          const minutes = String(now.getMinutes()).padStart(
                            2,
                            "0"
                          );
                          const seconds = String(now.getSeconds()).padStart(
                            2,
                            "0"
                          );
                          return `${hours}:${minutes}:${seconds}`;
                        })()}
                      </p>
                    </div>
                  </div>
                  <hr className="my-4 border-t border-gray-500" />
                  <p className="font-bold">Remarks:</p>
                  <hr className="my-2 border-t border-gray-500" />
                  <div className="bg-gray-200 px-4 py-2 mt-2 grid grid-cols-3 font-semibold">
                    <p>Sr.No.</p>
                    <p>Symptom</p>
                    <p>Prescence</p>
                  </div>
                  {/*
                  {Object.entries(formData).map(([key, value], index) => {
                    if (key === "Gender" || key === "Age") return null;
                    return (
                      <div key={key} className="grid grid-cols-3">
                        <p>{index + 1}</p>
                        <p>{key}</p>
                        <p>{value === 0 ? "No" : "Yes"}</p>
                      </div>
                    );
                  })}
                  */}
                  <div className="space-y-2 mt-4">
                    {Object.entries(formData)
                      .filter(([key]) => key !== "Gender" && key !== "Age")
                      .map(([key, value], index) => {
                        const displayValue = value === 0 ? "No" : "Yes";
                        return (
                          <div key={key} className="grid grid-cols-3">
                            <p>{index + 1}</p>
                            <p>{key}</p>
                            <p>{displayValue}</p>
                          </div>
                        );
                      })}
                  </div>

                  <hr className="my-6 border-t border-gray-500" />
                  <div className="mt-6">
                    <p>
                      <p className="font-bold">Sign:</p> ______________________
                    </p>
                  </div>
                  <div className="text-center mt-10 italic">END OF REPORT</div>
                  <button
                    onClick={generatePDF}
                    className="px-6 py-2 text-purple-50 font-medium bg-purple-500  rounded-md hover:bg-purple-600"
                  >
                    Download
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500">Response not received yet...</p>
          )}
        </div>
      )}
    </div>
  );
}

const getTitle = (index) => {
  switch (index) {
    case 0:
      return "Class Distribution Plot";
    case 1:
      return "Feature Importance Plot";
    case 2:
      return "Correlation Heatmap";
    default:
      return "";
  }
};
