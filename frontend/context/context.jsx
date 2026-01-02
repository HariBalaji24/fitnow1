import { createContext, useEffect, useState, useRef } from "react";
import axios from "axios";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const token = localStorage.getItem("auth-token");
  const url = "https://fitnow1-1.onrender.com"
  const [id, setId] = useState(null);
  const [details, setDetails] = useState(null);
  const [workoutgenerated, setworkoutgenerated] = useState(false);
  const [dietgenerated, setdietgenerated] = useState(false);
  const [detailsfilled,setdetailsfilled] = useState(false)
  const [logged,setlogged] = useState(false)
console.log("id:",id)
  useEffect(() => {
    
    async function fetchId() {
      try {
        const res = await axios.get(`${url}/getid`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setId(res.data.user_id);
      } catch (err) {
        console.log("Error fetching ID:", err);
      }
    }

    fetchId();
  }, []);
 console.log("logged:",logged) 
  useEffect(() => {
    if (!id) return;

    async function fetchDetails() {
      try {
        const res = await axios.get(`${url}/userdetails/${id}`);
        
        setDetails(res.data);
        setdetailsfilled(true)
      } catch (err) {
        console.log("Error fetching details:", err);
      }
    }

    fetchDetails();
  }, [id,logged]);
  


  useEffect(() => {
  if (!id) return;
  if (!details) return;
  if (workoutgenerated) return;

  const generateWorkout = async () => {
    try {
      console.log("started generating workout");
      const res = await axios.post(
        `${url}/workout-plan/${id}`,
        details
      );

      if (res.data) {
        setworkoutgenerated(true);
      }
    } catch (err) {
      console.error("Error generating workout plan:", err);
    }
  };

  generateWorkout();
}, [id, details,workoutgenerated,logged]);

  
  useEffect(() => {
  if (!id || !details || dietgenerated) return;

  async function generatedietplan() {
    try {
      console.log("started generating diet plan");
      const res = await axios.post(
        `${url}/diet-plan/${id}`,
        details
      );

      if (res.data?.success) {
        setdietgenerated(true);
      }
    } catch (err) {
      console.error("Error generating diet plan:", err);
    }
  }

  generatedietplan();
}, [id, details, dietgenerated,logged]);

console.log(workoutgenerated)
  return (
    <Context.Provider
      value={{
        url,
        token,
        id,
        setId,
        workoutgenerated,
        dietgenerated,
        logged,
        detailsfilled,
        setdetailsfilled,
        setlogged,
        setdetailsfilled,
      }}
    >
      {children}
    </Context.Provider>
  );
};

