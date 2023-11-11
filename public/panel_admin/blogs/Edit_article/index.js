let btn_edit = document.querySelector('.btn_create_course');
let container_courses = document.querySelector('.container_box_my_courses');
let exit_panel = document.querySelector('#exit_panel');
let profile_user = document.querySelector('#profile_user');
let url_before_cover = document.querySelector('.url_before_cover');
let title_article = document.querySelector('.title_article');
let list_type_course = document.querySelector('#list_type_course');
let token = localStorage.getItem('token');
let cover_picture_course = document.querySelector('.cover_picture_course');
let description_long_course = document.querySelector('.description_long_course');
let title_body_left_panel = document.querySelector('.title_body_left_panel');
let userInfo = JSON.parse(localStorage.getItem('user'));
let url = 'http://localhost:3000/';
function GetProfileUser(email) {
    fetch(`${url}api/public/users/profile/${email}/`)
        .then(res => res.text())
        .then(res => {
            profile_user.src = res
        })
}

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

window.addEventListener('DOMContentLoaded', () => {
    isLogin('../../../auth/index.html');
    GetProfileUser(userInfo.email);
    appendEditedDom();
    title_body_left_panel.innerHTML = `${userInfo.name == 'empty' ? 'مهمان' : userInfo.name} عزیز؛ خوش اومدی 🙌`;
});

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

btn_edit.addEventListener('click', (e) => {
    e.preventDefault();
    if (cover_picture_course.files[0]) {
        let formDataCover = new FormData();
        formDataCover.append('file', cover_picture_course.files[0]);
        fetch(`${url}api/admin/blog/uploads/`, {
            method: 'POST',
            headers: {
                "Authorization": token
            },
            body: formDataCover
        }).then(res => res.json())
            .then(go => {
                url_before_cover.value = go.urlCover
                sendPostEdit();
            })
    } else {
        sendPostEdit();
    }
});

function sendPostEdit() {
    let now = new Date();
    let newEdit = {
        id: new URLSearchParams(location.search).get('id'),
        title: title_article.value,
        category: list_type_course.value,
        cover: url_before_cover.value,
        clendare: `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`,
        author: userInfo.username,
        description: description_long_course.value
    }
    fetch(`${url}api/admin/blog/edit/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify(newEdit)
    }).then(res => res.json())
        .then(go => {
            toastr.success('مقاله با موفقیت ویرایش شد');
            setTimeout(function () {
                location.reload();
            }, 3000);
        }).catch(() => {
            toastr.error('خطا در سرور');
        });
}

function appendEditedDom() {
    fetch(`${url}api/public/blog/view-article/${new URLSearchParams(location.search).get('id')}`)
        .then(res => res.json())
        .then(go => {
            let postmain = go[0];
            document.querySelector('#name_page_edit_article').innerHTML = `ویرایش دوره ${postmain.title}`;
            title_article.value = postmain.title;
            list_type_course.value = postmain.category;
            url_before_cover.value = (postmain.cover).slice(1, -1);
            description_long_course.value = postmain.description;
        })
}