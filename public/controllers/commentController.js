//-----------------------------comment------------------------
// function commentArticle(event, articleId, user_id) {
// //要去服务器获得comment回传更新页面-----------------然后再展开comment区域，加载comment
// }

async function fetchAndShowComments(articleId, user_id) {
    fetch(`/get-comments/${articleId}`)
        .then(response => response.json())
        .then(async comments => {
                //------------------------------------开始重写--------
                //  foreach：（HTML='';
                // comment检查是否 parent child：
                //
                // IF
                //  HTML= function parentHTML（comment）；
                //  level 1：parent && ！child
                //  html 里包含一个 children 插入区
                //  找children，每个child 检查是否parent
                //  是function parent——childHTML（comment） -否function childHTML（comment）
                //
                //ELSE IF
                //  HTML= function parent——childHTML（comment）；
                //  level 2： parent && child ------------需要写recursion-----------------
                //  html 里包含一个 children 插入区
                //  找children，每个child recursion foreach
                //
                //ELSE IF
                //  HTML= function childHTML（comment）；
                //  level last： ！parent
                //  单独html
                //  ）

                //-----------------------------结束重写--------------
                // console.log(`comments:${comments}`)
                let commentsHtml = '';
                // let commentParentHtml='';
                // let commentCommentsHtml = '';
                let commentCommentsHtml = '';
            let newComments =[];
                for (let comment of comments) {
                    console.log(`for里面，评论ID：${comment.commentId}`);

                    //每个子评论的html
                    // console.log(`comment.comment_comment_id:${comment.comment_comment_id}`);
                    //确定是子评论：
                    if (comment.comment_comment_id != null) {
                        console.log(`父评论：${comment.comment_comment_id} 子评论ID：${comment.commentId} `);
                        const commentId = comment.comment_comment_id;

                        const commentResponse = await fetch(`/get-comment-comments/${commentId}`);
                        // -------------获得子评论们----------------
                        const commentComments = await commentResponse.json();
                        console.log(`controller收到子评论数量是：${commentComments.length}`)
                        for (const commentComment of commentComments) {
                            // 针对每个子评论的操作-----------------------------------------------
                            console.log(`开始插入子评论:${commentComment.commentId}`);

                            commentCommentsHtml += `<div class="comment_comments_div">
                        <div class="comment_head">
                            <div><img class="commenter_avatar" src="./avatar/${commentComment.avatar}.jpg">
                                <span>By:${commentComment.userName}</span></div>
                            <div>
                                
                                <button class="comment_delete_btn" onclick="deleteComment(this,${user_id},${comment.articleId})" data-comment-id="${commentComment.commentId}" ><img class="comment_delete" src="./image/delete_icon.jpg"></button>
                            </div>

                        </div>
                        <p class="comment_content">${commentComment.content}</p>
                 
                        
                    </div>`;

                        }
                    }else {
                        newComments.push(comment);

                    }
                }


                for (let comment of newComments) {
                    console.log(`开始加载评论：${comment.commentId}`);
                    console.log(`开始写评论html`);
                    commentsHtml += `<div class="comment_content_div">
                            <div class="comment_head">
                                <div><img class="commenter_avatar" src="./avatar/${comment.avatar}.jpg">
                                    <span>By:${comment.userName}</span></div>
                                    <div>
                            <button class="comment_delete_btn" data-comment-id="${comment.commentId}" onclick="deleteComment(this,${user_id},${comment.articleId})"> <img class="comment_delete" src="./image/delete_icon.jpg"></button></div>
                            </div><p class="comment_content">${comment.content}</p>
                            <div class="comment_area">
                            <input type="text" id="comment_content_${comment.commentId}" class=" input comment_content_${comment.commentId}" name="content"
                                   placeholder="Say something">
                          <button class="comment_add_btn" onclick="addChildComment(this,${user_id})" data-comment-id1="${comment.commentId}" >
                            <img src="./image/add_comment.jpg" class="add_comment" ></button>
                        </div>
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

function deleteComment(buttonElement, user_id,articleId) {
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
                if (data.isAuthor) {
                    // 用户是评论者，执行删除操作
                    fetch(`/delete-comment/${commentId}`, {
                        method: 'POST',
                    }).then(response=> response.json()) // 首先转换响应为JSON
                        .then(data  => {
                        if (data.success) {
                            alert("Comment deleted successfully.");
                            // 从页面上移除评论元素------------------------todo-----
                            // console.log(`从服务器传回的新评论总数：${data.newCommentNum}`);

                            buttonElement.closest('.comment_comments_div').remove();
                            const commentSpans = document.querySelectorAll(`.comment_${articleId}`);
                            commentSpans.forEach(commentSpan => {
                                commentSpan.textContent = ` × ${data.newCommentNum}`;
                                // console.log(data.newLikeCount);
                            })


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

function addParentComment(buttonElement, user_id){
    const articleId=buttonElement.getAttribute('data-comment-id');
    const contentValues = document.querySelectorAll(`.comment_content_${articleId}`);
    let content;
    contentValues.forEach(value=>{
        let contentValue=value.value;
        if (contentValue!=null){
            content = contentValue;
        }
    })
    // console.log(`新增评论内容：${content}`);
    fetch(`/add-parent-comment/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: user_id,
            articleId: articleId,
            content:content
        })
    }).then(response => {
        if (response.ok) {
            alert("Comment successfully submitted");
            document.querySelectorAll(`.comment_content_${articleId}`).forEach(input=>{
                input.value='';
            });

        } else {
            alert("Failed to submit the comment.");
        }
    }).catch(error => console.error('Error:', error));
}
function addChildComment(buttonElement, user_id) {
    const commentId = buttonElement.getAttribute('data-comment-id1');
    const contentValues = document.querySelectorAll(`.comment_content_${commentId}`);
    let content;
    contentValues.forEach(value=>{
        let contentValue=value.value;
        if (contentValue!=null){
            content = contentValue;
        }
    })
    // console.log(`新增评论内容：${content}`);

    fetch(`/add-child-comment/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: user_id,
            comment_comment_id: commentId,
            content:content
        })
    }).then(response => {
        if (response.ok) {
            alert("Comment successfully submitted");
            document.querySelector(`#comment_content_${commentId}`).value='';

        } else {
            alert("Failed to submit the comment.");
        }
    }).catch(error => console.error('Error:', error));


}