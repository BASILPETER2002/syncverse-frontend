import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("user") || "guest";
  const fileInputRef = useRef();

  const API_URL = "https://syncverse.onrender.com";

  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfPreviewURL, setPdfPreviewURL] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [extractedText, setExtractedText] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [currentFile, setCurrentFile] = useState(null);
  const [activeSection, setActiveSection] = useState("upload");
  const [analytics, setAnalytics] = useState({ total_files: 0, total_words: 0, total_pages: 0, top_queries: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [youtubeSummary, setYoutubeSummary] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [webSummary, setWebSummary] = useState("");
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [clearStatus, setClearStatus] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/files/${username}`)
      .then(res => res.json())
      .then(data => setUploadedFiles(data.files || []))
      .catch(err => console.error(err));

    fetch(`${API_URL}/analytics/${username}`)
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(err => console.error(err));
  }, [username, API_URL]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setPdfPreviewURL(URL.createObjectURL(file));
    } else {
      alert("Only PDF files are allowed.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("No file selected.");
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("username", username);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadedFiles(prev => [...prev, data.filename]);
        setCurrentFile(data.filename);
        fetchExtractedText(data.filename);
        fetch(`${API_URL}/analytics/${username}`)
          .then(res => res.json())
          .then(setAnalytics);
      } else {
        alert(data.error || "Upload failed.");
      }
    } catch (err) {
      alert("Upload error: " + err.message);
    }
  };

  const fetchExtractedText = (filename) => {
    fetch(`${API_URL}/preview/${username}/${filename}`)
      .then(res => res.json())
      .then(data => setExtractedText(data.text || "No text found."))
      .catch(() => setExtractedText("Error fetching preview."));
  };

  const handleAiAsk = async () => {
    if (!aiQuestion || !currentFile) return;
    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: aiQuestion, username, filename: currentFile }),
      });
      const data = await res.json();
      setAiResponse(data.answer || data.error || "No response from Gemini.");
    } catch {
      setAiResponse("Failed to get a response.");
    }
  };

  const handleSearch = () => {
    const results = extractedText.split("\n").filter(line =>
      line.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleYouTubeSummarize = async () => {
    try {
      const res = await fetch(`${API_URL}/youtube`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeLink }),
      });
      const data = await res.json();
      setYoutubeSummary(data.summary || data.error || "No summary returned.");
    } catch {
      setYoutubeSummary("Failed to summarize.");
    }
  };

  const handleWebClipSummarize = async () => {
    try {
      const res = await fetch(`${API_URL}/webclip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: webUrl }),
      });
      const data = await res.json();
      setWebSummary(data.summary || data.error || "No summary returned.");
    } catch {
      setWebSummary("Failed to summarize.");
    }
  };

  const handleMultiChat = async () => {
    try {
      const res = await fetch(`${API_URL}/ask_all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: chatQuestion, username }),
      });
      const data = await res.json();
      setChatResponse(data.answer || data.error || "No response.");
    } catch {
      setChatResponse("Chat request failed.");
    }
  };

  const handleClearUserData = async () => {
    try {
      const res = await fetch(`${API_URL}/clear/${username}`, {
        method: "POST",
      });
      const data = await res.json();
      setClearStatus(data.message || data.error);
      setUploadedFiles([]);
      setExtractedText("");
      setAnalytics({ total_files: 0, total_words: 0, total_pages: 0, top_queries: [] });
    } catch {
      setClearStatus("Failed to clear user data.");
    }
  };

  // Voice recording logic remains unchanged
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setVoiceTranscript("");
    setVoiceError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = reader.result.split(",")[1];
          try {
            const res = await fetch(`${API_URL}/voice-to-text`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ audio: base64Audio }),
            });
            const data = await res.json();
            if (data.text) {
              setVoiceTranscript(data.text);
              handleVoiceAsk(data.text);
            } else {
              setVoiceError(data.error || "Could not transcribe audio.");
            }
          } catch (err) {
            setVoiceError("Voice processing failed: " + err.message);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      setTimeout(() => stopRecording(), 10000);
    } catch (err) {
      setVoiceError("Mic access denied or unsupported.");
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceAsk = async (question) => {
    try {
      const res = await fetch(`${API_URL}/ask_all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, username }),
      });
      const data = await res.json();
      setChatResponse(data.answer || "No response.");
    } catch {
      setChatResponse("Voice Ask failed.");
    }
  };

  // [Rendering UI remains unchanged – no need to rewrite here unless you want that part as well]
  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div>
          <h2 className="dashboard-logo">🧠 SyncVerse</h2>
          <nav className="dashboard-nav">
            <button className={activeSection === "upload" ? "active" : ""} onClick={() => setActiveSection("upload")}>⬆ Upload</button>
            <button className={activeSection === "youtube" ? "active" : ""} onClick={() => setActiveSection("youtube")}>📺 YouTube</button>
            <button className={activeSection === "web" ? "active" : ""} onClick={() => setActiveSection("web")}>🌐 Web Clipper</button>
            <button className={activeSection === "chat" ? "active" : ""} onClick={() => setActiveSection("chat")}>💬 Chat</button>
            <button className={activeSection === "settings" ? "active" : ""} onClick={() => setActiveSection("settings")}>⚙ Settings</button>
          </nav>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </aside>

      <main className="dashboard-main">
        <h1 className="welcome-heading">Welcome back, <span>{username}</span></h1>
        

        {/* Conditionally render each section below... */}
        {/* Sections will use same structure as before but now styled via Dashboard.css */}
       {activeSection === "upload" && (
          <>
            <section className="bg-gray-800 p-6 rounded-xl mb-6">
              <h3 className="text-lg font-semibold mb-4">Upload PDF</h3>
              <div className="flex gap-4 items-center">
                <input type="file" accept="application/pdf" ref={fileInputRef} onChange={handleFileChange} className="text-sm" />
                <button onClick={handleUpload} className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded">Upload</button>
              </div>
            </section>
            <section className="bg-gray-800 p-6 rounded-xl mb-6">
              <h3 className="text-lg font-semibold mb-2">📄 Extracted Text</h3>
              <ul className="list-disc ml-6 text-sm">
                {uploadedFiles.map((file, i) => (
                  <li key={i} className="cursor-pointer text-cyan-400 hover:underline" onClick={() => { setCurrentFile(file); fetchExtractedText(file); }}>{file}</li>
                ))}
              </ul>
              <pre className="text-sm whitespace-pre-wrap mt-4">{extractedText}</pre>
            </section>
            <section className="bg-gray-800 p-6 rounded-xl mb-6">
              <input type="text" placeholder="Search in text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white mb-2" />
              <button onClick={handleSearch} className="bg-cyan-500 px-4 py-1 rounded text-sm">Search</button>
              <ul className="mt-3 text-sm text-green-300">{searchResults.map((line, i) => <li key={i}>{line}</li>)}</ul>
            </section>
            <section className="bg-gray-800 p-6 rounded-xl mb-6">
              <input type="text" placeholder="I am waiting..." value={aiQuestion} onChange={(e) => setAiQuestion(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white mb-2" />
              <button onClick={handleAiAsk} className="bg-cyan-500 px-4 py-2 rounded text-sm">Ask Me</button>
              {aiResponse && <div className="mt-4 text-sm bg-gray-700 p-4 rounded whitespace-pre-wrap">{aiResponse}</div>}
            </section>
            <section className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">📊 Analytics</h3>
              <p>Total PDFs: {analytics.total_files}</p>
              <p>Total Words: {analytics.total_words}</p>
              <p>Total Pages: {analytics.total_pages}</p>
              <ul className="list-disc ml-5 text-sm mt-2">{analytics.top_queries.map(([q, c], i) => <li key={i}>{q} ({c})</li>)}</ul>
            </section>
          </>
        )}

        {activeSection === "youtube" && (
          <section className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Youtube link</h3>
            <input type="text" placeholder="YouTube URL" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white mb-3" />
            <button onClick={handleYouTubeSummarize} className="bg-cyan-500 px-4 py-2 rounded text-sm">Summarize Videos</button>
            {youtubeSummary && <div className="mt-4 text-sm bg-gray-700 p-4 rounded whitespace-pre-wrap">{youtubeSummary}</div>}
          </section>
        )}

        {activeSection === "web" && (
          <section className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Web link</h3>
            <input type="text" placeholder="Website URL" value={webUrl} onChange={(e) => setWebUrl(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white mb-3" />
            <button onClick={handleWebClipSummarize} className="bg-cyan-500 px-4 py-2 rounded text-sm">Summarize Webpage</button>
            {webSummary && <div className="mt-4 text-sm bg-gray-700 p-4 rounded whitespace-pre-wrap">{webSummary}</div>}
          </section>
        )}

        {activeSection === "chat" && (
          <section className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-3">💬 Chat Across PDFs</h3>
            <input type="text" placeholder="Ask anything..." value={chatQuestion} onChange={(e) => setChatQuestion(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white mb-3" />
            <button onClick={handleMultiChat} className="bg-cyan-500 px-4 py-2 rounded text-sm">Ask Me (All PDFs)</button>
            <button onClick={startRecording}className="bg-purple-500 text-white px-4 py-2 rounded mt-3">{isRecording ? "🎙️ Recording..." : "🎤 Ask via Voice"}</button>
            {chatResponse && <div className="mt-4 text-sm bg-gray-700 p-4 rounded whitespace-pre-wrap">{chatResponse}</div>}
          </section>
        )}

        {activeSection === "settings" && (
  <div className="bg-gray-800 p-6 rounded-xl">
    <h3 className="text-lg font-semibold mb-2">⚙ Clear All Data</h3>
    <button
      onClick={async () => {
        try {
          const res = await fetch(`https://syncverse.onrender.com/preview/${username}`);
          const data = await res.json();
          alert(data.message || data.error);
        } catch (err) {
          alert("Failed to clear user data.");
        }
      }}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
    >
      Clear All Data
    </button>
  </div>
        )}
        {/* Copy your existing <section> elements here with same logic */}
        {/* Or I can migrate all of them into new stylized layout if you want */}

      </main>
    </div>
  );
}
