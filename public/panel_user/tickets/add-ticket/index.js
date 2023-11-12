let exit_panel = document.querySelector('#exit_panel');
let title_body_left_panel = document.querySelector('.title_body_left_panel');
let profile_user = document.querySelector('#profile_user');
let userInfo = JSON.parse(localStorage.getItem('user'));
let list_departeman = document.querySelector('#list_type_user');
let title_ticket = document.querySelector('.name_input');
let InfoToken = localStorage.getItem('token');
let descriptionTicket = document.querySelector('.bio_user');
let btnSend = document.querySelector('.btn_create_user');
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

function isLogin(pathRedirect) {
    if (userInfo) {
        fetch(`${url}api/public/users/all/`)
            .then(res => res.json())
            .then(go => {
                let isLoginUser = go.some(user => {
                    return user.username == userInfo.username && user.password == userInfo.password && userInfo.type == user.type
                });
                if (!isLoginUser) {
                    location.href = pathRedirect;
                }
            })
    } else {
        location.href = pathRedirect;
    }
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

function GetProfileUser(email) {
    fetch(`${url}api/public/users/profile/${email}/`)
        .then(res => res.text())
        .then(res => {
            profile_user.src = res
        })
}

window.addEventListener('DOMContentLoaded', () => {
    isLogin('../../../auth/index.html');
    GetProfileUser(userInfo.email);
    title_body_left_panel.innerHTML = `${userInfo.name == 'empty' ? 'مهمان' : userInfo.name} عزیز؛ خوش اومدی 🙌`
});

btnSend.addEventListener('click', (e) => {
    e.preventDefault();
    if (list_departeman.value && title_ticket.value && descriptionTicket.value) {
        let now = new Date();
        let newTicket = {
            title: title_ticket.value,
            departeman: list_departeman.value,
            chats: {
                infoUser: userInfo,
                description: descriptionTicket.value,
                hour: `${now.getHours()}:${now.getMinutes()}`,
                date: `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`,

            },
            status: 'open',
        }

        fetch(`${url}api/user/ticket/send/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": InfoToken
            },
            body: JSON.stringify(newTicket)
        }).then(res => res.text())
            .then(go => {
                toastr.success('تیکت با موفقیت ایجاد شد');
                setTimeout(function () {
                    location.href = '../index.html'
                }, 2500)
            })

    } else {
        toastr.error('فرم تکمیل نمیباشد');
    }
});