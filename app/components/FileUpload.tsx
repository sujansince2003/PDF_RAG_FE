"use client";
import React from "react";
import { Upload } from "lucide-react";

const FileUpload = () => {
  function handleFileUpload() {
    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", ".pdf");
    el.addEventListener("change", async () => {
      if (el.files && el.files.length > 0) {
        const file = el.files[0];
        const formData = new FormData();
        formData.append("pdf", file);
        await fetch("http://localhost:8000/upload/pdf", {
          method: "POST",
          body: formData,
        });
        console.log("file uploaded to backend");
      }
    });
    el.click();
  }

  return (
    <div
      onClick={() => handleFileUpload()}
      className="bg-slate-900 text-white shadow-2xl flex justify-center items-center border-2 rounded-xl p-4 "
    >
      <div className="flex justify-center items-center flex-col">
        <h1>Upload your pdf file</h1>

        <Upload />
      </div>
    </div>
  );
};

export default FileUpload;
