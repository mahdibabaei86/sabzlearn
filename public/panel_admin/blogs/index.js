let btn_new_course = document.querySelector('.btn_new_course');
let container_courses = document.querySelector('.container_box_my_courses');
let exit_panel = document.querySelector('#exit_panel');
let profile_user = document.querySelector('#profile_user');
let InfoToken = localStorage.getItem('token');
let title_body_left_panel = document.querySelector('.title_body_left_panel');
let userInfo = JSON.parse(localStorage.getItem('user'));
let url = 'http://localhost:3000/';
function GetProfileUser(email) {
    fetch(`${url}api/public/users/profile/${email}/`, {
        method: 'GET',
        headers: {
            'Authorization': InfoToken
        }
    })
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
                fetch(`${url}api/token/isVriefy/${InfoToken}/`)
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
    isLogin('../../auth/index.html');
    GetProfileUser(userInfo.email);
    title_body_left_panel.innerHTML = `${userInfo.name == 'empty' ? 'مهمان' : userInfo.name} عزیز؛ خوش اومدی 🙌`
    container_courses.innerHTML = ''
    fetch(`${url}api/public/blog/all/`)
        .then(res => res.json())
        .then(res => {
            if (res.length) {
                res.forEach(post => {
                    let cover = (post.cover).slice(1, -1).replace(/C:\\xampp\\htdocs\\/, "http://localhost/");
                    container_courses.insertAdjacentHTML('beforeend', `
                        <div class="box_course" data-id="${post.id}">
                            <img src="${cover}">
                            <h2 class="name_box_course">${post.title}</h2>
                            <div class="btns_access_course">
                                <button class="edit_box_course" onclick="editCourse(this)">ویرایش</button>
                                <button class="remove_box_course" onclick="removeProduct(this)">حذف</button>
                            </div>
                        </div>
                        `);
                });
            } else {
                container_courses.insertAdjacentHTML('beforeend', `
                <div class="alert-danger">
                <span>هیچ مقاله ای وجود ندارد!</span>
                <i class="bx bxs-info-circle"></i>
                </div>
                        `);
            }
        })
});

function removeProduct(e) {
    let symbolProduct = e.parentElement.parentElement.dataset.id
    Swal.fire({
        title: `آیا از حذف دوره ${document.querySelector('.name_box_course').innerHTML} مطمئن هستی؟`,
        text: "با کلیک روی گزینه حذف دوره دوره حذف میشود",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'منصرف شدن',
        confirmButtonText: 'حذف دوره'
    }).then((result) => {
        if (result.isConfirmed) {
            let info = {
                symbol: symbolProduct
            }
            fetch(`${url}api/admin/blog/remove/`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": InfoToken
                },
                body: JSON.stringify(info)
            }).then(res => {
                toastr.success('مقاله با موفقیت حذف شد');
                setTimeout(function () {
                    location.reload()
                }, 3000)
            }).catch(() => {
                toastr.error('خطا در حذف مقاله');
            })
        }
    })
}

btn_new_course.addEventListener('click', () => {
    location.href = './new_article/'
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

function editCourse(info) {
    let symbolCourse = info.parentElement.parentElement.dataset.id;
    location.href = `./Edit_article/index.html?id=${symbolCourse}`;
}