import express, { Request, Response } from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import  cookieParser from "cookie-parser";


interface SocketRequest extends Request {
    res: Response; 
    cookies: {
      token?: string;
    };
  }



const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true,
    }
});

app.use(cors({    
    origin:"http://localhost:5173",
    methods:["GET","POST"],
    credentials:true,
}))

const JWT_SECREAT_KEY = "helloth$%eremynam@#$eis%@aary@#$%anbaral"
const PORT = 3000;

io.use((socket,next)=>{
    const socketRequest = socket.request as SocketRequest;
    cookieParser()(socket.request as Request, socketRequest.res ,(err)=>{
        if(err) return next(err);
        const token = socketRequest.cookies.token;
        if(!token) return next(new Error("Authentication error"));
        const decoded = jwt.verify(token,JWT_SECREAT_KEY);
        if(!decoded) return next(new Error("Authentication error"));
        next();
    })
})
io.on("connection",(socket)=>{
    socket.on("message",({message,room})=>{
        console.log(message);
        io.to(room).emit("recieve-message",message);
    })
    socket.on("join-room",(room)=>{
        socket.join(room);
        console.log(`user joined ${room}`);
    })
})

app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.get("/login",(req,res)=>{
    const token = jwt.sign({_id:"hjdfajkl345234#$%vasd"},JWT_SECREAT_KEY);
    res.cookie("token",token,{httpOnly:true,secure:true,sameSite:"none"})
    .json("Login Sucessful");

})

server.listen(3000,()=>{
    console.log("server listning at port 3000")
})