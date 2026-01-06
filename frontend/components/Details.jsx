import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/context";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { z } from "zod";


const personalSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  secondname: z.string().min(1, "Last name is required"),
  age: z.number().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
});

const bodySchema = z.object({
  height: z.number().min(1, "Height is required"),
  weight: z.number().min(1, "Weight is required"),
  condition: z.string().min(1, "Condition required"),
});

const workoutSchema = z.object({
  location: z.string().min(1, "Workout location required"),
  frequency: z.number().min(1, "Frequency required"),
  duration: z.number().min(1, "Duration required"),
});

const dietSchema = z.object({
  goal: z.string().min(1, "Goal is required"),
  diet: z.string().min(1, "Diet type required"),
  meal: z.string().min(1, "Meal type required"),
  allergy: z.string().min(1, "Allergy field required"),
});

const Details = () => {
  const navigate = useNavigate();
  const { id,token,url, detailsfilled,setdetailsfilled, logged } = useContext(Context);
  const [currpage, setcurrpage] = useState(0);
  const steps = ["Personal", "Body", "Workout", "Diet"];

  const [data, setdata] = useState({
    firstname: "",
    secondname: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    bmi: "",
    condition: "",
    location: "",
    frequency: "",
    duration: "",
    goal: "",
    diet: "",
    meal: "",
    allergy: "",
  });

 
  
  const validatePage = () => {
    try {
      if (currpage === 0) personalSchema.parse(data);
      if (currpage === 1) bodySchema.parse(data);
      if (currpage === 2) workoutSchema.parse(data);
      if (currpage === 3) dietSchema.parse(data);

      return true;
    } catch (error) {
       toast.error("Fill out of the details")
      return false;
    }
  };

  const nextPage = () => {
    if (!validatePage()) return;
    setcurrpage((prev) => prev + 1);
  };

  const prevPage = () => setcurrpage((prev) => prev - 1);

  useEffect(()=>{
    if(detailsfilled) {
      navigate("/")
    }
  },[detailsfilled])
  
  useEffect(() => {
    if (data.height && data.weight) {
      const h = Number(data.height) / 100;
      const w = Number(data.weight);
      const calculatedBMI = (w / (h * h)).toFixed(2);
      setdata((prev) => ({ ...prev, bmi: calculatedBMI }));
    }
  }, [data.height, data.weight]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePage()) return;

    try {
      data.userid = id;
      const response = await axios.post(`${url}/adddetails`, data);
      setdetailsfilled(true)
      toast.success("Details saved successfully!", {
        position: "top-center",
      });

      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      toast.error("Something went wrong!", {
        position: "top-center",
      });
      console.log(error);
    }
  };

  
  const handleChange = (field, value) => {
    if (
      ["height", "weight", "age", "bmi", "frequency", "duration"].includes(
        field
      )
    ) {
      value = Number(value);
    }
    setdata((prev) => ({ ...prev, [field]: value }));
  };

  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b bg-black-800 text-white px-4 py-10">
      <div className="w-full max-w-md bg-black-1000 backdrop-blur-lg border border-violet-600/30 p-8 rounded-2xl shadow-lg space-y-6">
        
        
        <div className="flex justify-between mt-5 px-3 items-center mb-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center w-full relative">
              <div
                className={`flex items-center justify-center h-9 w-9 rounded-full font-semibold text-sm transition-all duration-300 z-10
                  ${
                    currpage >= index
                      ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg"
                      : "bg-gray-700 text-gray-400"
                  }`}
              >
                {index + 1}
              </div>

              <span
                className={`text-[13px] mt-2 ${
                  currpage >= index ? "text-violet-400" : "text-gray-400"
                }`}
              >
                {step}
              </span>

              {index !== steps.length - 1 && (
                <div
                  className={`absolute top-4 left-[55%] h-[2px] w-full transition-all duration-300 
                  ${
                    currpage > index
                      ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                      : "bg-gray-600"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

      
        {currpage === 0 && (
          <>
            <h2 className="title text-3xl text-violet-400 text-center">Personal Details</h2>

            <div className="flex flex-col items-center gap-4">
              <input type="text" placeholder="First Name" value={data.firstname}
                onChange={(e) => handleChange("firstname", e.target.value)}
                className="input outline-none"
              />
              <input type="text" placeholder="Last Name" value={data.secondname}
                onChange={(e) => handleChange("secondname", e.target.value)}
                className="input outline-none"
              />
              <input type="number" placeholder="Age" value={data.age}
                onChange={(e) => handleChange("age", e.target.value)}
                className="input outline-none"
              />
              <select value={data.gender} onChange={(e) => handleChange("gender", e.target.value)} className="input">
                <option hidden>Choose gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={nextPage} className="bg-violet-500 px-4 py-2 rounded-2xl">Next</button>
            </div>
          </>
        )}

        
        {currpage === 1 && (
          <>
            <h2 className="title text-3xl text-violet-400 text-center">Body Stats</h2>

            <div className="flex flex-col items-center gap-4">
              <input type="number" placeholder="Height (cm)" value={data.height}
                onChange={(e) => handleChange("height", e.target.value)} className="input"
              />
              <input type="number" placeholder="Weight (kg)" value={data.weight}
                onChange={(e) => handleChange("weight", e.target.value)} className="input"
              />

              <select value={data.condition} onChange={(e) => handleChange("condition", e.target.value)} className="input">
                <option hidden>Select condition</option>
                <option>None</option>
                <option>Diabetes</option>
                <option>PCOS</option>
                <option>Thyroid</option>
                <option>Hypertension</option>
                <option>Asthma</option>
                <option>Heart Disease</option>
              </select>

              <input type="number" placeholder="BMI" readOnly value={data.bmi}
                className="input bg-gray-700/50 text-gray-300 cursor-not-allowed"
              />
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={prevPage} className="bg-violet-500 px-4 py-2 rounded-2xl">Prev</button>
              <button onClick={nextPage} className="bg-violet-500 px-4 py-2 rounded-2xl">Next</button>
            </div>
          </>
        )}

        
        {currpage === 2 && (
          <>
            <h2 className="title text-3xl text-violet-400 text-center">Workout Stats</h2>

            <div className="flex flex-col items-center gap-4">
              <select value={data.location} onChange={(e) => handleChange("location", e.target.value)} className="input">
                <option hidden>Choose location</option>
                <option>Gym</option>
                <option>Home</option>
                <option>Both</option>
              </select>

              <input type="number" placeholder="Workout Frequency per week" value={data.frequency}
                onChange={(e) => handleChange("frequency", e.target.value)} className="input"
              />

              <input type="number" placeholder="Workout Duration (min)" value={data.duration}
                onChange={(e) => handleChange("duration", e.target.value)} className="input"
              />
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={prevPage} className="bg-violet-500 px-4 py-2 rounded-2xl">Prev</button>
              <button onClick={nextPage} className="bg-violet-500 px-4 py-2 rounded-2xl">Next</button>
            </div>
          </>
        )}

        
        {currpage === 3 && (
          <>
            <h2 className="title text-3xl text-violet-400 text-center">Diet Plan</h2>

            <div className="flex flex-col items-center gap-4">
              <select value={data.goal} onChange={(e) => handleChange("goal", e.target.value)} className="input">
                <option hidden>Choose goal</option>
                <option>Fat Loss</option>
                <option>Muscle Gain</option>
                <option>Maintain Weight</option>
                <option>Strength & Endurance</option>
              </select>

              <select value={data.diet} onChange={(e) => handleChange("diet", e.target.value)} className="input">
                <option hidden>Choose diet type</option>
                <option>Vegetarian</option>
                <option>Non-Vegetarian</option>
                <option>Vegan</option>
                <option>Eggetarian</option>
              </select>

              <select value={data.meal} onChange={(e) => handleChange("meal", e.target.value)} className="input">
                <option hidden>Choose meal type</option>
                <option>South Indian</option>
                <option>North Indian</option>
                <option>East Indian</option>
                <option>West Indian</option>
                <option>Indian Mixed</option>
                <option>Continental</option>
                <option>Mediterranean</option>
                <option>Asian</option>
                <option>Middle Eastern</option>
              </select>

              <select value={data.allergy} onChange={(e) => handleChange("allergy", e.target.value)} className="input">
                <option hidden>Select allergy type</option>
                <option>None</option>
                <option>Lactose Intolerant</option>
                <option>Gluten-Free</option>
                <option>Nut Allergy</option>
                <option>SeaFood Allergy</option>
              </select>
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={prevPage} className="bg-violet-500 px-4 py-2 rounded-2xl">Prev</button>
              <button onClick={handleSubmit} className="bg-violet-500 px-4 py-2 rounded-2xl">Submit</button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Details;
