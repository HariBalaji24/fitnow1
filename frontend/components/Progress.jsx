import React, { useContext } from "react";
import { Context } from "../context/context";
import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const Progress = () => {
  const { token, id } = useContext(Context);
  const [workouts, setworkouts] = useState();
  useEffect(() => {
    async function fetchworkout() {
      if (!id) return null
      try {
        const date = new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
        });
        const response = await axios.get(`http://localhost:3000/workoutsdoneonday/${id}`, {
          params: {date},
        });
        setworkouts(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchworkout();
  }, [id]);
  console.log(workouts);
  return (
    <div className="min-h-screen w-full px-6 py-8 text-white flex flex-col items-center">
      {!token && (
        <div className="min-h-[70vh] mt-20 flex items-center justify-center px-4">
          <div
            className="
    max-w w-full text-center
    bg-white/5 backdrop-blur-xl
    border-[5px] border-white/10
    rounded-2xl
    p-8
    shadow-2xl
  "
          >
            <div className="flex justify-center mb-4">
              <DotLottieReact
                src="https://lottie.host/e8c0ecbe-66f5-486f-8b07-65cd6c71363c/9n3Cu6wYeE.lottie"
                loop
                autoplay
                className="w-40 h-40"
              />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              Let’s Track Your Growth
            </h1>

            <p className="mt-2 text-sm text-white/70">
              Sign in to see your workouts turn into measurable progress
            </p>

            <Link
              to="/signin"
              className="
        mt-6 inline-flex items-center justify-center
        bg-linear-to-r from-purple-500 to-pink-500
        hover:from-purple-600 hover:to-pink-600
        text-white px-8 py-3
        rounded-xl font-semibold
        shadow-lg 
        transition-all duration-300
      "
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
      <div>
        
      </div>
    </div>
  );
};
export default Progress;
