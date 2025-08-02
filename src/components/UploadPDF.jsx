import React, { useState, useRef } from "react";

const UploadPDF = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();

  const handleFile = (file) => {
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = () => {
    setPdfFile(null);
    setPreviewUrl(null);
    fileInputRef.current.value = null;
  };

  const handleUpload = () => {
    if (pdfFile) {
      console.log("Uploading:", pdfFile);
      alert("PDF uploaded (mock)");
    } else {
      alert("No file selected.");
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 text-white max-w-2xl w-full mx-auto">
      <h2 className="text-xl font-semibold mb-4">📂 Upload PDF</h2>

      <div
        className={`w-full p-6 border-2 rounded-xl transition-all duration-300 ${
          isDragging
            ? "border-cyan-500 bg-gray-800"
            : "border-dashed border-gray-600 bg-gray-950"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="text-center text-gray-400">
          {pdfFile ? "📎 Click or drop to replace file" : "📁 Drag & drop a PDF here or click to select"}
        </p>
      </div>

      {pdfFile && (
        <div className="mt-4 text-sm text-gray-300">
          <p><strong>File:</strong> {pdfFile.name}</p>
          <p><strong>Size:</strong> {(pdfFile.size / 1024).toFixed(2)} KB</p>
          <button
            onClick={removeFile}
            className="mt-2 text-red-400 text-xs hover:underline"
          >
            ✖ Remove File
          </button>
        </div>
      )}

      {previewUrl && (
        <div className="mt-6 h-[500px]">
          <iframe
            src={previewUrl}
            title="PDF Preview"
            className="w-full h-full rounded border border-gray-700"
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        className="mt-6 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded text-sm font-medium w-full"
        disabled={!pdfFile}
      >
        Upload PDF
      </button>
    </div>
  );
};

export default UploadPDF;
