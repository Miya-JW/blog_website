//-----------------------------load comments------------------------

function organizeComments(comments,user_id) {
    const commentsMap = {};
    comments.forEach(comment => {
        commentsMap[comment.commentId] = { ...comment, children: [] };
    });
    const rootComments = [];
    comments.forEach(comment => {
        if (comment.comment_comment_id) {
            commentsMap[comment.comment_comment_id].children.push(commentsMap[comment.commentId]);
        } else {
            rootComments.push(commentsMap[comment.commentId]);
        }
    });
    return rootComments;
}

function renderComments(comments, container,user_id) {
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment_comments_div');
        commentElement.innerHTML = `
       
            <div class="comment_content_div">
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
                             </div>
        `;
        container.appendChild(commentElement);

        if (comment.children.length > 0) {
            const childrenContainer = document.createElement('div');
            childrenContainer.classList.add('children-comments');
            commentElement.appendChild(childrenContainer);
            renderComments(comment.children, childrenContainer,user_id);
        }
    });
}

async function fetchAndShowComments(articleId,user_id) {
    const commentsContainers = document.querySelectorAll(`.comment_insert_area_${articleId}`);
    commentsContainers.forEach(commentsContainer=>{
        fetch(`/get-comments/${articleId}`)
            .then(response => response.json())
            .then(comments => {
                commentsContainer.innerHTML = '';
                const organizedComments = organizeComments(comments,user_id);
                renderComments(organizedComments, commentsContainer,user_id);
            })
            .catch(error => console.error('Error fetching comments:', error));
    })

}

// ---------------------------------delete comment--------------------------------------
function deleteComment(buttonElement, user_id,articleId) {
    const commentId = buttonElement.getAttribute('data-comment-id');
    console.log(`删除评论时获得的评论ID：${commentId} 用户ID：${user_id}`);
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

// ---------------------------------create comment--------------------------------------
function addParentComment(buttonElement, user_id){
    const articleId=buttonElement.getAttribute('data-comment-id');
    const contentValues = document.querySelectorAll(`.comment_content_${articleId}`);
    let content;
    contentValues.forEach(value=>{

        let contentValue=value.value;
        console.log(`每个input的value是：${contentValue}`);
        if (contentValue){
            content = contentValue;
        }
    })
    console.log(`新增评论内容：${content}`);
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
    console.log(`增加子评论时的评论ID是${commentId}`);
    const contentValues = document.querySelectorAll(`.comment_content_${commentId}`);
    let content;
    contentValues.forEach(value=>{
        let contentValue=value.value;
        if (contentValue){
            content = contentValue;
        }
    })
    console.log(`新增评论内容：${content}`);

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