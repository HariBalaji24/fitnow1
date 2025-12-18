import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "../components/Navbar";
import Login from "../components/Login";
import Home from "../components/Home";
import Deatils from "../components/Details";
import Workouts from "../components/Workouts";
import { Toaster } from "react-hot-toast";
import Workoutforeachday from "../components/Workoutforeachday";
import Diet from "../components/Diet";
import Profile from "../components/Profile";
import AiCoach from "../components/AiCoach";
import Progress from "../components/Progress";

function WithNavbarLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function WithoutNavbarLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}

const Googlewrapper = () => {
  return (
    <GoogleOAuthProvider clientId="643254695244-m34jfbhjma8ul3u508vsqta5ojjojoo9.apps.googleusercontent.com">
      <Login />
    </GoogleOAuthProvider>
  );
};

function App() {
  return (
    <>
      
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 1500,
          style: {
            background: "#1a1a1d",
            color: "#fff",
            border: "1px solid #333",
          },
        }}
      />

      <Routes>
        <Route element={<WithNavbarLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/workouts" element={<Workouts/>} />
          <Route path="/workouts/:day" element={<Workoutforeachday/>} />
          <Route path="/dietplan" element={<Diet/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/aicoach" element={<AiCoach/>} />
          <Route path="/progress" element={<Progress/>} />
        </Route>

        <Route element={<WithoutNavbarLayout />}>
          <Route path="/signin" element={<Googlewrapper />} />
          <Route path="/details" element={<Deatils />} />
        </Route>
      </Routes>
    </>
  );
}

<Route path="/workouts" element={<Workouts />} />
export default App;
