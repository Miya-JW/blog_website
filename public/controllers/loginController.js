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