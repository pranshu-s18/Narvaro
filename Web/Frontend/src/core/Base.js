import React from "react";
import Navbar from "./Navbar";

const Base = ({ className = "text-white py-4", children }) => (
  <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
    <Navbar />
    <div className="container-fluid">
      <div className={className}>{children}</div>
    </div>
    <footer className="bg-dark text-white text-lg-start mt-auto">
      <div className="text-center p-3" style={{ backgroundColor: "#1f2326" }}>
        Developed by Pranshu Saxena
      </div>
    </footer>
  </div>
);

export default Base;
