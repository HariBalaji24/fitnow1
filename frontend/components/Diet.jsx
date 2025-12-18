import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "../context/context";
import { Link } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from "framer-motion";

const Diet = () => {
  const [dietplan, setdietplan] = useState([]);
  const { id, token } = useContext(Context);

  useEffect(() => {
    if (!id) return;

    async function fetchDiet() {
      try {
        const res = await axios.get(`http://localhost:3000/getdietplan/${id}`);
        setdietplan(res.data);
      } catch (error) {
        console.error("Error fetching diet:", error);
      }
    }

    fetchDiet();
  }, [id]);


  return (
  <div className="min-h-screen w-full px-6 py-8 relative text-white flex flex-col items-center">
   

    {/* If NOT logged in */}
    {!token && (
            <div className="min-h-[70vh] mt-20 flex items-center justify-center px-4">
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

    {/* If logged in */}
    {token && (
      <>
        {!dietplan.length ? (
          <div className="min-h-[70vh] mt-20 flex flex-col items-center justify-center text-center px-4">
            <DotLottieReact
              src="https://lottie.host/a5558b1f-af62-4ddf-b725-e41047c49b07/1xhipji2Jl.lottie"
              loop
              autoplay
              className="md:w-110 mb-6"
            />

            <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r 
                           from-purple-400 to-fuchsia-500 bg-clip-text text-transparent mb-3">
              Building Your Personalized Diet Plan
            </h2>

            <p className="text-gray-300 text-lg font-medium max-w">
              Hold tight — your nutrition plan is being carefully crafted just for you.
              <span className="block mt-2 font-semibold">
                Healthy habits loading 🥗🔥
              </span>
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto mt-20">
            <table className="w-full min-w-[900px] border-collapse text-xs sm:text-sm bg-[#24153a] rounded-xl shadow-xl">
              <thead>
                <tr className="bg-purple-600 text-white sticky top-0">
                  {[
                    "Day",
                    "Breakfast",
                    "Snack 1",
                    "Lunch",
                    "Snack 2",
                    "Dinner",
                    "Calories",
                  ].map((col, i) => (
                    <th
                      key={i}
                      className="px-3 py-2 sm:px-4 sm:py-3 border border-purple-800"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {dietplan.map((day, index) => (
                  <tr
                    key={index}
                    className={`transition duration-300 ${
                      index % 2 === 0 ? "bg-[#2e1c46]" : "bg-[#3b2761]"
                    } hover:bg-purple-900`}
                  >
                    <td className="p-3 border border-purple-800 text-center">
                      {day.dayname.replace("**","").replace("y**","y")}
                    </td>

                    {/* Meals */}
                    {["breakfast", "snack1", "lunch", "snack2", "dinner"].map(
                      (meal, i) => (
                        <td
                          key={i}
                          className="p-3 border border-purple-800 text-left sm:text-center"
                        >
                          {day[meal]
                            ?.replace("~", "")
                            .replace("kcal", "cal")}
                        </td>
                      )
                    )}

                    <td className="p-3 border border-purple-800 text-center font-semibold text-purple-300">
                      {day.totalcalories.replace("cal", "")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    )}
  </div>
);

};

export default Diet;
