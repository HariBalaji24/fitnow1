import express from "express"
import router from "./routes/userroutes.js"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://fitnow-website.vercel.app"
    ]
}))
console.log("API KEY USED:", process.env.GEMINI_MODEL);
app.use("/",router)

app.listen(3000, ()=>{
    console.log("server is running")
})