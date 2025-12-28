import React, { useContext, useEffect } from "react";
import PillNav from "../animations/pillnav";
import { Context } from "../context/context";
import logoimage from "../assets/logo.jpg"

const Navbar = () => {
  const {id,token,logged} = useContext(Context)
  const logout = () => {
    console.log("clicked")
    localStorage.removeItem("auth-token");
    window.location.reload(); 
  };
  
  useEffect(()=>{

  },[logged])

  return (
    <PillNav
      logo={logoimage}
      items={[
        { label: "Profile", href: "/profile" },
        { label: "Workouts", href: "/workouts" },
        { label: "AI Coach", href: "/aicoach" },
        { label: "Diet Plan", href: "/dietplan" },
        { label: "Progress", href: "/progress" },
      ]}
      authButton={
        token
          ? { label: "Logout", onClick: logout }
          : { label: "Sign In", href: "/signin" }
      }
    />
  );
};

export default Navbar;
