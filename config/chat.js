const socketIo = require("socket.io");
const Message = require("../models/messages");

function chatSocket(chatServer){
    const io = socketIo(chatServer,{
        cors: {
          origin: '*',
        }
      });

    const users = {};

    io.on("connection",(socket)=>{
        const query = socket.handshake.query;
        const from = query.userName;
        console.log('A client has connected with socketid and userid is:', socket.id,from);
        // Store the from userId in users object with socket id as key
        users[socket.id] = from;
        console.log("Updated users is",users);

        // To create a room between sender and receiver
        socket.on("create-room",function(data){
            console.log("Inside create room",data);
            const {from,to} = data;

            // Unique and private room is created for two users.
            const roomName = [from,to].sort().join("");
            socket.join(roomName);
        })

        // private-msg is a custom event
        socket.on("send-message",async function(data){
            
            console.log("send-message event triggered by",from,"with data",data);
            // Destructuring the data object which is passed as argument to the callback
            const {to,message} = data;

            // Check whether the connection to receiver user exists or not
            const toSocket = Object.keys(users).find(socketId=>{
                return users[socketId] == to;
            });

            console.log("Does receiver exist?",toSocket);

            // If it exist the store the msg in db and create a room then emit the msg in the room
            if(toSocket){

                // Create a unique room for two users
                // const roomName = [socket.id,toSocket].sort().join("-");

                // This will be used as room as well as combinedId to store the msg in db
                const roomName = [from,to].sort().join("");

                // Find if the msg array between two users is already exist or not
                let msgStore = await Message.findOne({combineUserId:roomName});

                // If it doesn't exits create new one
                if(!msgStore){
                    msgStore = new Message({
                        combineUserId:roomName,
                        messages:[]
                    })
                }

                // Push the new message into the msgStore's messages array
                msgStore.messages.push({
                    from:from,
                    to:to,
                    message
                })

                // Save the msgStore in the db
                await msgStore.save();

                // Broadcast the new message into the already existed room.
                io.to(roomName).emit("get-message",{
                    sender:users[socket.id],
                    message,
                })
            }
        })

        socket.on("disconnect",function(){
            delete users[socket.id];
            console.log("User disconnects",users[socket.id]);
        })
        
    });

    chatServer.listen(5000,(err)=>{
        console.log("Server is running on port 5000",err);
    })

    return "Hello"
}
module.exports = chatSocket;