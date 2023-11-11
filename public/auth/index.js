const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
let btn_login = document.querySelector('#btn_login');
let login_email = document.querySelector('#login_email');
let login_pass = document.querySelector('#login_pass');
let userInfo = JSON.parse(localStorage.getItem('user'));
let Login_username = document.querySelector('#Login_username');
let Signin_username = document.querySelector('#Signin_username');
let signin_email = document.querySelector('#signin_email');
let signin_pass = document.querySelector('#signin_pass');
let signin_pass_confirm = document.querySelector('#signin_pass_confirm');
let btn_singin = document.querySelector('#btn_singin');
let url = 'http://localhost:3000/';
toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-left",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

signupBtn.onclick = (() => {
    loginForm.style.marginLeft = "-50%";
    loginText.style.marginLeft = "-50%";
});
loginBtn.onclick = (() => {
    loginForm.style.marginLeft = "0%";
    loginText.style.marginLeft = "0%";
});
signupLink.onclick = (() => {
    signupBtn.click();
    return false;
});

function authRedirectPanel() {
    let auth = userInfo
    if (auth) {
        fetch(`${url}/public/users/validate/`, {
            method: 'POST',
            body: JSON.stringify(userInfo)
        }).then(res => res.json())
            .then(go => {
                if (go) {
                    if (userInfo.type == '1') {
                        location.href = '../panel_admin/home/home.html';
                    } else if (userInfo.type == '0') {
                        location.href = '../panel_user/home/home.html';
                    }
                }
            })
    }
}

window.addEventListener('DOMContentLoaded', () => {
    authRedirectPanel();
});

btn_singin.addEventListener('click', (e) => {
    e.preventDefault();
    if (signin_pass.value == signin_pass_confirm.value) {
        let infoUser = {
            username: Signin_username.value,
            email: signin_email.value
        }
        fetch(`${url}api/users/yuniq-info/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(infoUser)
        }).then(res => res.text())
            .then(res => {
                if (res == 'repeat') {
                    toastr.error('ایمیل یا نام کاربری قبلا ثبت شده');
                } else {
                    let newUser = {
                        name: 'empty',
                        family: 'empty',
                        username: Signin_username.value,
                        password: signin_pass.value,
                        email: signin_email.value,
                        wallet: '0',
                        status: 'active',
                        bio: 'empty'
                    }

                    fetch(`${url}api/users/signin/`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newUser)
                    }).then(res => res.text()).then(go => {
                        toastr.success("ثبت نام با موفقیت انجام شد");
                        // newUser.password = go
                        // newUser.type = '0';
                        setTimeout(() => {
                            location.reload();
                        }, 2000);
                    }).catch(err => {
                        toastr.error('خطا در ثبت نام');
                    })
                }
            })
    } else {
        alert('پسورد یکسان نمیباشد');
    }
});

btn_login.addEventListener('click', (e) => {
    e.preventDefault();
    let LoginInfo = {
        username: Login_username.value,
        password: login_pass.value,
        email: login_email.value
    }
    fetch(`${url}api/public/users/login/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(LoginInfo)
    }).then(res => res.json())
        .then(res => {
            if (res.txt == 'accueillir') {
                localStorage.setItem('token', res.token);
                createOTP();
            } else if (res.txt == 'not found') {
                toastr.error('کاربر یافت نشد');
            } else if (res.txt == 'Ban User') {
                toastr.error('کاربر مورد نظر توسط مدیریت بن شده است');
            }
        }).catch(() => {
            toastr.error('خطا در سرور');
        })
});

function createOTP() {
    let email = login_email.value;
    location.href = `./authortication/index.html?username=${Login_username.value}&email=${email}`
}