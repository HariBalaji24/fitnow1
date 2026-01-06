import React, { useContext,useEffect,useState } from "react";
import { Context } from "../context/context";
import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Progress = () => {
  const { token, id, url } = useContext(Context);
  const [workouts, setworkouts] = useState();
  const [chartdata,setChartdata] = useState([])
  let totalworkouts=0
  console.log(id)
  for (const item of chartdata ){
     totalworkouts+=item.workouts
  }
  

  useEffect(() => {
    async function fetchworkout() {
      if (!id) return null;
      try {
        const date = new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
        });
        console.log(date);
        const response = await axios.get(
          `${url}/workoutsdoneonday/${id}`,
          {
            params: { date },
          }
        );
        setworkouts(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchworkout();
  }, [id]);
console.log(workouts)
  useEffect(() => {
  if (!workouts) return;

  const formatted = workouts.exercises.map(item => ({
    date: new Date(item.workout_date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    }),
    workouts: Number(item.total_workouts),
  }));

  setChartdata(formatted);
}, [workouts]);
const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white/10 rounded-xl p-4 text-center shadow-lg">
      <p className="text-sm text-gray-300">{title}</p>
      <p className="text-3xl font-bold text-purple-400 mt-1">
        {icon} {value}
      </p>
    </div>
  );
};

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <DotLottieReact
            src="https://lottie.host/e8c0ecbe-66f5-486f-8b07-65cd6c71363c/9n3Cu6wYeE.lottie"
            loop
            autoplay
            className="w-40 mx-auto"
          />
          <h1 className="text-3xl font-bold mt-4">
            Track Your Workout Progress
          </h1>
          <p className="text-white/70 mt-2">
            Sign in to see your consistency visually
          </p>
          <Link
            to="/signin"
            className="inline-block mt-6 bg-purple-600 px-6 py-3 rounded-xl font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // ---- NO DATA ----
  if (chartdata.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        No workout data available yet 📉
      </div>
    );
  }

  // ---- MAIN UI ----
 return (
  <div className="min-h-screen pt-25 px-6 py-10 text-white">

    {/* HEADER */}
    <h1 className="text-4xl font-extrabold text-center text-purple-400">
      Progress Overview
    </h1>
    <p className="text-center text-gray-300 mt-2">
      Track your workout consistency over time
    </p>

    {/* STATS */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
      <StatCard title="Total Workouts" value={totalworkouts} icon="💪" />
      <StatCard title="Days Active" value={chartdata.length} icon="📅" />
      <StatCard
        title="Avg / Day"
        value={(totalworkouts / chartdata.length)}
        icon="📊"
      />
      
    </div>

    {/* GOAL PROGRESS */}
    <div className="w-full max-w-xl mx-auto mt-10">
      <div className="flex justify-between text-sm mb-2">
        <span className="font-semibold text-purple-300">Goal Progress</span>
        <span className="text-gray-200">
          {totalworkouts} / 180
        </span>
      </div>

      <div className="w-full bg-white/20 rounded-full h-3">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-700"
          style={{
            width: `${Math.min((totalworkouts / 180) * 100, 100)}%`,
          }}
        />
      </div>
    </div>

    {/* CHART */}
    <div className="mt-12 w-full h-[350px]">
      <ResponsiveContainer>
        <BarChart data={chartdata}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar
            dataKey="workouts"
            fill="#B13BFF"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* MOTIVATION */}
    <div className="mt-10 text-center text-2xl text-gray-300">
      {totalworkouts >= 300
        ? "🎉 Goal achieved! Incredible discipline!"
        : "🔥 Keep going! Consistency beats intensity!"}
    </div>
  </div>
);

};
export default Progress;
