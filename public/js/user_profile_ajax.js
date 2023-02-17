{
    console.log("Hello User");
    $(".add-btn").on("click",function(e){
        // console.log($(this).attr("id"));
        const addBtn = $(this);
        if($(this).attr("id")=="friends"){
            console.log("Already Friends")
            addBtn.off("click");
        }
        else{
            $.ajax({
                type:"get",
                url:$(this).attr("id"),
                success:function(data){
                    addBtn.text("Friends!");
                    addBtn.off("click");
                },
                error:function(err){
                    console.log("Error",err);
                    addBtn.text("Friends!");
                    addBtn.off("click");
                }
            })
        }
    });
    
    
}