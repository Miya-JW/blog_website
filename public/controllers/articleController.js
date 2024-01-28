// import tinymce from 'tinymce';
// tinymce.init({
//     selector: '#myeditor',
//     plugins: 'lists link image preview', // 添加所需的插件
//     toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image', // 配置工具栏
//     // 其他配置项...
// });



function toggleContent(element){
    document.querySelectorAll('.click').forEach(function(title) {
        title.addEventListener('click', function() {
            let content = this.nextElementSibling;
            content.classList.toggle('hidden');
        });
    });
}

function sortArticles(sortBy) {
    fetch(`/sort-articles?sortBy=${sortBy}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateArticles(data.articles);
        })
        .catch(error => console.error('Error:', error));
}


function updateArticles(articles) {
    const articlesContainer = document.querySelector('.showArticles');
    articlesContainer.innerHTML = '';

    articles.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('article');

        articleDiv.innerHTML = `
            <h2 class="click" onclick="toggleContent(this)">${article.title}</h2>
            <p class="article_content hidden">${article.content}</p>
            <p>By: ${article.author_name}</p>
            <button class="heart_btn"><img class="heart" src="./image/heart.jpg"></button>
            <span> × ${article.likes}</span>
            <p>${new Date(article.date).toLocaleDateString()}</p>
        `;

        articlesContainer.appendChild(articleDiv);
    });
}

