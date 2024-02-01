//-----------------------------comment------------------------
function commentArticle(event, articleId, user_id) {
//要去服务器获得comment回传更新页面-----------------然后再展开comment区域，加载comment
}

async function fetchAndShowComments(articleId,user_id) {
    fetch(`/get-comments/${articleId}`)
        .then(response => response.json())
        .then(async comments => {
                // console.log(`comments:${comments}`)
                let commentsHtml = '';
                let commentParentHtml='';
                // let commentCommentsHtml = '';
                for (const comment of comments) {
                    // 确定评论下有没有子评论---------todo 两层评论还没做-----------------------------------------------------------
                    // const response = await fetch(`/check-parent-comment/${comment.commentId}`);
                    // const isParentComment = await response.json();
                    // //如果有子评论------------------
                    // if (isParentComment){
                    //
                    // }else {
                    //
                    // }

                    // 如果评论中comment_comment_id，说明有评论中的评论，需要显示，先从路由读取子评论
                    console.log(`开始加载评论`);
                    let commentCommentsHtml = '';

                    if (comment.comment_comment_id != null) {
                        console.log(`评论中的评论：${comment.comment_comment_id} 评论ID：${comment.commentId} `);
                        const commentId = comment.comment_comment_id;

                        const commentResponse = await fetch(`/get-comment-comments/${commentId}`);
                        // -----------------------------
                        const commentComments = await commentResponse.json();
                        console.log(`controller收到json的第一个是：${commentComments[0]}`)

                        for (const commentComment of commentComments) {
                            // 针对每个子评论的操作-----------------------------------------------
                            console.log(`开始插入评论中的评论`);

                            commentCommentsHtml += `<div class="comment_comments_div">
                        <div class="comment_head">
                            <div><img class="commenter_avatar" src="./avatar/${commentComment.avatar}.jpg">
                                <span>By:${commentComment.userName}</span></div>
                            <div>
                                <button class="comment_reply_btn"><img src="./image/reply.jpg" class="reply">
                                </button>
                                <button class="comment_delete_btn" onclick="deleteComment(this,${user_id})" data-comment-id="${commentComment.commentId}" ><img class="comment_delete" src="./image/delete_icon.jpg"></button>
                            </div>

                        </div>
                        <p class="comment_content">${commentComment.content}</p>
                        <div class="comment_area">
                            <input type="text" id="comment_${commentComment.articleId}" class=" input" name="content"
                                   placeholder="Say something">
                            <img src="./image/add_comment.jpg" class="add_comment">
                        </div>
                        <div class="comment_insert_area_${commentComment.commentId}"></div>
                    </div>`;

                        }
                    }
                    console.log(`开始写评论html`);
                    commentsHtml += `<div class="comment_content_div">
                            <div class="comment_head">
                                <div><img class="commenter_avatar" src="./avatar/${comment.avatar}.jpg">
                                    <span>By:${comment.userName}</span></div>
                                    <div><button class="comment_reply_btn"><img src="./image/reply.jpg" class="reply"></button>
                            <button class="comment_delete_btn" data-comment-id="${comment.commentId}" onclick="deleteComment(this,${user_id})"> <img class="comment_delete" src="./image/delete_icon.jpg"></button></div>
                            </div><p class="comment_content">${comment.content}</p>
                            <div class="comment_insert_area_${comment.articleId}">${commentCommentsHtml}</div></div>`;
                }

                const commentsContainers = document.querySelectorAll(`.comment_insert_area_${articleId}`);
                commentsContainers.forEach(commentsContainer => {
                    commentsContainer.innerHTML = commentsHtml;
                    console.log(`评论已插入`);
                })
            }
        ).catch(error => console.error('Error:', error));
}

function deleteComment(buttonElement,user_id){
    const commentId = buttonElement.getAttribute('data-comment-id');
    fetch(`/check-if-commenter`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: user_id,
            commentId: commentId
        })
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {
                if(data.isAuthor) {
                    // 用户是评论者，执行删除操作
                    fetch(`/delete-comment/${commentId}`, {
                        method: 'POST',
                    }).then(response => {
                        if (response.ok) {
                            alert("Comment deleted successfully.");
                            // 从页面上移除评论元素------------------------todo-----更新评论数字----------

                            buttonElement.closest('.comment_comments_div').remove();
                        } else {
                            alert("Failed to delete the comment.");
                        }
                    }).catch(error => console.error('Error:', error));
                } else {
                    // 用户不是作者，不允许删除
                    window.alert('You are not the commenter!');
                }
            });
        } else {
            // 处理响应不成功的情况
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}