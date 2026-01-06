import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Context } from "../context/context";
import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Profile = () => {
  const { id, token,url } = useContext(Context);

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [details, setDetails] = useState(null);

  const [form, setForm] = useState({
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

  /* ---------------- FETCH PROFILE ---------------- */
  useEffect(() => {
    if (!id || !token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${url}/userdetails/${id}`);
        const data = res.data || {};
        setDetails(data);
        setForm((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, token]);

  /* ---------------- BMI AUTO CALC ---------------- */
  useEffect(() => {
    if (form.height && form.weight) {
      const bmi = (
        form.weight / ((form.height / 100) * (form.height / 100))
      ).toFixed(2);
      setForm((prev) => ({ ...prev, bmi }));
    }
  }, [form.height, form.weight]);

  const handleChange = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const saveChanges = async () => {
    try {
      setLoading(true);
      await axios.put(`${url}/updateuser/${id}`, form);
      setDetails(form);
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- NOT SIGNED IN ---------------- */
  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-8">
        <div className="max-w-md mt-30 w-full text-center border-[5px] bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl p-8 shadow-2xl">
          <DotLottieReact
            src="https://lottie.host/e8c0ecbe-66f5-486f-8b07-65cd6c71363c/9n3Cu6wYeE.lottie"
            autoplay
            loop
            className="w-40 h-40 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-white">Access Your Profile</h1>
          <p className="mt-2 text-white/70">
            Sign in to view and manage your fitness profile
          </p>
          <Link
            to="/signin"
            className="mt-6 inline-flex px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white shadow-lg hover:scale-105 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }

  /* ---------------- PROFILE NOT FILLED ---------------- */
  if (!form.firstname) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4 text-white">
        <div className="bg-gray-900 border border-purple-500/30 rounded-2xl p-8 text-center shadow-xl max-w-md">
          <h1 className="text-2xl font-semibold text-purple-400">
            Complete Your Profile
          </h1>
          <p className="mt-2 text-gray-300">
            Fill in your details to unlock personalized workouts
          </p>
          <Link to="/details">
            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-xl shadow-lg hover:scale-105 transition">
              Complete Profile
            </button>
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------- PROFILE PAGE ---------------- */
  return (
    <motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="min-h-screen px-6 py-24 text-white"
>
  <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-8">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-3xl font-extrabold text-purple-400">
          {form.firstname} {form.secondname}
        </h2>
        <p className="text-white/60 text-sm mt-3">
          Your fitness journey at a glance 💫
        </p>
      </div>

      {!editMode ? (
        <button
          onClick={() => setEditMode(true)}
          className="px-5 py-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-xl shadow hover:scale-105 transition"
        >
          ✏️ Edit Profile
        </button>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => setEditMode(false)}
            className="px-4 py-2 bg-gray-600 rounded-lg"
          >
            ❌ Cancel
          </button>
          <button
            onClick={saveChanges}
            className="px-4 py-2 bg-green-600 rounded-lg"
          >
            💾 Save
          </button>
        </div>
      )}
    </div>

    {/* BASIC INFO */}
    

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {[
        ["🪪 First Name", "firstname"],
        ["🪪 Last Name", "secondname"],
        ["🎂 Age", "age"],
        ["📏 Height (cm)", "height"],
        ["⚖️ Weight (kg)", "weight"],
        ["⏱️ Duration (min)", "duration"],
        ["📅 Frequency / week", "frequency"],
        ["📊 BMI", "bmi"],
      ].map(([label, name]) => (
        <div key={name}>
          <label className="text-sm text-purple-300">{label}</label>
          <input
            disabled={!editMode}
            value={form[name] || ""}
            onChange={(e) => handleChange(name, e.target.value)}
            className="w-full px-3 py-2 mt-1 rounded-lg bg-[#1a1230] border border-purple-600/40 text-white"
          />
        </div>
      ))}
    </div>

    

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { label: "🚻 Gender", name: "gender", options: ["Male", "Female", "Other"] },
        { label: "🏋️ Workout Location", name: "location", options: ["Home", "Gym", "Outdoor", "Both"] },
        { label: "🎯 Goal", name: "goal", options: ["Fat Loss", "Muscle Gain", "Maintain Weight", "Endurance", "Strength"] },
        { label: "⚠️ Medical Condition", name: "condition", options: ["None", "Heart Disease", "Diabetes", "PCOS", "Asthma", "Hypertension", "Thyroid"] },
        { label: "🥗 Diet Type", name: "diet", options: ["Vegetarian", "Non-Vegetarian", "Vegan", "Eggetarian", "Mixed"] },
        { label: "🍽️ Meal Preference", name: "meal", options: ["South Indian", "North Indian", "East Indian", "West Indian", "Indian Mixed", "Continental"] },
        { label: "🚫 Allergy", name: "allergy", options: ["None", "Lactose Intolerant", "Gluten-Free", "Nut Allergy", "Seafood Allergy"] },
      ].map((f) => (
        <div key={f.name}>
          <label className="text-sm text-purple-300 font-medium block mb-1">
            {f.label}
          </label>
          <select
            disabled={!editMode}
            value={form[f.name] ?? ""}
            onChange={(e) => handleChange(f.name, e.target.value)}
            className={`w-full px-3 py-2 rounded-lg bg-[#1a1230] border ${
              editMode ? "border-purple-600" : "border-transparent"
            } text-white`}
          >
            <option value="">{editMode ? "Select" : "—"}</option>
            {f.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>

    {/* MOTIVATION */}
    <div className="mt-10 text-center text-xl text-gray-300">
      🚀 Stay consistent. Your future self will thank you!
    </div>

  </div>
</motion.div>


  );
};

export default Profile;
