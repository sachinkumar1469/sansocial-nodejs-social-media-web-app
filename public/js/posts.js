
function dotMenuHandler(e){
    // console.log(e);
    var nextSibling = e.target.nextElementSibling;
    // console.log(nextSibling);
    nextSibling.style.display = nextSibling.style.display == "flex" ? "none" : "flex";
}

document.querySelectorAll(".three-dots")
.forEach(element=>{
    element.addEventListener("click",dotMenuHandler)

})