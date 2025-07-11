"use client";
import React, { useState } from "react";
import { Upload, Loader2, CheckCircle2 } from "lucide-react"; // Add Loader2 and CheckCircle2 icons

const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  async function handleFileUpload() {
    if (uploading) return; // Prevent multiple clicks during upload

    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", ".pdf");
    el.addEventListener("change", async () => {
      if (el.files && el.files.length > 0) {
        const file = el.files[0];
        const formData = new FormData();
        formData.append("pdf", file);

        setUploading(true);
        setUploadSuccess(false); // Reset success state on new upload attempt

        try {
          const res = await fetch("http://localhost:8000/upload/pdf", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            throw new Error(`Upload failed with status: ${res.status}`);
          }

          console.log("file uploaded to backend");
          setUploadSuccess(true);
        } catch (error: any) {
          console.error("Error uploading file:", error);
          alert(`Failed to upload file: ${error.message}`);
          setUploadSuccess(false);
        } finally {
          setUploading(false);
        }
      }
    });
    el.click();
  }

  return (
    <div
      onClick={handleFileUpload}
      className="bg-slate-900 text-white shadow-2xl flex flex-col justify-center items-center border-2 rounded-xl p-8 cursor-pointer hover:bg-slate-800 transition-colors duration-200 w-full h-full"
    >
      <div className="flex justify-center items-center flex-col gap-2">
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <h1 className="text-xl font-semibold">Uploading PDF...</h1>
          </>
        ) : uploadSuccess ? (
          <>
            <CheckCircle2 className="h-8 w-8 text-green-400" />
            <h1 className="text-xl font-semibold">PDF Uploaded!</h1>
            <p className="text-sm text-gray-300">You can now ask questions.</p>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-gray-300" />
            <h1 className="text-xl font-semibold">Upload your PDF file</h1>
            <p className="text-sm text-gray-300">Click to select a file</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
