import React from "react";
import { useState, useRef } from "react";
import Navbar from "../components/Navbar.jsx";
import Selector from "../components/Selector.jsx";
import FormDiabetes from "../components/FormDiabetes.jsx";
import Correlation from "../components/Correlation.jsx";
import caduceus from "../assets/caduceus.png";
import Footer from "../components/Footer.jsx";

export default function Home() {
  const [selectedForm, setSelectedForm] = useState(null);

  const diabetesFormRef = useRef(null);
  const diaReportRef = useRef(null);

  const handleSelectForm = (formKey) => {
    setSelectedForm(formKey);
    if (formKey === "formDiabetes" && diabetesFormRef.current) {
      diabetesFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (formKey === "diaReport" && diaReportRef.current) {
      diaReportRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="overflow-x-hidden">
      <div>
        <Navbar />
      </div>
      <div className="w-full mx-auto grid grid-cols-[17%_85%] gap-4 p-4">
        <div>
          <Selector onSelectForm={handleSelectForm} />
        </div>
        <div>
          <div className="relative mt-5 mb-0 bg-white p-6  overflow-hidden">
            {/* Top-right glow */}
            <div className="absolute top-0 right-0 w-300 h-200 bg-pink-500 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            {/* Bottom-left glow */}
            <div className="absolute bottom-0 left-0 w-300 h-100 bg-purple-500 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

            {/* Your content */}
            <div className="flex justify-between">
              <div className="z-10 mt-30 ml-10">
                <p className="text-gray-700 font-medium my-3 text-9xl">
                  Predict
                </p>
                <p className="text-gray-700 font-bold my-3 text-8xl">
                  Diabetes
                </p>
                <p className="text-gray-700 font-medium my-3 text-8xl">with </p>
                <p className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold my-3 text-9xl ">
                  &lt;AI/&gt;{" "}
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-50 mb-5 mt-0 bg-white p-6  overflow-hidden">
            {/* Top-right glow */}
            <div className="absolute top-0 left-0 w-300 h-200 bg-purple-500 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          </div>

          <div
            ref={diabetesFormRef}
            className=" w-[95%] mx-auto grid grid-cols-[75%_25%] gap-4 p-4"
          >
            <div>{selectedForm === "formDiabetes" && <FormDiabetes />}</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
