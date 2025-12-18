import React, { useContext } from "react";
import { Context } from "../context/context";
import RotatingText from "../animations/rotatingtext.jsx";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import fitimage from "../assets/FITNOW_dp.png"

const Home = () => {
  const { id, token } = useContext(Context);

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}  
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-6 pt-[120px]"
    >
      <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl">

        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}   // 👈 also from top
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          className="text-center md:text-left max-w-xl z-[100]"
        >
          <h1 className="text-[32px] sm:text-[40px] md:text-[38px] lg:text-6xl font-extrabold text-white leading-tight">
            Transform Your Body <br /> With
            <span className="text-purple-400"> AI Guidance</span>
          </h1>

          <p className="text-gray-300 mt-4 text-lg">
            Personalized workouts and nutrition designed for your goals.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start items-center text-lg text-gray-300 mt-2 gap-2">
            <span>Powered by</span>

            <RotatingText
              texts={["AI Coaching", "Smart Tracking", "Goal Optimization", "Body Insights"]}
              mainClassName="px-4 bg-purple-500 font-semibold text-white overflow-hidden py-1 rounded-lg"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}   // 👈 subtle top drop
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
            className="mt-8 flex justify-center md:justify-start gap-4"
          >
            <Link to={`${token ? "/" : "/signin"}`} ><button className="px-6 py-3 text-white bg-purple-500 rounded-full font-semibold hover:bg-purple-600 transition">
              Start Now
            </button> </Link>
            
            <Link to={"/workouts"}><button className="px-6 py-3 border border-purple-500 text-purple-300 rounded-full font-semibold hover:bg-purple-500 hover:text-white transition">
              View Workouts
            </button></Link>  
          </motion.div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}   // 👈 image also slides from top
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
          className="max-w-sm"
        >
          <img
            src={fitimage}
            alt="Fitness model"
            className="w-full drop-shadow-[0_0_40px_rgba(200,0,255,0.6)]"
          />
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Home;
