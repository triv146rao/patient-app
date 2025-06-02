import React from "react"
import { Link } from "react-router-dom";
import gsap from "gsap"
import { TextPlugin } from "gsap/TextPlugin";
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(TextPlugin);

function Title() {
  useEffect(() => {
    // Remove localStorage dependency for Claude.ai compatibility
     let hasRun = localStorage.getItem("titleEffectRan");
    //let hasRun = false; // Use local variable instead
    
    if (!hasRun) {
      // Initial animation only once
      gsap.set("#navbar", { y: -50, opacity: 0 });
      gsap.to("#navbar", {
        duration: 1,
        y: 0, // Changed from 50 to 0 for better positioning
        opacity: 1,
        delay: 1,
        ease: "linear",
      });
      
      gsap.to("#list li", {
        duration: 1,
        y: 0, // Changed from 15 to 0
        opacity: 1,
        delay: 2,
        stagger: 0.5,
        ease: "sine.out",
      });
      
      gsap.to("#welcome", {
        duration: 2,
        text: "Welcome to our patient registration portal!",
        delay: 3.5,
        ease: "none",
        y: 0, // Changed from 50 to 0
      });
      
      gsap.set("#get-started", { y: -50, opacity: 0 });
      gsap.to("#get-started", {
        duration: 1,
        y: 0, // Changed from 15 to 0
        opacity: 1,
        delay: 6,
        stagger: 0.5,
        ease: "sine.out",
      });
      
      hasRun = true;
    } else {
      // On revisit: make sure things are at their final visible state
      gsap.set("#navbar", { y: 0, opacity: 1 });
      gsap.set("#list li", { y: 0, opacity: 1 });
      gsap.set("#welcome", { y: 0, opacity: 1 });
      gsap.set("#get-started", { y: 0, opacity: 1 });
    }
  }, []);

  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/regquer");
  };

  return (
    <div className="min-h-screen px-2 py-2">
      {/* Header Section */}
      <div className="lg:flex-col lg:items-center lg:justify-between" id="navbar">
        {/* Logo */}
        <div className="text-4xl md:text-9xl lg:text-8xl font-bold text-center lg:text-left mb-4 lg:mb-0">
          <i className="bi bi-heart-pulse text-blue-500"></i>
          <span className="inline text-teal-500 pl-2 md:pl-4">Pat</span>
          <span className="inline text-blue-500">Reg</span>
        </div>
        
        {/* Navigation */}
        <nav className="w-full lg:w-auto">
          <ul className="flex flex-col sm:flex-row justify-center lg:justify-end space-y-2 sm:space-y-0 sm:space-x-8 lg:space-x-16 text-xl md:text-5xl lg:text-3xl font-bold text-blue-500 ml-16 pt-8 pb-8 italic" id="list">
          <li className="text-center group">
              <span className="relative inline-block">
                Fast
                <span className="absolute left-0 bottom-0 w-0 h-1 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </span>
          </li>
            <li className="text-center group text-teal-500">
              <span className="relative inline-block">
                Easy
                <span className="absolute left-0 bottom-0 w-0 h-1 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </li>
            <li className="text-center group">
              <span className="relative inline-block">
                Secure
                <span className="absolute left-0 bottom-0 w-0 h-1 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Section */}
      <div className="mt-8 md:mt-12 lg:mt-16 text-teal-500" id="info">
        <h3 className="text-3xl sm:text-4xl md:text-8xl lg:text-9xl font-bold text-center lg:text-left leading-tight mb-8 md:mb-12 lg:mb-16 pb-8" id="welcome">
          Welcome to our patient registration portal!
        </h3>
        
        {/* Get Started Button */}
        <div className="flex justify-center lg:justify-start">
          <button 
            className="text-lg md:text-xl lg:text-2xl h-12 md:h-14 lg:h-16 px-6 md:px-8 lg:px-12 bg-white text-blue-500 font-bold rounded-full border-2 border-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300 flex items-center space-x-2 lg:space-x-4" 
            onClick={handleGetStarted} 
            id="get-started"
          >
            <span>Get started</span>
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Title;