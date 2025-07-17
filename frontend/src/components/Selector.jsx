import React from "react";
import { Link } from "react-router-dom";

export default function Selector({ onSelectForm }) {
  return (
    <div>
      <div className="fixed top-16 w-[17vw] border-gray-300 border my-5 shadow-xl  h-full rounded-md z-10 px-2">
        <div
          className="text-black
         font-bold text-2xl mt-10 p-3 w-full rounded-md"
        >
          Select Test:
        </div>
        <hr className="w-[90%] border-t-1 mb-3 border-gray-400" />

        <div className="mb-3">
          <button
            onClick={() => onSelectForm("formDiabetes")}
            className="w-full text-left text-black font-medium text-xl px-3 rounded-md  hover:cursor-pointer hover:text-purple-600 "
          >
            Pre Diabetes Test
          </button>
          <Link to="/modelSetup">
            <button className="w-full text-left text-black font-medium text-xl px-3 rounded-md  hover:cursor-pointer hover:text-purple-600 ">
              Setup Model
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
