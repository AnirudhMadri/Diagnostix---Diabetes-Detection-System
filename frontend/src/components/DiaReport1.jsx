import React from "react";

export default function DiaReport1({ predictionData }) {
  return (
    <div className="w-[80%] mx-auto mt-10">
      <div className="bg-white shadow-lg rounded-xl p-8">
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
              placeholder="e.g. 001"
              className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Test Type
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400">
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
              className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              rows="2"
              className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Doctor Name
            </label>
            <input
              type="text"
              className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-6 py-2 font-medium border-2 border-purple-500 rounded-md text-purple-50  hover:bg-purple-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
            >
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
