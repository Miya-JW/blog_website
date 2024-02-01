// import tinymce from 'tinymce';
// tinymce.init({
//     selector: '#myeditor',
//     plugins: 'lists link image preview', // 添加所需的插件
//     toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image', // 配置工具栏
//     // 其他配置项...
// });


//-----------------------------------点击标题显示/折叠文章内容-----------------------------------
function toggleContent(element){
    document.querySelectorAll('.click').forEach(function(title) {
        title.addEventListener('click', function() {
            let content = this.nextElementSibling.nextElementSibling.nextElementSibling;
            content.classList.toggle('hidden');
        });
    });
}

//---------------------------------删除文章--------------------------------------
function deleteArticle(buttonElement,user_id){
    const articleId = buttonElement.getAttribute('data-article-id');
    fetch(`/check-if-author`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: user_id,
            articleId: articleId
        })
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {
                if(data.isAuthor) {
                    // 用户是作者，执行删除操作
                    fetch(`/delete-article/${articleId}`, {
                        method: 'POST',
                    }).then(response => {
                        if (response.ok) {
                            alert("Article deleted successfully.");
                            // 从页面上移除文章元素------------------------todo----删除用户文章部分的文章-----------
                            buttonElement.closest('.article').remove();
                        } else {
                            alert("Failed to delete the article.");
                        }
                    }).catch(error => console.error('Error:', error));
                } else {
                    // 用户不是作者，不允许删除
                    window.alert('You are not the author!');
                }
            });
        } else {
            // 处理响应不成功的情况
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}








//---------------------------------文章排序 ------------------------------------
function sortArticles(sortBy,user_id) {
    fetch(`/sort-articles?sortBy=${sortBy}`)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            updateArticles(data.articles,user_id);
        })
        .catch(error => console.error('Error:', error));
}

//--------------------排序完成 更新页面 todo--------------还没写好-----------------------
function updateArticles(articles,user_id) {
    const articlesContainer = document.querySelector('.showArticles');
    articlesContainer.innerHTML = '';
    // console.log(articles);

    articles.forEach(article => {
        console.log(`排序文章是：${article.title},${article.articleId}`);
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('article');
        articleDiv.innerHTML =
            `<h2 class="click" onclick="toggleContent(this)">${article.title}</h2>
             <p>By: <em>${article.author_name}</em></p>
             <p class="small_font">${article.date}</p>

             <p class="article_content hidden">${article.content}</p>
             
             <div class="buttons">
             <button class="heart_btn" onclick="likeArticle(event,${article.articleId},${user_id})">
             <img class="heart" src="./image/heart.jpg">
             <span class="like_${article.articleId}"> × ${article.likes}</span></button>

             <!-- ----------------------------comment button-->
             <button class="comment_btn" onclick="fetchAndShowComments(${article.articleId},${user_id})">
             <img class="comment" src="./image/comment_icon.jpg"><span> × ${article.comments}</span></button>
             <button class="delete_btn" data-article-id="${article.articleId}" onclick="deleteArticle(this,${user_id})" ><img class="delete" src="./image/delete_icon.jpg"></button>
             </div>
                        
             <div class="comment_area">
             <input type="text" id="comment_{{article.articleId}}" class=" input" name="content" placeholder="Say something">
             </div>
             
             <div class="comments">
             <div class="comment_insert_area_${article.articleId}"></div>
             </div>
             
             </div>`;

        articlesContainer.appendChild(articleDiv);
    });
}



//-------------------------------like-------------------------------
function likeArticle(event, articleId, user_id) {
    event.preventDefault();
    // console.log(articleId,user_id);
    fetch('/like-article', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleId: articleId, userId: user_id })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 更新点赞计数
                const likeSpans = document.querySelectorAll(`.like_${articleId}`);
              likeSpans.forEach(likeSpan=>{
                  likeSpan.textContent = ` × ${data.newLikeCount}`;
                  // console.log(data.newLikeCount);
              })

            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


