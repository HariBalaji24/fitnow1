import React, { useState, useContext } from "react";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/context";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Login = () => {
  const { setId,url, id,setlogged} = useContext(Context);
  const [isSignup, setIsSignup] = useState(true);
  const [user, setuser] = useState({ name: "", email: "", password: "" });

  const navigate = useNavigate();

  const responsegoogle = async (authResult) => {
    try {
      if (authResult.code) {
        const response = await axios.get(
          `${url}/google?code=${authResult.code}`
        );
        const { token, user } = response.data;
        localStorage.setItem("auth-token", token);
        setlogged(response.data.logged)
        if (isSignup) {
          navigate("/details");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const googlelogin = useGoogleLogin({
    onSuccess: responsegoogle,
    onError: responsegoogle,
    flow: "auth-code",
  });

  const handlesubmit = async (e) => {
     e.preventDefault();
    if(!user.email || !user.password ) {
      toast.error("Fill out all the details")
      return
    }
   
    const link = `${url}/${isSignup ? "signin" : "login"}`;
    const payload = {
      email: user.email,
      password: user.password,
      ...(isSignup && { name: user.name }),
    };

    try {
      const response = await axios.post(link, payload, {
        headers: { "Content-Type": "application/json" },
      });
      const data = response.data
      setId(data.userid)
      if (data.success && data.token) {
        localStorage.setItem("auth-token",data.token)
        toast.success(`${data.message}`,{
          position: "top-center",
          duration:1000,
          icon:"✅"
        })
        console.log(data.signin)
        if(isSignup) {
          setTimeout(()=>{navigate("/details")},1000)
        }
        else{
          setTimeout(()=>{navigate("/")},1000)
        }
      }
      else{
        toast.error(`${data.message}`,{
          position: "top-center",
          duration:1000,
          icon:"❌"
        })
      }
    } catch (error) {
      toast.error("Something went wrong. Try again" , {
        position: "top-center",
        duration: 1000,
        style: { fontSize: "16px" },
        icon: "❌",
      });
      console.log(error)
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center px-5 relative"
    >
      
      <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              className="absolute inset-0 -z-10 pointer-events-none"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
                className="absolute w-[400px] h-[400px] bg-purple-600 blur-[150px] top-10 left-1/3"
              />
      
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.4, delay: 0.8, ease: "easeOut" }}
                className="absolute w-[400px] h-[400px] bg-blue-500 blur-[170px] bottom-10 right-1/3"
              />
            </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl"
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-2xl font-bold text-white tracking-wide mb-6"
        >
          {isSignup ? " Create Account" : " Welcome Back"}
        </motion.h2>

        <form className="space-y-5" onSubmit={handlesubmit}>
          {isSignup && (
            <motion.input
              
              type="text"
              placeholder="Full Name"
              value={user.name}
              onChange={(e) => setuser({ ...user, name: e.target.value })}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/25 text-white placeholder-gray-300 focus:border-purple-400 transition"
            />
          )}

          <motion.input
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            type="email"
            placeholder="Email Address"
            value={user.email}
            onChange={(e) => setuser({ ...user, email: e.target.value })}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/25 text-white placeholder-gray-300 focus:border-purple-400 transition"
          />

          <motion.input
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setuser({ ...user, password: e.target.value })}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/25 text-white placeholder-gray-300 focus:border-purple-400 transition"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition"
          >
            {isSignup ? " Sign Up" : " Log In"}
          </motion.button>
        </form>

        <div className="text-center text-gray-300 mt-4">
          {isSignup ? "Already have an account ?" : "New here ?"}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-purple-300 ml-2 hover:text-purple-400 transition underline-offset-4 hover:underline"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </div>

        <div className="flex items-center gap-3 text-gray-400 mt-4 text-sm">
          <div className="flex-1 h-px bg-white/30"></div>
          <span>or</span>
          <div className="flex-1 h-px bg-white/30"></div>
        </div>

        <motion.button
          onClick={googlelogin}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="w-full py-3 mt-3 border border-gray-400 hover:border-purple-400 hover:bg-purple-500 hover:text-white text-white rounded-lg transition flex justify-center items-center gap-2"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5"
          />
          Google
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Login;

