import React from "react";
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full z-50 ">
      <div className="w-full  opacity-95 mb-3 backdrop-blur-xl border-b border-black bg-white/30  ">
        <Link to="/">
          <p className="p-4 text-gray-700 font-bold text-3xl italic">
            Diagnostix
          </p>
        </Link>
      </div>
    </div>
  );
}
