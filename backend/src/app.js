import express from "express";
import { ENV } from "./lib/env.js";

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({message: "i have to do it"})
})

app.listen(ENV.PORT, () =>{
    console.log(`server listening at port ${ENV.PORT}`);
    
})