import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "../context/context";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
const Workouts = () => {
  const { id, token,url, workoutgenerated } = useContext(Context);
  const [workouts, setWorkouts] = useState(null);
  const [loading, setLoading] = useState(true);
console.log(id)
  
  useEffect(() => {
    async function fetchWorkouts() {
      if (!id) return;
      setLoading(true); 
      try {
        const response = await axios.get(
          `${url}/getworkouts/${id}`
        );
        setWorkouts(response.data);
      } catch (error) {
        console.log(error);
      }

      setLoading(false); 
    }

    fetchWorkouts();
  }, [workoutgenerated,id]);
  console.log(workoutgenerated)
 return (
  <div className="min-h-screen w-full  text-white flex flex-col items-center">
    
    {/* NOT LOGGED IN */}
    {!token && (
      <div className="min-h-[70vh] mt-30 flex items-center align-middle justify-center px-4">
  <div className="
    max-w w-full text-center
    bg-white/5 backdrop-blur-xl
    border-[5px] border-white/10
    rounded-2xl
    p-8
    shadow-2xl
  ">
    <div className="flex justify-center mb-4">
      <DotLottieReact
        src="https://lottie.host/e8c0ecbe-66f5-486f-8b07-65cd6c71363c/9n3Cu6wYeE.lottie"
        loop
        autoplay
        className="w-40 h-40"
      />
    </div>

    <h1 className="text-3xl font-bold tracking-tight text-white">
      Generate Your Workout Plan
    </h1>

    <p className="mt-2 text-sm text-white/70">
      Sign in to get a personalized fitness routine tailored to your goals
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

    {/* LOGGED IN */}
    {token && (
      <>
        {/* LOADING / GENERATING — NORMAL div */}
        {!workoutgenerated && (
          <div className="min-h-[65vh] mt-30 flex flex-col items-center justify-center text-center px-4">
            <DotLottieReact
              src="https://lottie.host/cbe822dd-0556-44e4-aa43-6d113439f139/IJCf43WJQh.lottie"
              loop
              autoplay
              className="md:w-110 mb-6"
            />

            <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r 
                           from-purple-400 to-fuchsia-500 bg-clip-text text-transparent mb-3">
              Crafting Your Fitness Roadmap
            </h2>

            <p className="text-gray-300 text-lg font-medium max-w">
              Hold tight — your personalized workout plan is being generated.
              <span className="block mt-2 font-semibold">
                Greatness loading 🚀🔥
              </span>
            </p>
          </div>
        )}

        {/* WORKOUTS — motion.div ONLY HERE */}
        {!loading && workouts && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-30 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 px-3 
                       lg:grid-cols-5 xl:grid-cols-6 gap-5 w-full max-w-6xl"
          >
            {workouts.map((work, index) => (
              <Link to={`/workouts/${index + 1}`} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="p-4 rounded-xl bg-white/10 backdrop-blur-lg 
                             border border-white/20 shadow-xl 
                             hover:scale-105 transition text-center"
                >
                  <h2 className="text-xl font-bold text-purple-400">
                    Day {work.day}
                  </h2>
                  <p className="text-gray-200 mt-1 text-sm">
                    {work.focus}
                  </p>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </>
    )}
  </div>
);

};

export default Workouts;
