const allViewCommentEl = document.querySelectorAll(".view-comments");

allViewCommentEl.forEach(el=>{
    el.addEventListener("click",function(e){
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
        } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
        } 
    })
})