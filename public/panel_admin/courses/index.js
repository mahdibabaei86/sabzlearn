let btn_new_course = document.querySelector('.btn_new_course');
let container_courses = document.querySelector('.container_box_my_courses');
let exit_panel = document.querySelector('#exit_panel');
let profile_user = document.querySelector('#profile_user');
let token = localStorage.getItem('token');
let title_body_left_panel = document.querySelector('.title_body_left_panel');
let userInfo = JSON.parse(localStorage.getItem('user'));
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
    isLogin('../../auth/index.html');
    GetProfileUser(userInfo.email);
    title_body_left_panel.innerHTML = `${userInfo.name == 'empty' ? 'مهمان' : userInfo.name} عزیز؛ خوش اومدی 🙌`
    container_courses.innerHTML = ''
    fetch(`${url}api/public/products/all/`)
        .then(res => res.json())
        .then(res => {
            res.forEach(course => {
                let cover = (course.cover).slice(1, -1);
                container_courses.insertAdjacentHTML('beforeend', `
                    <div class="box_course" data-symbol="${course.symbol}">
                        <img src="${cover}">
                        <h2 class="name_box_course">${course.name}</h2>
                        <div class="btns_access_course">
                            <button class="edit_box_course" onclick="editCourse(this)">ویرایش</button>
                            <button class="remove_box_course" onclick="removeProduct(this)">حذف</button>
                        </div>
                    </div>
                    `);
            });
        })
});

function removeProduct(e) {
    let symbolProduct = e.parentElement.parentElement.dataset.symbol
    let confirmRemove = confirm(`آیا از حذف دوره ${symbolProduct} مطمئن هستید؟`);
    if (confirmRemove) {
        let info = {
            symbol: symbolProduct
        }
        fetch(`${url}api/admin/products/remove/`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                'Authorization': token
            },
            body: JSON.stringify(info)
        }).then(res => {
            console.log(res);
            toastr.success('دوره با موفقیت حذف شد');
            setTimeout(function () {
                location.reload()
            }, 3000)
        }).catch(() => {
            toastr.error('خطا در حذف دوره');
        })
    }
}

btn_new_course.addEventListener('click', () => {
    location.href = './new_course/index.html'
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
    let symbolCourse = info.parentElement.parentElement.dataset.symbol
    location.href = `./Edit_course/index.html?symbol=${symbolCourse}`
}