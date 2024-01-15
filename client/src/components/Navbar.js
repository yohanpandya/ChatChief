import React from 'react'
import Logo from "../assets/logo.png"
import {Link} from "react-router-dom"
import '../styles/Navbar.css' 
function Navbar() {
  return (
    <div className = "navbar">
        <div className="leftSide">
            <img src = {Logo}/>
        </div>

    </div>
  )
}

export default Navbar