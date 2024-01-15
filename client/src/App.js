import React, { useState, useRef } from 'react';
import './App.css'; 
import './components/Navbar'
import PhoneImage from "./assets/phone-image.png"
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Route, Routes }from "react-router-dom";


function App() {
  const fileInput = useRef(null);
  const userInputRef = useRef(null);
  const [pythonOutput, setPythonOutput] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("chatdb", fileInput.current.files[0]);

    // Get user input from the form input field
    const userInput = userInputRef.current.value;

    try {
      // Upload the file
      const uploadResponse = await fetch('/profile', {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        // Trigger Python script execution with user input
        const runPythonResponse = await fetch(`/profile/run-python?input=${userInput}`, {
          method: "POST",
        });

        if (runPythonResponse.ok) {
          const result = await runPythonResponse.json();
          console.log("Python script output:", result.output);

          // Set the Python script output to the state
          setPythonOutput(result.output);
        } else {
          console.error("Error running Python script:", runPythonResponse.statusText);
        }
      } else {
        console.error("Error uploading file:", uploadResponse.statusText);
      }
    } catch (e) {
      console.error(e.message);
    }
  }

  return (
    
    
    <div className="App">
      
      <Router>
      <Navbar />
      <div className="title-container">
      </div>
      <div class="row">
            <div class="about-col-1">
            <img src = {PhoneImage}/>
            </div>
            <div class="about-col-2">
                    <h1 class="sub-title">What We Do</h1>
                    <p align="left" class = "about-me-text">
                        ChatChief predicts who your group leader (the person in your group with the most influence) is using an algorithm based on who gets the most replies to their message within the shortest amount of time.
                    </p>
                   
            </div>
                    
      </div>


      <div class="row">

      <div class="Upload-col-1">
        <h2 class="sub-title">Find chat.db</h2>
      
        <ol align="left" class = "about-me-text">
          <li>Open Finder</li>
          <li>Click "Go" from the toolbar at the top left.</li>
          <li>Click "Go to Folder..." (the second to last option)</li>
          <li>Copy and paste this in "~/Library/Messages"</li>
          <li>Copy your chat.db file, and paste it to your desktop.</li>
          <li>Click "Choose File" on the right, and upload your chat.db file</li>
          <li>Enter your Groupchat name (must be exact)</li>
          <li>Click submit and find out who your Groupchat Leader is!</li>
        </ol>
        </div>
      
      <div class="Upload-col-2">
        <form onSubmit={onSubmit}>
        <div>
          <label className = "sub-title" htmlFor="chatdb">Upload File:</label>
          <input type="file" className = "fileInput" id="chatdb" name="chatdb" ref={fileInput} />
        </div>
        <div>
          <label htmlFor="userInput" >Groupchat Name:</label>
          <input type="text" id="userInput" name="userInput" ref={userInputRef} />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      

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