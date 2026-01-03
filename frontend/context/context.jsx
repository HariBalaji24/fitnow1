import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const token = localStorage.getItem("auth-token");
  const url = "https://fitnow1-1.onrender.com";

  const [id, setId] = useState(null);
  const [details, setDetails] = useState(null);
  const [workoutgenerated, setworkoutgenerated] = useState(false);
  const [dietgenerated, setdietgenerated] = useState(false);
  const [detailsfilled, setdetailsfilled] = useState(false);
  const [logged, setlogged] = useState(false);

  /* ---------------- FETCH USER ID ---------------- */
  useEffect(() => {
    if (!token) return;

    async function fetchId() {
      try {
        const res = await axios.get(`${url}/getid`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setId(res.data.user_id);
        setlogged(true);
      } catch (err) {
        console.log("Error fetching ID:", err);
      }
    }

    fetchId();
  }, [token]);

  /* ---------------- FETCH USER DETAILS ---------------- */
  useEffect(() => {
    if (!id) return;

    async function fetchDetails() {
      try {
        const res = await axios.get(`${url}/userdetails/${id}`);
        setDetails(res.data);
        setdetailsfilled(true);
      } catch (err) {
        console.log("Error fetching details:", err);
      }
    }

    fetchDetails();
  }, [id]);

  /* ---------------- GENERATE WORKOUT PLAN ---------------- */
  useEffect(() => {
    if (!id || !details || workoutgenerated) return;

    async function generateWorkout() {
      try {
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
    }

    generateWorkout();
  }, [id, details, workoutgenerated]);

  /* ---------------- GENERATE DIET PLAN ---------------- */
  useEffect(() => {
    if (!id || !details || dietgenerated) return;

    async function generateDiet() {
      try {
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

    generateDiet();
  }, [id, details, dietgenerated]);

  return (
    <Context.Provider
      value={{
        url,
        token,
        id,
        setId,
        logged,
        workoutgenerated,
        dietgenerated,
        detailsfilled,
        setlogged,
        setdetailsfilled,
      }}
    >
      {children}
    </Context.Provider>
  );
};
