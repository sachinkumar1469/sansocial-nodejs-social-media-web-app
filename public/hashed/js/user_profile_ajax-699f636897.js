console.log("Hello User"),$(".add-btn").on("click",function(o){const t=$(this);"friends"==$(this).attr("id")?(console.log("Already Friends"),t.off("click")):$.ajax({type:"get",url:$(this).attr("id"),success:function(o){t.text("Friends!"),t.off("click")},error:function(o){console.log("Error",o),t.text("Friends!"),t.off("click")}})});