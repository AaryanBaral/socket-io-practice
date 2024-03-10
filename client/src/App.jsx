import { useEffect, useMemo, useState } from 'react'
import {io} from "socket.io-client"
import {Button, Container, Stack, TextField, Typography} from "@mui/material";
function App() {

  const socket = useMemo(()=>io("http://localhost:3000",{
    withCredentials:true
  }),[]);
  const [count, setCount] = useState(0);
  const [room,setRoom] = useState("");
  const [socketID,setSocketId] = useState("");
  const [message,setMessage] = useState("");
  const [messages,setMessages] = useState([]);
  const [roomName,setRoomName] = useState("");
  console.log(messages);

  const joinRoomHandler = (e)=>{
    e.preventDefault();
    setRoomName("");
    setRoom(roomName);
    socket.emit("join-room",roomName);
  }

  const handleSubmit =(e)=>{
    e.preventDefault();
    socket.emit("message",{message,room});
    setMessage("");

  }
  useEffect(()=>{
    socket.on("connect",()=>{
      setSocketId(socket.id);
      console.log("user Connected");
    })
    socket.on("recieve-message",(data)=>{
      console.log(data);
      setMessages((messages) => [...messages,data])
    })
  },[])

  return (
   <Container maxWidth="sm">
    <Typography>
      Welcome to Socket.io
    </Typography>
    <Typography>
      {socketID}
    </Typography>

    <form onSubmit={joinRoomHandler}>
      <TextField 
       value={roomName}
       onChange={(e)=> setRoomName(e.target.value)}
       id='outlined-basic' 
       label="Room Name" 
       variant='outlined'/>

      <Button type='submit' variant='contained' color='primary' >Join Room</Button>
    </form>

    <form onSubmit={handleSubmit}>
      <TextField 
       value={message}
       onChange={(e)=> setMessage(e.target.value)}
       id='outlined-basic' 
       label="Outlined" 
       variant='outlined'/>

      <TextField 
       value={room}
       onChange={(e)=> setRoom(e.target.value)}
       id='outlined-basic' 
       label="Room" 
       variant='outlined'/>

      <Button type='submit' variant='contained' color='primary' >Send</Button>
    </form>
    <Stack>

      {
        messages.map((m,i)=>(
          <Typography key={i} variant="h6" component="div" gutterBottom>{m}</Typography>
        ))
      }

    </Stack>
   </Container>
  )
}

export default App
