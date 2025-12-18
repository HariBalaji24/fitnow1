import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ContextProvider } from "../context/context.jsx";
import Plasma from "../animations/aurora.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ContextProvider>      
      <div className="relative w-full min-h-screen bg-black">
        {/* <div className="fixed inset-0 -z-10 pointer-events-none">
          <Plasma 
            color="B13BFF"
            speed={0.55}
            direction="forward"
            scale={1}        // ⭐ More responsive & fills big screens
            opacity={0.7}      // ⭐ Slightly dim for cleaner UI
          />
        </div> */}       
        <App />
      </div>
      
    </ContextProvider>
  </BrowserRouter>
);