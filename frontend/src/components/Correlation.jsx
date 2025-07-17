import React, { useState } from "react";
import axios from "axios";

export default function Correlation() {
  const [correlations, setCorrelations] = useState({});
  const [showData, setShowData] = useState(false);

  const fetchCorrelations = () => {
    axios
      .get("http://127.0.0.1:5000/correlation")
      .then((res) => {
        setCorrelations(res.data);
        setShowData(true);
      })
      .catch((err) => {
        console.error("Error fetching correlations: ", err);
      });
  };

  return (
    <div>
      <div className="w-full flex flex-col items-center rounded-md border-gray-300 border-1 bg-white">
        <div className="w-full mx-auto my-2 p-3 flex justify-between items-center">
          <div>
            <p className="font-bold text-2xl text-gray-600">Correlations</p>
            <p className="text-sm font-normal text-gray-500">
              Click to view correlation values
            </p>
          </div>

          <button
            className="font-medium text-purple-50 bg-purple-500 py-2 px-3 rounded-md hover:bg-purple-600 hover:cursor-pointer"
            onClick={fetchCorrelations}
          >
            View
          </button>
        </div>
      </div>

      {showData && (
        <div className="w-[90%] bg-white p-4 rounded shadow flex flex-col gap-4 mx-auto mt-4">
          {Object.entries(correlations).map(([key, value]) => (
            <div
              key={key}
              className="p-3 border border-gray-200 rounded  bg-gray-50"
            >
              <p className="font-semibold text-sm mb-1 text-gray-700">{key}</p>

              <div className="relative w-full h-3 bg-gray-200 rounded">
                <div
                  className={`absolute top-0 h-3 rounded ${
                    value > 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                  style={{
                    left: value < 0 ? `${50 + value * 50}%` : "50%",
                    width: `${Math.abs(value) * 50}%`,
                  }}
                ></div>
                <div className="absolute left-1/2 top-0 h-3 w-[2px] bg-black opacity-40"></div>
              </div>

              <p className="text-xs text-gray-500 mt-1 text-center">
                Corr: {value.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
