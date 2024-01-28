window.onload = function () {

    let forms = document.querySelectorAll(".form");
    forms.forEach(form => {
        form.reset();
    })

    const urlParams = new URLSearchParams(window.location.search);
    const showForm = urlParams.get('show');
    const message = urlParams.get('message');

    if (showForm === 'register') {
        showRegisterForm();
    }
    let login = document.querySelector("#login");
    let register = document.querySelector("#register");
    let form_box = document.querySelector(".form-box");
    let register_box = document.querySelector(".register-box");
    let login_box = document.querySelector(".login-box");

    register.addEventListener('click', () => {
        form_box.style.transform = 'translateX(80%)';
        login_box.classList.add('hidden');
        register_box.classList.remove('hidden');
    })

    login.addEventListener('click', () => {
        form_box.style.transform = 'translateX(0%)';
        register_box.classList.add('hidden');
        login_box.classList.remove('hidden');
    })
};

function showRegisterForm() {
    let form_box = document.querySelector(".form-box");
    let login_box = document.querySelector(".login-box");
    let register_box = document.querySelector(".register-box");
    form_box.style.transform = 'translateX(80%)';
    login_box.classList.add('hidden');
    register_box.classList.remove('hidden');
}

function checkUsername() {
    let username = document.querySelector("#user_username").value;
    fetch('/check-username?username=' + username)
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                document.querySelector("#username_error").textContent = "Username already taken.";
            } else {
                document.querySelector("#username_error").textContent = "";
            }
        });
    updateSubmitButtonState();
}

function checkPassword() {
    let password = document.querySelector("#user_password").value;
    let confirmPassword = document.querySelector("#user_password_repeat").value;
    if (password != confirmPassword) {
        document.querySelector("#password_error").textContent = "Passwords do not match.";
    } else {
        document.querySelector("#password_error").textContent = "";
    }
    updateSubmitButtonState();
}


function updateSubmitButtonState() {
    let username = document.querySelector("#user_username").value;
    let password = document.querySelector("#user_password").value;
    let confirmPassword = document.querySelector("#user_password_repeat").value;

    let usernameError = document.querySelector("#username_error").textContent;
    let passwordError = document.querySelector("#password_error").textContent;

    let isUsernameValid = !usernameError && username;
    let isPasswordValid = !passwordError && password && confirmPassword && (password === confirmPassword);

    document.querySelector("#submit_button").disabled = !(isUsernameValid && isPasswordValid);
}



