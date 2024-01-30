function showAvatarModal() {
    let modal = document.querySelector('#avatarModal');
    modal.style.display = 'block';
}
let span = document.querySelector('.close');
span.onclick = function() {
    let modal = document.querySelector('#avatarModal');
    modal.style.display = 'none';
}


function editField(event,fieldId) {
    let value;
    if (fieldId==='avatar'){
        let src = event.target.src;
        let match = src.match(/\/avatar(\d+)\.jpg$/);
        value = match ? `avatar${match[1]}` : null;
    }

    else {
        value = document.querySelector(`#${fieldId}`).value;
    }

    console.log(value);
    // 发送更新请求到服务器
    fetch('/update-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field: fieldId, value: value }),
    })

        .then(response =>{
            response.text().then(text=>console.log(text));
        })
        .then(data => {
            console.log('Success:', data);
            const successIndicator = document.querySelector(`#success_${fieldId}`);
            successIndicator.style.display = 'inline';
            successIndicator.style.opacity = 1;
            successIndicator.style.animation = 'none';
            successIndicator.innerHTML = '&#10003;';

            if (fieldId=='avatar'){
                completeUpdateAvatar(value);
            }

            // 设置几秒后消失
            setTimeout(() => {
                successIndicator.style.animation = 'fadeOut 1s ease-out forwards';
                successIndicator.innerHTML='';
            }, 2000);
        })
        .catch((error) => {
            console.error('Error:', error);
            if (error.message === 'Username already exists') {
                // 显示用户名已存在的消息
                displayUsernameExistsMessage();
            }
        });
}

function displayUsernameExistsMessage(){
const error= document.querySelector('#modify_username_error');
error.textContent='Username already exists';

}

function completeUpdateAvatar(value){
    let modal = document.querySelector('#avatarModal');
    modal.style.display = 'none';
    let avatar = document.querySelector('#change_avatar');
    avatar.src=`./avatar/${value}.jpg`;
}

function  completeUpdateDescription(value){
    document.querySelector('#description-input').value=value;
}