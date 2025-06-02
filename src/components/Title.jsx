import React from "react"
import { Link } from "react-router-dom";
import gsap from "gsap"
import { TextPlugin } from "gsap/TextPlugin";
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(TextPlugin);

function Title() {

  

  useEffect(() => {
    gsap.set("#navbar", { y: -50, opacity: 0 });
    gsap.to("#navbar", { duration: 1, y: 50, opacity: 1, delay: 1, ease: "linear"  });
  }, []);

  useEffect(() => {
    gsap.to("#list li", { duration: 1, y: 15, opacity: 1, delay: 2, stagger: 0.5, ease: "sine.out" });
  }, []);

  useEffect(() => {
    gsap.to("#welcome", {
    duration: 2,
    text: "Welcome to our patient registration portal!",
    delay: 3.5,
    ease: "none",
    y:50
  });
}, []);

useEffect(() => {
  gsap.set("#get-started", { y: -50, opacity: 0 });
  gsap.to("#get-started", { duration: 1, y: 15, opacity: 1, delay: 6, stagger: 0.5, ease: "sine.out" });
}, []);

const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/regquer"); // or any route you want
  };



  return (
    <div>
      <div className="flex flex-row" id="navbar">
      <div className="md:text-8xl font-bold text-center md:ml-10 sm:text-4xl sm:ml-5"><i className="bi bi-heart-pulse text-blue-500"></i><span className="inline text-teal-500 md:pl-4 sm:pl-2">Pat</span><span className="inline text-blue-500">Reg</span></div>
      <nav>
        <ul className="flex flex-row md:space-x-32 md:text-3xl font-bold text-center text-blue-500 md:mt-4 md:ml-64 sm:space-x-16 sm:text-2xl sm:mt-2 sm:ml-32" id="list">
          <li>Home</li>
          <li><Link to="/register" className="hover:underline">Register</Link></li>
          <li><Link to="/query" className="hover:underline">Query</Link></li>
        </ul>
      </nav>
      </div>
      <div className="md:mt-16 text-teal-500 md:w-3/4 sm:mt-8 sm:w-2/3" id="info">
        <h3 className="md:text-8xl font-bold md:pt-8 text center md:pl-8 sm:text-4xl sm:pt-4 sm:pl-4" id="welcome"></h3>
        <button className="text-2xl md:h-16 md:w-64 bg-blue-500 text-blue-500 font-bold py-2 px-4 bg-white rounded-[40px] border border-blue-500 md:mt-16 sm:h-8 sm:w-24 sm:mt-8 sm:py-1 sm:px-2 md:mt-36 ml-[600px]" onClick={handleGetStarted} id="get-started">
        Get started<span className="pl-8"><i class="bi bi-arrow-right"></i></span>
</button>
      </div>
      
    </div>
  );
}

export default Title;

