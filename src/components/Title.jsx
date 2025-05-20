import React from "react"
import gsap from "gsap"
import { useEffect } from "react"


function Title() {
  useEffect(() => {
    gsap.to("#navbar", { duration: 1, y: 30, opacity: 1 });
  }, []);

  useEffect(() => {
    gsap.to("#list li", { duration: 1, y: 30, opacity: 1, delay: 1, stagger: 0.5, ease: "sine.out" });
  }, []);

  useEffect(() => {
    gsap.set("#info", { x: -30, opacity: 0 });
    gsap.to("#info", {duration: 1, x: 60, opacity: 1, delay: 3.5, tagger: 0.5, ease: "sine.out"});
  }, []);

  return (
    <div>
      <div className="flex flex-row" id="navbar">
      <div className="text-8xl font-bold text-center ml-10 sm:text-4xl sm:ml-5"><i className="bi bi-heart-pulse text-blue-500"></i><span className="inline text-teal-500 pl-4 sm:pl-2">Pat</span><span className="inline text-blue-500">Reg</span></div>
      <nav>
        <ul className="flex flex-row space-x-32 text-3xl font-bold text-center text-blue-500 mt-4 ml-64 sm:text-2xl sm:mt-2 sm:ml-32" id="list">
          <li>Home</li>
          <li>Register</li>
          <li>Query</li>
        </ul>
      </nav>
      </div>
      <div className="mt-16 text-black w-3/4 sm:mt-8 sm:w-2/3" id="info">
        <h3 className="text-8xl font-bold pt-8 text center pl-64 sm:text-4xl sm:pt-4 sm:pl-32">
          <span className="pl-16 sm:pl-8">Welcome</span> to the patient registration <span className="pl-64 sm: pl-32">system!</span>
        </h3>
      </div>
    </div>
  );
}

export default Title;

