let title_body_left_panel = document.querySelector('.title_body_left_panel');
let btn_new_course = document.querySelector('.btn_new_course');
let container_courses = document.querySelector('.container_box_my_courses');
let profile_user = document.querySelector('#profile_user');
let exit_panel = document.querySelector('#exit_panel');
let registred_course = document.querySelector('#registred_course');
let userInfo = JSON.parse(localStorage.getItem('user'));
let url = 'http://localhost:3000/';
function GetProfileUser(email) {
    fetch(`${url}api/users/profile/${email}/`)
        .then(res => res.text())
        .then(res => {
            profile_user.src = res
        })
}

function isLogin(pathRedirect) {
    if (userInfo) {
        fetch(`${url}api/users/all/`)
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

window.addEventListener('DOMContentLoaded', () => {
    isLogin('../../auth/index.html');
    container_courses.innerHTML = ''
    fetch(`${url}api/products/my-course/${userInfo.username}`)
        .then(res => res.json())
        .then(res => {
            if (!res.length) {
                container_courses.insertAdjacentHTML('beforeend', `
                <div class="alert-danger">
                <span>تابحال دوره ای خریداری نکرده اید.</span>
                <i class="bx bxs-info-circle"></i>
                </div>
                    `);
                registred_course.innerHTML = `${res.length} دوره`;
            } else {
                registred_course.innerHTML = `${res.length} دوره`;
                res.forEach(course => {
                    let cover = (course.cover).slice(1, -1);
                    container_courses.insertAdjacentHTML('beforeend', `
                    <div class="box_course" onclick="getLocationCourse(this)" data-symbol="${course.symbol}">
                        <img src="${cover}">
                        <h2 class="name_box_course">${course.name}</h2>
                    </div>
                    `);
                });
            }
        })
    GetProfileUser(userInfo.email);
    title_body_left_panel.innerHTML = ` ${userInfo.name == 'empty' ? 'مهمان' : userInfo.name} عزیز؛ خوش اومدی 🙌`;
    profile_user.src = userInfo.profile ? userInfo.profile : 'https://secure.gravatar.com/avatar/35be9895be58a709cae98d8657d93f93?s=96&d=mm&r=g';
});

function getLocationCourse(e) {
    location.href = `../../single_course/index.html?symbol=${e.dataset.symbol}`
}