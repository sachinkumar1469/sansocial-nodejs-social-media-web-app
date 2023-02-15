const Queue = require("../config/kue");

const {newComment} = require("../mailers/comment-mailer");

Queue.process("email",(job,done)=>{
    // console.log("Emails worker is runnig and proccessing a job",job.data);
    newComment(job.data);
    done();
})