//-----------------------------comment------------------------
function commentArticle(event, articleId, user_id){
//要去服务器获得comment回传更新页面-----------------然后再展开comment区域，加载comment
}

function fetchAndShowComments(articleId) {
    fetch(`/get-comments/${articleId}`)
        .then(response => response.json())
        .then(comments => {
            console.log(`comments:${comments}`)
            let commentsHtml = '';
            for (const comment of comments) {
                console.log(comment)
                commentsHtml += `<div class="comment_content_div">

                            <div class="comment_head">
                                <div><img class="commenter_avatar" src="./avatar/${comment.avatar}.jpg">
                                    <span>By:${comment.userName}</span></div>
                                    <div>
                                        <button class="comment_reply_btn"><img src="./image/reply.jpg" class="reply">
                            </button>
                            <button class="comment_delete_btn"><img class="comment_delete"
                                                                    src="./image/delete_icon.jpg"></button>
                            </div>
                            </div>

                        
                        
                        <p class="comment_content">${comment.content}</p>
                        </div>`;
            }

            const commentsContainers = document.querySelectorAll(`.comment_insert_area_${articleId}`);
            commentsContainers.forEach(commentsContainer=>{
                commentsContainer.innerHTML = commentsHtml;
            })

        })
        .catch(error => console.error('Error:', error));
}
