// const socket = io();

class chatEngine{
    constructor(chatBoxId,from,to){
        this.chatBoxId=$(`${chatBoxId}`);
        this.from = from;
        this.to = to;
        this.socket = io.connect("http://103.4.14.176:5000",{
            query:{
                userName:from
            }
        });
        this.connectionHandler();
    };

    connectionHandler(){
        this.socket.on("connect",(data)=>{
            // console.log(this.userName);
            this.createRoom();
            console.log("Connection est.",data);
        });
    };

    createRoom(){
        console.log("Creating Room");
        this.socket.emit("create-room",{
            from:this.from,
            to:this.to
        });
    }

}

let from = $(".chat-send").attr("data-sender");
let to = $(".chat-send").attr("data-receiver");

const chatEng = new chatEngine("chat",from,to);

$(".chat-send").on("click",function(e){
    console.log("Send Msg Clicked");
    const inputEl = $(".chat-msg");
    if(inputEl.val().length <= 0){
        console.log("Empty");
        return;
    }
    // const from = $(this).attr("data-sender");
    // console.log(to,from);
    chatEng.socket.emit("send-message",{
        to,
        message:inputEl.val()
    })
    inputEl.val("");

    // socket.emit('chat', { from:"Sachin", to:"Mehak", message:"How are you?" });
})

chatEng.socket.on("get-message",(data)=>{
    console.log("Get message event is triggered by the server to emit the data to all the clients",data)

    let newMst = $(`<div class="chat ${data.sender == from ? "self" : "other"}">
        ${data.message}
    </div>`)
    $(".chats").append(newMst);
})