import express from "express";
import { MongoClient } from "mongodb";
import studentRouter from "./router/student-mentor-router.js"
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

const client = new MongoClient(process.env.MONGO_URL);
client.connect();
console.log("Mongodb connected...");

app.use(express.json());
app.use(cors({origin: "http://localhost:3000", credentials: true}));


app.use("/API", studentRouter);


app.get("/",(req, res)=>{
    res.send("welcome to my app...")
})

app.listen(PORT,()=>console.log("App is running on port : ", PORT));

export {client}