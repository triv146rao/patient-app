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
    gsap.to("#info", {duration: 1, x: 60, opacity: 1, delay: 3, ease:"elastic.out(1, 1)"});
  }, []);

  

  // useEffect(() => {
  //   gsap.set("#info", { y: -30, opacity: 0 });
  //   gsap.to("#info", { duration: 1, y: 30, opacity: 1, delay: 2, ease: "bounce.in" });
  // }, []);
  return (
    <div>
      <div className="flex flex-row" id="navbar">
      <div className="text-8xl font-bold text-center ml-10"><i className="bi bi-heart-pulse text-blue-500"></i><span className="inline text-teal-500 pl-4">Pat</span><span className="inline text-blue-500">Reg</span></div>
      <nav>
        <ul className="flex flex-row space-x-32 text-3xl font-bold text-center text-blue-500 mt-4 ml-64" id="list">
          <li>Home</li>
          <li>Register</li>
          <li>Query</li>
        </ul>
      </nav>
      </div>
      <div className="mt-16 text-black w-3/4" id="info">
        <h3 className="text-8xl font-bold pt-8 text center pl-64">
          <span className="pl-16">Welcome</span> to the patient registration <span className="pl-64">system!</span>
        </h3>
        {/* <div className="flex flex-row text-2xl font-bold pt-4 text-white space-x-4 items-center justify-center">
          <div className="h-64 w-64 bg-blue-200 rounded-lg border">Query</div>
          <div className="h-48 w-48 bg-blue-200 rounded-lg border">Register</div>
        </div> */}
      </div>
    </div>
  );
}

export default Title;

