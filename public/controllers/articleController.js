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

//---------------------------------文章排序 ------------------------------------
function sortArticles(sortBy) {
    fetch(`/sort-articles?sortBy=${sortBy}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateArticles(data.articles);
        })
        .catch(error => console.error('Error:', error));
}

//--------------------排序完成 更新页面 todo--------------还没写好-----------------------
function updateArticles(articles) {
    const articlesContainer = document.querySelector('.showArticles');
    articlesContainer.innerHTML = '';
    // console.log(articles);

    articles.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('article');
        articleDiv.innerHTML =
            `
            <h2 class="click" onclick="toggleContent(this)">${article.title}</h2>
            <p>By: <em>${article.author_name}</em></p>
            <p class="small_font">{article.date}</p>

            <p class="article_content hidden">${article.content}</p>

            <button class="heart_btn"><img class="heart" src="./image/heart.jpg"></button>
            <span> × ${article.likes}</span>
        `;

        articlesContainer.appendChild(articleDiv);
    });
}

// <p>${new Date(article.date).toLocaleDateString()}</p>

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
                  console.log(data.newLikeCount);
              })

            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


