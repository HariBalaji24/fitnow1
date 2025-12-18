import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Context } from "../context/context";
import axios from "axios";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Workoutforeachday = () => {
  const location = useLocation();
  const today = location.pathname.split("/workouts/")[1];
  const { id } = useContext(Context);

  const [indiWorkout, setIndiWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workoutsdone, setworkoutsdone] = useState({});

  const toggleDone = async (index,exercise) => {
    const newvalue = !workoutsdone[index];
    
    setworkoutsdone((prev) => ({ ...prev, [index]: newvalue  }));
   const details= {
    day: indiWorkout.day,
        exercise: index,
        isdone: newvalue,
        name:exercise
   }
    try {
      await axios.post(`http://localhost:3000/workoutdone/${id}`, details);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!id) return;

    async function getworkoutsdone() {
      const res = await axios.get(
        `http://localhost:3000/getchangedworkout/${id}`,
        { params: { day: Number(today) } }
      );

      const obj = {};
      res.data.forEach((data) => {
        obj[data.exercise] = data.isdone;
      });

      setworkoutsdone(obj);
    }

    getworkoutsdone();
  }, [indiWorkout, today, id]);

  console.log(indiWorkout);

  useEffect(() => {
    if (!id) return;

    async function fetchDayWorkout() {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/getworkouts/${id}`);

        const filtered = res.data.find((d) => d.day.toString() === today);

        setIndiWorkout(filtered);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    fetchDayWorkout();
  }, [today, id]);

  useEffect(() => {
    if (!indiWorkout || !indiWorkout.exercises) return;

    const cleaned = indiWorkout.exercises.replace(/["{}]/g, "");
    const items = cleaned.split(")").filter((e) => e.trim() !== "");

    const total = items.length;
    const completed = Object.values(workoutsdone).filter(Boolean).length;

    if (completed === total && total > 0) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        confetti({
          particleCount: 80,
          spread: 1000,
          startVelocity: 30,
          ticks: 100,
          origin: { x: Math.random(), y: Math.random() },
        });
      }, 300);
    }
  }, [workoutsdone]);

  if (loading || !indiWorkout) {
    return (
      <div className="h-screen flex items-center justify-center text-white text-2xl">
        Loading your workout...
      </div>
    );
  }

  const cleaned = indiWorkout.exercises.replace(/["{}]/g, "");
  const items = cleaned
    ?.split(") ")
    .map((e) => (e.trim().endsWith(")") ? e.trim() : e.trim() + ")"));

  const completed = Object.values(workoutsdone).filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen px-3 pt-25 pb-8 text-white"
    >
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-purple-400">
          Day {indiWorkout.day}
        </h1>
        <p className="text-xl mt-2 font-semibold text-gray-300">
          Focus : <span className="text-purple-300">{indiWorkout.focus}</span>
        </p>
      </div>

      {/* ---------------------------
          Progress bar
      ---------------------------- */}
      {indiWorkout.focus !== "Rest" && (
        <div className="w-full max-w-lg mx-auto mb-7">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-purple-300">Progress</span>
            <span className="text-gray-200">
              {completed}/{items.length}
            </span>
          </div>

          <div className="w-full bg-white/20 rounded-full h-3 ">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500"
              style={{
                width: `${(completed / items.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* ---------------------------
          Exercise Grid
      ---------------------------- */}
      {indiWorkout.focus !== "Rest" && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 px-5 mx-auto">
          {items.map((rows, index) => {
            const trimmed = rows.trim();

            const [exercise, insideRaw] = trimmed.split(" (");
            const inside = insideRaw?.replace(")", "");

            const parts = inside.split(" — ");

            const reps = parts[0]?.replace("x", " x ");
            const desc = parts[1];
            const calories = Math.floor(parts[2]?.replace("~", "").replace(" kcal", "")/4);
            const target = parts[3]?.replace(" ", " , ");

            const isDone = workoutsdone[index];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl p-5 border backdrop-blur-lg transition ${
                  isDone
                    ? "bg-green-900/30 border-green-500/40 scale-[1.02]"
                    : "bg-white/10 border-white/20 hover:scale-[1.02]"
                }`}
              >
                <div className="flex justify-between items-start">
                  <h2
                    className={`text-lg font-bold ${
                      isDone ? "text-green-400" : "text-purple-300"
                    }`}
                  >
                    {exercise}
                  </h2>

                  <button
                    onClick={() => toggleDone(index,exercise)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition ${
                      isDone
                        ? "bg-green-600 border-green-500 text-white"
                        : "bg-purple-600 border-purple-500 text-white"
                    }`}
                  >
                    {isDone ? "Done" : "Mark Done"}
                  </button>
                </div>

                <p className="mt-2 text-gray-200 text-sm">
                  <span className="font-semibold text-purple-400">Reps :</span>{" "}
                  {reps}
                </p>

                <p className="text-gray-200 text-sm mt-2">
                  <span className="font-semibold text-purple-400">
                    Calories :
                  </span>{" "}
                  {calories} cal
                </p>

                <p className="text-gray-200 text-sm mt-2">
                  <span className="font-semibold text-purple-400">
                    Target :
                  </span>{" "}
                  {target}
                </p>

                <p className="mt-2 text-gray-300 text-sm leading-snug">
                  <span className="font-semibold text-purple-400">
                    Description :
                  </span>{" "}
                  {desc.charAt(0).toUpperCase() + desc.slice(1)}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}

      {indiWorkout.focus === "Rest" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl mx-auto mt-5 
               border border-purple-500/30 backdrop-blur-xl
               rounded-2xl p-4 shadow-lg 
               flex flex-col  items-center"
        >
          <DotLottieReact
            src="https://lottie.host/285af7fc-e019-478a-8b94-26bff1f985d0/A0yRbrmtk8.lottie"
            loop
            autoplay
          />

          <p className="text-gray-300 text-lg leading-relaxed text-center">
            Today is all about recovery. Your body grows stronger when you rest
            — enjoy the pause.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Workoutforeachday;
