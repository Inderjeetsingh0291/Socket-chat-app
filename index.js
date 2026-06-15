import http from "node:http";
import { Server } from "socket.io";
import path from "node:path";
import express from "express";

async function main(){
    
    const app = express();
    app.use(express.static(path.resolve("./public")));
    
    const server = http.createServer(app);
    const io = new Server();
    
    io.attach(server);

    io.on("connection", (socket) => {
        console.log("A new socket has connected", socket.id);

        socket.on("user-message", (data) => {
            console.log("Message from Socket", data);
            socket.broadcast.emit("server:message", data);
        });

        socket.on("user:typing", (data) => {
            socket.broadcast.emit("server:user-typing", {
                sender: data?.sender || `User ${socket.id.slice(0, 5)}`,
            });
        });
    });

    server.listen(9000, () =>{
        console.log("Http server is running on port 9000");
    });
}

main();