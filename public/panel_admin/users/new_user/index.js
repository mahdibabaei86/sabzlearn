import isLogin from '../../../assets/js/IsLogin.js';
let name_input = document.querySelector('.name_input');
let last_input = document.querySelector('.last_input');
let username_input = document.querySelector('.username_input');
let email_input = document.querySelector('.email_input');
let password_input = document.querySelector('.password_input');
let password_confirm_input = document.querySelector('.password_confirm_input');
let list_type_user = document.querySelector('#list_type_user');
let range_coin_user = document.querySelector('.range_coin_user');
let rangeSliderLabel = document.querySelector('#rangeSliderLabel');
let bio_user = document.querySelector('.bio_user');
let token = localStorage.getItem('token');
let userInfo = JSON.parse(localStorage.getItem('user'));
let profile_user = document.querySelector('#profile_user');
let title_body_left_panel = document.querySelector('.title_body_left_panel');
let btn_create_user = document.querySelector('.btn_create_user');
let url = 'http://localhost:3000/';
function GetProfileUser(email) {
    fetch(`${url}api/public/users/profile/${email}/`, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
        .then(res => res.text())
        .then(res => {
            profile_user.src = res
        })
}

window.addEventListener('DOMContentLoaded', () => {
    isLogin('../../../auth/index.html');
    GetProfileUser(userInfo.email);
    title_body_left_panel.innerHTML = `${userInfo.name == 'empty' ? 'مهمان' : userInfo.name} عزیز؛ خوش اومدی 🙌`
})

function userCreated(e) {
    e.preventDefault();
    let newUser = {
        adminRole: {
            username: userInfo.username,
            password: userInfo.password
        },
        name: name_input.value,
        family: last_input.value,
        username: username_input.value,
        password: password_input.value,
        email: email_input.value,
        type: list_type_user.value == 'ادمین' ? '1' : '0',
        wallet: range_coin_user.value,
        status: 'active',
        courses: 'empty',
        bio: bio_user.value
    }
    fetch(`${url}api/admin/users/add/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        },
        body: JSON.stringify(newUser)
    }).then(res => {
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
        toastr.success("کاربر با موفقیت ایجاد شد");
    }).catch(res => {
        toastr.error('خطا در ایجاد کاربر');
    })
}

function rangeWallet() {
    rangeSliderLabel.innerHTML = `${range_coin_user.value} تومان `
}

btn_create_user.addEventListener('click', userCreated);
range_coin_user.addEventListener('input', rangeWallet);