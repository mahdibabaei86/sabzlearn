let userInfo = JSON.parse(localStorage.getItem('user'));
let add_users_panel = document.querySelector('.add_users_panel');
let profile_user = document.querySelector('#profile_user');
let exit_panel = document.querySelector('#exit_panel');
let token = localStorage.getItem('token');
let title_body_left_panel = document.querySelector('.title_body_left_panel');
let open_user = document.querySelector('.open_user');
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

add_users_panel.addEventListener('click', () => {
    location.href = './new_user/index.html'
});

window.addEventListener('DOMContentLoaded', () => {
    isLogin('../../auth/index.html');
    GetProfileUser(userInfo.email);
    title_body_left_panel.innerHTML = `${userInfo.name == 'empty' ? 'مهمان' : userInfo.name} عزیز؛ خوش اومدی 🙌`
    fetch(`${url}api/public/users/all/`)
        .then(res => res.json())
        .then(res => {
            document.querySelector('tbody').innerHTML = ''
            res.forEach(user => {
                if (user.status == 'active') {
                    document.querySelector('tbody').insertAdjacentHTML('beforeend', `
                        <tr data-username="${user.username}">
                        <td>
                        <img src="https://sabzlearn.ir/wp-content/uploads/2023/09/Logo.webp" id="${user.username}" data-email="${user.email}" class="profile_user_list">
                        </td>
                        <td>
                        <a href="#" class="user-link">${user.name} ${user.family}</a>
                        <span class="user-subhead">${user.type == 1 ? 'ادمین' : 'کاربر'}</span>
                        </td>
                        <td class="text-center">
                        <span class="label label-default">${user.status == 'active' ? 'فعال' : 'غیر فعال'}</span>
                        </td>
                        <td>
                        <button class="ban_user" onclick="banUser(this)">تعلیق</button>
                        </td>
                        <td>
                        <button class="btn_edit_user" onclick="editInfoUser(this)">ویرایش</button>
                        <button class="btn_remove_user" onclick="removeUser(this)">حذف</button>
                        </td>
                        </tr>
                        `);
                } else {
                    document.querySelector('tbody').insertAdjacentHTML('beforeend', `
                <tr data-username="${user.username}">
                                                <td>
                                                    <img src="https://sabzlearn.ir/wp-content/uploads/2023/09/Logo.webp" id="${user.username}" class="profile_user_list">
                                                </td>
                                                <td>
                                                    <a href="#" class="user-link">${user.name} ${user.family}</a>
                                                    <span class="user-subhead">${user.type == 1 ? 'ادمین' : 'کاربر'}</span>
                                                </td>
                                                <td class="text-center">
                                                    <span class="label label-default">${user.status == 'active' ? 'فعال' : 'غیر فعال'}</span>
                                                </td>
                                                <td>
                                                    <button class="open_user" onclick="openUser(this)">باز</button>
                                                </td>
                                                <td>
                                                    <button class="btn_edit_user" onclick="editInfoUser(this)">ویرایش</button>
                                                    <button class="btn_remove_user" onclick="removeUser(this)">حذف</button>
                                                </td>
                                            </tr>
                `);
                }
            });
        }).catch(res => {
            toastr.error('خطا در دریافت اطلاعات');
        })
});

function editInfoUser(e) {
    let userInfos = e.parentElement.parentElement.dataset.username;
    location.href = `../edit_my_account/index.html?username=${userInfos}`
}

function banUser(e) {
    let findUsername = e.parentElement.parentElement.dataset.username;
    fetch(`${url}api/admin/users/ban/${findUsername}/`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        },
    })
        .then(res => {
            if (res.status == 200) {
                if (res.status == 200) {
                    toastr.success("کاربر با موفقیت بن شد");
                }
            }
        }).catch(res => {
            toastr.error('خطا در بن کردن کاربر');
        });
    setTimeout(() => {
        location.reload();
    }, 5000);
}

function openUser(e) {
    let findUsername = e.parentElement.parentElement.dataset.username;
    fetch(`${url}api/admin/users/open/${findUsername}/`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        },
    })
        .then(res => {
            if (res.status == 200) {
                toastr.success("کاربر با موفقیت باز شد");
            }
        }).catch(res => {
            toastr.error('خطا در باز کردن کاربر');
        });
    setTimeout(() => {
        location.reload();
    }, 5000);
}

function removeUser(e) {
    let findUsername = { findUsername: e.parentElement.parentElement.dataset.username };
    fetch(`${url}api/admin/users/remove/`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        },
        body: JSON.stringify(findUsername)
    })
        .then(res => {
            if (res.status == 200) {
                toastr.success("کاربر با موفقیت حذف شد");
            }
        }).catch(res => {
            toastr.error('خطا در حذف کردن کاربر');
        });
    setTimeout(() => {
        location.reload();
    }, 5000);
}