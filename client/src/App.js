import React, { useState, useRef } from 'react';
import './App.css';
import './components/Navbar';
import PhoneImage from "./assets/phone-image.png";
import Navbar from './components/Navbar';
import { BrowserRouter as Router } from "react-router-dom";

const backend = "https://chatchief.onrender.com";

function App() {
  const fileInput = useRef(null);
  const userInputRef = useRef(null);
  const [pythonOutput, setPythonOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the request starts

    const formData = new FormData();
    formData.set("chatdb", fileInput.current.files[0]);

    const userInput = userInputRef.current.value;

    try {
      const uploadResponse = await fetch(backend + '/profile', {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.status === 200) {
        const responseData = await uploadResponse.json();
        console.log("Response from server:", responseData);

        const runPythonResponse = await fetch(backend + `/profile/run-python?input=${userInput}`, {
          method: "POST",
        });

        if (runPythonResponse.ok) {
          const result = await runPythonResponse.json();
          console.log("Python script output:", result.output);
          setPythonOutput(result.output);
        } else {
          console.error("Error running Python script:", runPythonResponse.statusText);
        }
      } else {
        console.error("Error uploading file:", uploadResponse.statusText);
      }
    } catch (e) {
      console.error(e.message);
    } finally {
      setLoading(false); // Set loading to false when the request completes
    }
  };

  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className="title-container" />
        <div className="row">
          <div className="about-col-1">
            <img src={PhoneImage} alt="Phone" />
          </div>
          <div className="about-col-2">
            <h1 className="sub-title">What We Do</h1>
            <p align="left" className="about-me-text">
              ChatChief predicts who the person in your group with the most influence (your ChatChief) is using an algorithm based on who gets the most replies to their message within the shortest amount of time.
            </p>
          </div>
        </div>

        <div className="row">
          <div className="Upload-col-1">
            <h2 className="sub-title">Find chat.db</h2>
            <ol align="left" className="about-me-text">
              <li>Open Finder</li>
              <li>Click "Go" from the toolbar at the top left.</li>
              <li>Click "Go to Folder..." (the second to last option)</li>
              <li>Copy and paste this in "~/Library/Messages"</li>
              <li>Copy your chat.db file and paste it to your desktop.</li>
              <li>Click "Choose File" on the right and upload your chat.db file</li>
              <li>Enter your Groupchat name (must be exact)</li>
              <li>Click submit and find out who your Groupchat Leader is!</li>
            </ol>
          </div>

          <div className="Upload-col-2">
            <form onSubmit={onSubmit}>
              <div>
                <label className="sub-title" htmlFor="chatdb">Upload File:</label>
                <input type="file" className="fileInput" id="chatdb" name="chatdb" ref={fileInput} />
              </div>
              <div>
                <label htmlFor="userInput">Groupchat Name:</label>
                <input type="text" id="userInput" name="userInput" ref={userInputRef} />
              </div>
              <div>
                <button type="submit">Submit</button>
              </div>
            </form>

            {/* Display loading message while loading */}
            {loading && <p className="python-output">Loading...</p>}
            
            {/* Display Python script output */}
            {pythonOutput && (
              <div>
                <p className="python-output">{pythonOutput}</p>
              </div>
            )}
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
