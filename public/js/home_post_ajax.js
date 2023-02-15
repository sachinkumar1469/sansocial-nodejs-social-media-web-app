{
    // Method to submit the form data using ajax
    const createPost = function(){
        const newPostForm = $("#newPostForm");
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type:"POST",
                url:"/post/create",
                data:newPostForm.serialize(),
                success:function(resData){
                    $("#newPostForm input").val("");
                    $(".post-input").val("");
                    const posts = $(".posts");
                    const newPost = addPostToDom(resData);
                    posts.prepend(newPost);
                    deletePost(newPost.find(".delete-post"));
                    newPost.find(".like-btn").click(onLikeToggle);
                    // addListenerOnAllLikes();
                    new Noty({
                      theme:"relax",
                      type: 'success',
                      layout: 'topRight',
                      text: "Post Added",
                      timeout:2000
                    }).show();
                },
                error:function(err){
                    console.log("ERROR",err.responseText);
                }
            })
            console.log("Form submitted");
        });
    }
    createPost();

    // Create a new method to add post in dom
    function addPostToDom(resData){
      const post = resData.post;
      const user = resData.user;
      const newPost = $(`
        <div class="post" id="post-${post._id}">
          <div class="names">
              <span class="name">${user.name}</span>
              <a class="username" href="/user/profile/${user.username}">@${user.username}</a>
              <div class="menu-dots" >
                  <svg class="three-dots" onclick="dotMenuHandler(event)" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                  <div class="menu-items">
                      <a class="delete-post" href="/post/delete/${post._id}">Delete Post</a>
                      <a>Edit Post</a>
                  </div>
              </div>
          </div>
          <div class="content">
              ${post.content}
          </div>
          <div class="icons">
              <div class="comment">
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path fill="none" d="M0 0h24v24H0V0z"></path><path d="M20 17.17L18.83 16H4V4h16v13.17zM20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z"></path>
                  </svg>
              </div>
              <div class="retweet">
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M136 552h63.6c4.4 0 8-3.6 8-8V288.7h528.6v72.6c0 1.9.6 3.7 1.8 5.2a8.3 8.3 0 0 0 11.7 1.4L893 255.4c4.3-5 3.6-10.3 0-13.2L749.7 129.8a8.22 8.22 0 0 0-5.2-1.8c-4.6 0-8.4 3.8-8.4 8.4V209H199.7c-39.5 0-71.7 32.2-71.7 71.8V544c0 4.4 3.6 8 8 8zm752-80h-63.6c-4.4 0-8 3.6-8 8v255.3H287.8v-72.6c0-1.9-.6-3.7-1.8-5.2a8.3 8.3 0 0 0-11.7-1.4L131 768.6c-4.3 5-3.6 10.3 0 13.2l143.3 112.4c1.5 1.2 3.3 1.8 5.2 1.8 4.6 0 8.4-3.8 8.4-8.4V815h536.6c39.5 0 71.7-32.2 71.7-71.8V480c-.2-4.4-3.8-8-8.2-8z"></path>
                  </svg>
              </div>
              <div class="like">
                <span class="like-count">0</span>
                <svg  id="/like/toggle/?id=${post._id}&type=post" class="like-btn" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"></path>
                </svg>
              </div>
          </div>
          <form class="add-comment" action="/comment/create" method="post">
              <input type="hidden" name="post" value="${post._id}">
              <input type="text" name="content" id="" placeholder="Add Comment">
              <button type="submit">Add Comments</button>
          </form>
          <div class="comments">
              <div class="view-comments" onclick="showCommentHandler(event)">View Comments</div>
              <div class="comments-list">
              </div>
          </div>
        </div>
      `);
      return newPost;
    }

    // Delete Post
    function deletePost(deleteLink){
      $(deleteLink).click(function(e){
        // console.log("clicked");
        // console.log(deleteLink);
        e.preventDefault();

        $.ajax({
          type:'get',
          url:deleteLink.prop("href"),
          success:function(data){
            // console.log(data);
            $(`#post-${data.postId}`).remove();
            new Noty({
              theme:"relax",
              type: 'warning',
              layout: 'topRight',
              text: "Post Deleted",
              timeout:2000
            }).show();
          },
          error:function(err){
            console.log(err);
          }
        })
      })
    }

    // Event listener on all the preloaded posts delete buttons
    $('.post .delete-post').each(function(){
      deletePost($(this))
    })

    // Create comment
    function createComment(){
      $(".post .add-comment").each(function(){
        $(this).submit(function(e){
          e.preventDefault();
          console.log("comment submit clicked");

          $.ajax({
            type:"post",
            url:"/comment/create",
            data:$(this).serialize(),
            success:(resData)=>{
              console.log("data",resData);
              const newComment = addCommentToDom(resData);
              const commentListEl =  $(this).siblings().find(".comments-list");
              commentListEl.prepend(newComment);
              let scrollHeight = commentListEl.prop('scrollHeight');
              commentListEl.css('max-height', `${scrollHeight}px`);
              $(this).siblings().find(".view-comments").addClass("active");
              new Noty({
                theme:"relax",
                type: 'success',
                layout: 'topRight',
                text: "Comment Added",
                timeout:2000
              }).show();
              // console.log();
            },
            error:function(err){
              console.log("err",err);
            }
          })
        })
      })
    }
    createComment();

    // Add comment to the dome
    function addCommentToDom(resData){
      const {comment,user} = resData;
        const newComment = $(`
                <div class="comment">
                    <div class="comment-details">
                        <div class="comment-user">${user.name} <span class="comment-username">@${user.username}</span></div>
                        <div class="comment-content">
                            ${comment.content}
                        </div>
                    </div>
                    <div class="comment-delete">
                        <a href="/comment/delete/${comment._id}">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                        </a>
                    </div>
                </div>
          `);

        return newComment;
    }
    // Delete comment

    // Remove the comment from the dom

    // Toogle Like Button
    function onLikeToggle(e){
      console.log($(this));
      console.log("Clicked",$(this).attr("id"));
      const id = $(this).attr("id");
      $(this).toggleClass("active-btn");
      $.ajax({
        type:"get",
        url:id,
        success:function(data){
          console.log("data",data)
          let likeCount = $(this).find(".like-count")
          console.log(likeCount);
        },
        error:function(err){
          console.log("err",err); a
        }
      })
    }

    function addListenerOnAllLikes(){
      $(".like-btn").on("click",onLikeToggle);
      
    };
    addListenerOnAllLikes();
}