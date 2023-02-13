const allViewCommentEl = document.querySelectorAll(".view-comments");

function showCommentHandler(e){
    e.target.classList.toggle("active");
    var panel = e.target.nextElementSibling;
    if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
    } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
    } 
}

allViewCommentEl.forEach(el=>{
    el.addEventListener("click",showCommentHandler);
})