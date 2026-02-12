import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";

const app = express();

const __dirname = path.resolve();

app.get('/do', (req, res) => {
    res.status(200).json({message: "i have to do it"})
})
app.get('/books', (req, res) => {
    res.status(200).json({message: "you want a book"})
})

//its for deployment in production
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

app.listen(ENV.PORT, () =>{
    console.log(`server listening at port ${ENV.PORT}`);
    
})