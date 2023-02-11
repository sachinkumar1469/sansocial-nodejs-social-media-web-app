
document.querySelectorAll(".three-dots")
.forEach(element=>{

    element.addEventListener("click",function(e){
        var nextSibling = this.nextSibling;
    while (nextSibling && nextSibling.nodeType != 1) {
        nextSibling = nextSibling.nextSibling;
    }
    console.log(nextSibling);
    nextSibling.style.display = nextSibling.style.display == "flex" ? "none" : "flex";
    })

})