//-----------------------------------选择头像弹窗-----Select avatar popup.------------------------
function showAvatarModal() {
    let modal = document.querySelector('#avatarModal');
    modal.style.display = 'block';
}

//-------------------------------选择头像弹窗点击叉号关闭弹窗---------------------------------
//Click the cross icon to close the select avatar popup
let span = document.querySelector('.close');
span.onclick = function () {
    let modal = document.querySelector('#avatarModal');
    modal.style.display = 'none';
}


// ------------------------------------profile页面点击done返回主页----------------------------
//On the profile page, click 'Done' to return to the homepage.
document.querySelector('#done_btn').addEventListener('click', function () {
    window.location.href = '/';
})

//-------------------------------修改密码：点击修改键-出现确认键+新密码输入框，隐藏修改键----------------
//Change password: Click the change button - a confirm button and a new password input field appear, hiding the change button.
function modifyPassword(event, fieldId) {
    event.preventDefault();
    // 显示新密码和确认密码输入框Display new password and confirm password input fields
    let newPasswordDiv = document.querySelector('#newPasswordDiv');
    let newPasswordConfirmDiv = document.querySelector('#newPasswordConfirmDiv');
    newPasswordDiv.style.display = 'block';
    newPasswordConfirmDiv.style.display = 'block';

    // 清空当前密码输入框Clear the current password input field.
    let currentPasswordInput = document.querySelector(`#${fieldId}`);
    currentPasswordInput.value = '';
    let password = currentPasswordInput.value;

    // 隐藏修改按钮，显示确认按钮Hide the change button, display the confirm button.
    let modifyButton = document.querySelector('#modify_btn');
    let confirmButton = document.querySelector('#confirm_btn');
    modifyButton.style.display = 'none';
    confirmButton.style.display = 'block';
    confirmButton.disabled = true;

    document.querySelector('#password').addEventListener('input', checkPasswordInputs);
    document.querySelector('#newPassword').addEventListener('input', checkPasswordInputs);
    document.querySelector('#newPasswordConfirm').addEventListener('input', checkPasswordInputs);

    //检查密码是否全部填写Check if all password fields are filled out.
    checkPasswordInputs();
}

//----------------------------------检查密码是否全部填写---------------------------------
//Check if all password fields are filled out.
function checkPasswordInputs() {
    //选择密码内容和确认按键Select password content and confirm button.
    let currentPassword = document.querySelector('#password').value;
    let newPassword = document.querySelector('#newPassword').value;
    let newPasswordConfirm = document.querySelector('#newPasswordConfirm').value;
    let confirmButton = document.querySelector('#confirm_btn');

    // 检查所有密码输入框是否都已填写，填写完毕开启确认键
    //Check if all password input fields are filled; if completed, enable the confirm button
    if (currentPassword && newPassword && newPasswordConfirm) {
        confirmButton.disabled = false;
    } else {
        confirmButton.disabled = true;
    }
}

//-----------------------------------------修改过程（修改区域，修改内容）---Password change process----------------------------
async function editField(event, fieldId) {
    let value; //新内容 new value
    //---------------------------------获得新内容-----obtain new value-----------------------------------
    //修改头像 new avatar value
    if (fieldId === 'avatar') {
        let src = event.target.src;
        let match = src.match(/\/avatar(\d+)\.jpg$/);
        value = match ? `avatar${match[1]}` : null;

        //修改密码 new password value
    } else if (fieldId === 'password') {
        let oldPassword = document.querySelector('#password').value;
        let newPassword = document.querySelector('#newPassword').value;
        let confirmPassword = document.querySelector('#newPasswordConfirm').value;

        //verify old password
        await fetch('/verify-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({password: oldPassword}),
        })
            .then(response => response.json())
            .then(data => {
                if (data.isValid) {
                    console.log("password pass")
                    // 原始密码验证成功的处理
                    //if old password true-> compare new password & confirmed one
                    if (newPassword == confirmPassword) {
                        value = confirmPassword;

                    } else {
                        // 密码不一致 passwords do not match
                        alert("Passwords do not match.");
                    }

                } else {
                    // 原始密码错误 password is incorrect
                    console.log('Password is incorrect.');
                    // 显示错误消息 error message
                    alert("Password is incorrect.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

//修改其他内容（用户名，真实姓名，日期，简介）
// new value:username,real name, date of birth, description
    } else {
        value = document.querySelector(`#${fieldId}`).value;
    }


    // 发送更新请求到服务器
    fetchUpdateProfile(fieldId, value);
}


//-----------------------------------去服务器更新DATABASE---update database--------------------
function fetchUpdateProfile(fieldId, value) {

    //密码验证失败的情况In case of password verification failure
    if (value == undefined) {
        alert("Update failed!");
        //发送更新请求到服务器
    } else {
        fetch('/update-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({field: fieldId, value: value}),
        })

            .then(response => response.json())
            .then(data => {
                alert(data.message);
                //更新页面头像 Update the profile picture on the page.
                if (fieldId == 'avatar') {
                    completeUpdateAvatar(value);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                if (error.message === 'Username already exists') {
                    // 显示用户名已存在的消息
                    //Display a message that the username already exists
                    displayUsernameExistsMessage();
                }
            });
    }
}

//--------------用户名已存在username already exists error-----------------------------
function displayUsernameExistsMessage() {
    const error = document.querySelector('#modify_username_error');
    error.textContent = 'Username already exists';

}

//------更新profile 页面头像显示----Update the profile picture on the page----------------
function completeUpdateAvatar(value) {
    let modal = document.querySelector('#avatarModal');
    modal.style.display = 'none';
    let avatar = document.querySelector('#change_avatar');
    avatar.src = `./avatar/${value}.jpg`;
}

//-------------------------------更改生日时变更type---------------
//Change the input type when modifying the birthday."
function changeTypeToDate(inputElement) {
    inputElement.type = 'date';
}

//-------------------------删除用户----delete account -------------
function deleteAccount(event, user_id) {
//弹窗询问
    let userResponse = confirm("Are you sure you want to delete your account?");
    if (userResponse) {
        // 用户点击了"确定" 发送请求到服务器
        fetch('/delete-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({user_id: user_id}),
        })
            .then(response => response.json())
            .then(data => {
                //删除成功，重回主页 Deletion successful, return to the homepage.
                if (data.isValid == true) {
                    alert("Account has been deleted.");
                    window.location.href = '/';
                } else {
                    alert("Error occurred while deleting the account.");
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert("Error occurred while deleting the account.");
            });
    } else {
        // 用户点击了"取消"The user clicked 'Cancel'.
        console.log("User clicked No.");
    }
}
