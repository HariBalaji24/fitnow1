import express from "express";
import router from "./routes/userroutes.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://fitnow1.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use("/", router);

const PORT = process.env.PORT || 3000;

app.get("/",(req,res)=>{
   res.send("this is home page")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
