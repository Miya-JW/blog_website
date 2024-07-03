//------------------create article---------------------
document
  .querySelector("#create_article_btn")
  .addEventListener("click", function () {
    let articleModal = document.querySelector("#articleModal");
    if (
      articleModal.style.display === "none" ||
      articleModal.style.display === ""
    ) {
      articleModal.style.display = "block";
    } else {
      articleModal.style.display = "none";
    }
  });

// ----------------- adding new article-----
document.querySelector("#submitArticle").addEventListener("click", function () {
  const content = tinymce.get("myeditor").getContent({ format: "text" });
  const user_id = document.querySelector("#submitArticle").value;
  const title = document.querySelector("#new_article_title").value;
  fetch("/create-new-article", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: content,
      user_id: user_id,
      title: title,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);

      alert(`Article <${data.newArticle.title}>saved successfully!`);
      const article = data.newArticle;

      let user_articles = document.querySelector(".user_articles");
      //  Create a new element to place the articles.
      let new_article = document.createElement("div");

      // ----------------Set the content for the new article.-------------------

      new_article.innerHTML = ` <div class="article">
      <h2 class="click" onclick="toggleContent(this)"> 
      <button class="article_edit_btn" title="Edit Article" data-article-id="${article.articleId}">
        <img src="./image/edit.jpg" class="edit_article"></button>${article.title}</h2>
             
        <p>Cooked up in my brain kitchen!</p>
        <p class="small_font">${article.date}</p>

        <p class="article_content hidden">${article.content}</p>
             
        <div class="buttons">
        <button class="heart_btn" title="Like" onclick="likeArticle(event,${article.articleId},${user_id})">
        <img class="heart" src="./image/heart.jpg">
        <span class="like_${article.articleId}"> × ${article.likes}</span></button>

             <!-- ----------------------------comment button-->
             <button class="comment_btn" title="Comment" onclick="fetchAndShowComments(${article.articleId},${user_id})">
             <img class="comment" src="./image/comment_icon.jpg"></button>
             <button class="delete_btn" title="Delete comment" data-article-id="${article.articleId}" onclick="deleteArticle(this,${user_id})" >
             <img class="delete" src="./image/delete_icon.jpg"></button>
             </div>
                        
             <div class="comment_area">
             <input type="text" id="comment_{{article.articleId}}" class=" input" name="content" placeholder="Say something">
               <button class="comment_add_btn" title="Comment" onclick="addParentComment(this,${user_id})" data-comment-id="{{article.articleId}}">
               <img src="./image/add_comment.jpg" class="add_comment"></button>
             </div>
             
             <div class="comments">
             <div class="comment_insert_area_${article.articleId}"></div>
             </div>
             
             </div>`;

      // Add the new article to the front of the container.

      if (user_articles.firstChild) {
        user_articles.insertBefore(new_article, user_articles.firstChild);
      } else {
        user_articles.appendChild(new_article);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

//---------------------------edit article-----------------------

//  Add a click event listener to the edit button.
document.querySelectorAll(".article_edit_btn").forEach((button) => {
  button.addEventListener("click", function () {
    const articleId = this.getAttribute("data-article-id");
    fetchArticleAndShowModal(articleId);
  });
});

function fetchArticleAndShowModal(articleId) {
  fetch(`/get-article-by-articleId?articleId=${articleId}`)
    .then((response) => response.json())
    .then((article) => {
      showModalWithArticle(article);
    })
    .catch((error) => console.error("Error fetching article:", error));
}

function showModalWithArticle(article) {
  let modal = document.querySelector("#editArticleModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "editArticleModal";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
        <div class="modal-content">
         <span class="close">&times;</span>
            <div class="writer">
                <div id="articleModal_window">
                    <input type="text" id="editedArticleTitle" placeholder="Enter title here" value="${article.title}">
                    <textarea id="editedArticleContent">${article.content}</textarea>
                    <button title="Submit Article" id="submitEditedArticle">Launch Your Story</button>
                </div>
            </div>
           
        </div>`;

  modal.style.display = "block";

  document.querySelector(".close").addEventListener("click", function () {
    modal.style.display = "none";
  });

  document
    .querySelector("#submitEditedArticle")
    .addEventListener("click", function () {
      const updatedTitle = document.querySelector("#editedArticleTitle").value;
      const updatedContent = document.querySelector(
        "#editedArticleContent"
      ).value;
      updateArticle(article.articleId, updatedTitle, updatedContent);
    });
}

function updateArticle(articleId, title, content) {
  fetch("/update-article", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ articleId, title, content }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Article updated successfully");
      // update article-------------------
      document.querySelector("#editArticleModal").style.display = "none";
    })
    .catch((error) => console.error("Error updating article:", error));
}

//--------------Click on the title to show/collapse the article content.-----
function toggleContent(element) {
  document.querySelectorAll(".click").forEach(function (title) {
    title.addEventListener("click", function () {
      let content =
        this.nextElementSibling.nextElementSibling.nextElementSibling;
      content.classList.toggle("hidden");
    });
  });
}

//--------------------Delete article.-------------------
function deleteArticle(buttonElement, user_id) {
  const articleId = buttonElement.getAttribute("data-article-id");
  fetch(`/check-if-author`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: user_id,
      articleId: articleId,
    }),
  })
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          if (data.isAuthor) {
            //  If the user is the author, execute the deletion operation.
            fetch(`/delete-article/${articleId}`, {
              method: "POST",
            })
              .then((response) => {
                if (response.ok) {
                  alert("Article deleted successfully.");
                  //
                  buttonElement.closest(".article").remove();
                } else {
                  alert("Failed to delete the article.");
                }
              })
              .catch((error) => console.error("Error:", error));
          } else {
            //  If the user is not the author, deletion is not allowed.
            window.alert("You are not the author!");
          }
        });
      } else {
        
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//------------------------------------Article sorting.---------------------------------
function sortArticles(sortBy, user_id) {
  fetch(`/sort-articles?sortBy=${sortBy}`)
    .then((response) => response.json())
    .then((data) => {
      updateArticles(data.articles, user_id);
    })
    .catch((error) => console.error("Error:", error));
}

//--------------------Sorting complete, refresh the page.
function updateArticles(articles, user_id) {
  const articlesContainer = document.querySelector(".showArticles");
  articlesContainer.innerHTML = "";


  articles.forEach((article) => {
    const articleDiv = document.createElement("div");
    articleDiv.classList.add("article");
    articleDiv.innerHTML = ` <h2 class="click" onclick="toggleContent(this)"> ${article.title}</h2>
             <p>  <em>${article.author_name}</em>  </p>
             <p class="small_font">${article.date}</p>
             <p class="article_content hidden">${article.content}</p>
             
             <div class="buttons">
             <button class="heart_btn" title="Like" onclick="likeArticle(event,${article.articleId},${user_id})">
             <img class="heart" src="./image/heart.jpg">
             <span class="like_${article.articleId}"> × ${article.likes}</span></button>

             <!-- ----------------------------comment button-->
             <button class="comment_btn" title="Comment" onclick="fetchAndShowComments(${article.articleId},${user_id})">
             <img class="comment" src="./image/comment_icon.jpg"></button>
             <button class="delete_btn" title="Delete comment" data-article-id="${article.articleId}" onclick="deleteArticle(this,${user_id})" ><img class="delete" src="./image/delete_icon.jpg"></button>
             </div>
                        
             <div class="comment_area">
             <input type="text" id="comment_{{article.articleId}}" class=" input" name="content" placeholder="Say something">
               <button class="comment_add_btn" title="Comment" onclick="addParentComment(this,${user_id})"
                                    data-comment-id="{{article.articleId}}">
                                <img src="./image/add_comment.jpg" class="add_comment"></button>
             </div>
             
             <div class="comments">
             <div class="comment_insert_area_${article.articleId}"></div>
             </div>
             
             `;

    articlesContainer.appendChild(articleDiv);
  });
}

//-------------------------------like-------------------------------
function likeArticle(event, articleId, user_id) {
  event.preventDefault();
  fetch("/like-article", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ articleId: articleId, userId: user_id }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // update likes
        const likeSpans = document.querySelectorAll(`.like_${articleId}`);
        likeSpans.forEach((likeSpan) => {
          likeSpan.textContent = ` × ${data.newLikeCount}`;
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
