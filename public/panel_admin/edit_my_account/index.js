import isLogin from '../../assets/js/IsLogin.js';
let exit_panel = document.querySelector('#exit_panel');
let title_body_left_panel = document.querySelector('.title_body_left_panel');
let profile_user = document.querySelector('#profile_user');
let username_input = document.querySelector('.username_input');
let pass_input = document.querySelector('.pass_input');
let name_input = document.querySelector('.name_input');
let token = localStorage.getItem('token');
let family_input = document.querySelector('.family_input');
let email_input = document.querySelector('.email_input');
let bio_input = document.querySelector('.bio_input');
let btn_update = document.querySelector('.btn_update_user');
let profile_edit = document.querySelector('#profile_edit');
let userUrl = new URLSearchParams(location.search).get('username');
let userInfo = JSON.parse(localStorage.getItem('user'));
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

exit_panel.addEventListener('click', () => {
    Swal.fire({
        title: 'آیا از خروج مطمئن هستی؟',
        text: "با کلیک روی خروج از حساب کاربریت خارج میشی",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'منصرف شدن',
        confirmButtonText: 'خروج از حساب کاربری'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('user');
            location.reload();
        }
    })
});

function GetProfileEdit(email) {
    fetch(`${url}api/public/users/profile/${email}/`, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
        .then(res => res.text())
        .then(res => {
            profile_edit.src = res
        })
}

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
    isLogin('../../auth/index.html');
    GetProfileUser(userInfo.email);
    fetch(`${url}api/public/users/all/`)
        .then(res => res.json())
        .then(go => {
            if (userUrl) {
                let userFund = go.find(user => {
                    return user.username == new URLSearchParams(location.search).get('username')
                });
                setInput(userFund);
            } else {
                let userFund = go.find(user => {
                    return user.username == userInfo.username
                });
                setInput(userFund);
            }
        })
    title_body_left_panel.innerHTML = `${userInfo.name == 'empty' ? 'مهمان' : userInfo.name} عزیز؛ خوش اومدی 🙌`
});

// set data in inputs
function setInput(userFund) {
    GetProfileEdit(userFund.email);
    username_input.value = userFund.username
    name_input.value = userFund.name
    family_input.value = userFund.family
    email_input.value = userFund.email
    bio_input.value = userFund.bio
}

btn_update.addEventListener('click', (e) => {
    e.preventDefault();
    let info = {
        username: username_input.value,
        name: name_input.value,
        family: family_input.value,
        password: pass_input.value == '' ? 'empty' : pass_input.value,
        bio: bio_input.value,
    }
    fetch(`${url}api/admin/users/edit/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        },
        body: JSON.stringify(info)
    }).then(res => res.text())
        .then(go => {
            if (go == 'Success Edit Info') {
                toastr.success('اطلاعات کاربری آپدیت شد');
                fetch(`${url}api/public/users/all/`)
                    .then(res => res.json())
                    .then(go => {
                        let userFund = go.find(user => {
                            return user.username == userInfo.username
                        });
                        localStorage.setItem('user', JSON.stringify(userFund));
                    })
                // setTimeout(function () {
                //     location.reload();
                // }, 3000)
            }
        }).catch(() => {
            toastr.error('خطا در آپدیت اطلاعات کاربری');
        })
});