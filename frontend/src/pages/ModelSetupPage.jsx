import React from "react";
import Navbar from "../components/Navbar";
import Selector from "../components/Selector";
import ModelSetup from "../components/ModelSetup";
export default function ModelSetupPage() {
  return (
    <div className="overflow-x-hidden">
      <div>
        <Navbar />
      </div>
      <div className="w-full mx-auto my-20 grid grid-cols-[17%_85%] gap-4 p-4">
        <div>
          <Selector />
        </div>
        <div className="w-[90%] bg-white shadow-lg rounded-md p-5 border border-gray-300">
          <ModelSetup />
        </div>
      </div>
    </div>
  );
}
