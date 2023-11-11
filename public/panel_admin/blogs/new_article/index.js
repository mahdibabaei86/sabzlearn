let exit_panel = document.querySelector('#exit_panel');
let title_body_left_panel = document.querySelector('.title_body_left_panel');
let profile_user = document.querySelector('#profile_user');
let category = document.querySelector('#list_type_course');
let coverArticle = document.querySelector('.cover_picture_course');
let descriptionArticle = document.querySelector('.description_long_course');
let btnSendArticle = document.querySelector('.btn_create_course');
let token = localStorage.getItem('token');
let title_article = document.querySelector('.title_article');
let userInfo = JSON.parse(localStorage.getItem('user'));
let url = 'http://localhost:3000/';
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

function isLogin(pathRedirect) {
    if (userInfo) {
        fetch(`${url}api/public/users/all/`)
            .then(res => res.json())
            .then(go => {
                let isLoginUser = go.some(user => {
                    return user.username == userInfo.username && user.password == userInfo.password && userInfo.type == user.type
                });
                fetch(`${url}api/token/isVriefy/${token}/`)
                    .then(res => res.text())
                    .then(go => {
                        if (!isLoginUser || go !== 'Access Token') {
                            localStorage.removeItem('user');
                            localStorage.removeItem('token');
                            location.reload();
                        }
                    })
            })
    } else {
        location.href = pathRedirect;
    }
}

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
});

btnSendArticle.addEventListener('click', (e) => {
    e.preventDefault();
    if ((coverArticle.files).length && category.value && descriptionArticle.value) {
        let formData = new FormData();
        formData.append('file', coverArticle.files[0]);
        fetch(`${url}api/admin/blog/uploads/`, {
            method: 'POST',
            headers: {
                "Authorization": token
            },
            body: formData
        }).then(res => res.json())
            .then(go => {
                if (go.status == 200) {
                    fetch(`${url}api/admin/blog/new-article/`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": token
                        },
                        body: JSON.stringify(createObjectArticle(go.urlCover))
                    }).then(res => res.text())
                        .then(go => {
                            toastr.success('مقاله ارسال شد');
                            setTimeout(function () {
                                location.reload();
                            }, 3000);
                        }).catch(() => {
                            toastr('خطا در سرور');
                        })
                }
            })
    } else {
        toastr.error('خطا در ارسال مقاله');
    }
});

function createObjectArticle(cover) {
    let now = new Date();
    let newArticle = {
        title: title_article.value,
        author: userInfo.username,
        clender: `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`,
        category: category.value,
        cover: cover.replace(/C:\\xampp\\htdocs\\/, "http://localhost/"),
        description: descriptionArticle.value
    }
    return newArticle
}