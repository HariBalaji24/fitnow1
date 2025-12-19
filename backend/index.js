import express from "express"
import router from "./routes/userroutes.js"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://fitnow1.vercel.app"
    ]
}))

app.use("/",router)

app.listen(3000, ()=>{
    console.log("server is running")

})
