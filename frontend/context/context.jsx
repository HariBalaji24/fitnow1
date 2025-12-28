import { createContext, useEffect, useState, useRef } from "react";
import axios from "axios";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const token = localStorage.getItem("auth-token");
  const url = "https://fitnow1-1.onrender.com"
  const [id, setId] = useState(null);
  const [details, setDetails] = useState(null);
  const [workoutgenerated, setworkoutgenerated] = useState();
  const [dietgenerated, setdietgenerated] = useState(false);
  const [detailsfilled,setdetailsfilled] = useState(false)
  const [logged,setlogged] = useState(false)
  const hasFetchedDetails = useRef(false);

  useEffect(() => {
    if (!token) return;

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
  }, [token]);

  useEffect(() => {
    if (!id || hasFetchedDetails.current) return;

    async function fetchDetails() {
      try {
        const res = await axios.get(`${url}/userdetails/${id}`);
        
        setDetails(res.data);
        hasFetchedDetails.current = true;
      } catch (err) {
        console.log("Error fetching details:", err);
      }
    }

    fetchDetails();
  }, [id]);
  
  console.log(id)
  console.log("details",details)


  useEffect(() => {
  if (!id) return;
  if (!details) return;
  if (workoutgenerated) return;

  const generateWorkout = async () => {
    try {
      console.log("started generating workout");
      const res = await axios.post(
        `${url}/workout-plan/${id}`,
        details,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data?.success) {
        setworkoutgenerated(true);
      }
    } catch (err) {
      console.error("Error generating workout plan:", err);
    }
  };

  generateWorkout();
}, [id, details]);



  
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
}, [id, details, dietgenerated]);


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
        setlogged,
        setdetailsfilled,
      }}
    >
      {children}
    </Context.Provider>
  );
};

