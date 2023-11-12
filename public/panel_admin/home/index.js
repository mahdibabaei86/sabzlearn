let exit_panel = document.querySelector('#exit_panel');
let title_body_left_panel = document.querySelector('.title_body_left_panel');
let profile_user = document.querySelector('#profile_user');
let InfoToken = localStorage.getItem('token');
let statusNotification = document.querySelector('.status_notification');
let token = localStorage.getItem('token');
let title_input_clock = document.querySelector('.title_input_clock');
let input_date_box = document.querySelector('.input_date_box');
let noteClock = document.querySelector('.clock_add_event textarea');
let btn_add_clock = document.querySelector('.btn_add_clock');
let all_tickets = document.querySelector('.all_tickets');
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
            'Authorization': InfoToken
        }
    })
        .then(res => res.text())
        .then(res => {
            profile_user.src = res
        })
}

window.addEventListener('DOMContentLoaded', () => {
    isLogin('../../auth/index.html');
    appendDomAllAlarm();
    GetDataDom();
    appendNotification();
    GetProfileUser(userInfo.email);
    title_body_left_panel.innerHTML = `${userInfo.name == 'empty' ? 'مهمان' : userInfo.name} عزیز؛ خوش اومدی 🙌`
});

document.querySelector('.btn_edit').addEventListener('click', () => {
    let boxMessage = prompt('پیغام را بنویس');
    if (boxMessage) {
        let notification = {
            message: boxMessage
        }
        fetch(`${url}api/admin/notification/edit/`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(notification)
        }).then(res => res.text())
            .then(go => {
                toastr.success('پیغام بروزرسانی شد');
                setTimeout(function () {
                    location.reload();
                }, 3500)
            })
    }
})

document.querySelector('.btn_enable').addEventListener('click', () => {
    let confirmEnble = confirm('آیا از غیر فعال کردن پیغام مطمئن هستید؟');
    if (confirmEnble) {
        fetch(`${url}api/admin/notification/enable/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
        })
            .then(res => res.text())
            .then(go => {
                toastr.error('پیغام غیر فعال شد');
                setTimeout(function () {
                    location.reload();
                }, 3500)
            })
    }
});

function appendNotification() {
    fetch(`${url}api/public/notification/get/`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "authorization": InfoToken
        },
    })
        .then(res => res.json())
        .then(go => {
            document.querySelector('.input_notification').value = go[0].message;
            if (go[0].status == 'active') {
                statusNotification.innerHTML = 'فعال';
                statusNotification.style.backgroundColor = 'rgb(46, 213, 115)';
            } else {
                statusNotification.innerHTML = 'غیرفعال';
                statusNotification.style.backgroundColor = 'rgb(251, 79, 36)';
            }
        })
}

function GetDataDom() {
    fetch(`${url}api/admin/ticket/view/all/`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "authorization": InfoToken
        },
    })
        .then(res => res.json())
        .then(go => {
            all_tickets.innerHTML = `${go.length} تیکت`;
        })
}

btn_add_clock.addEventListener('click', () => {
    if (title_input_clock.value && input_date_box.value && noteClock.value) {
        let newAlarm = {
            title: title_input_clock.value,
            clock: input_date_box.value,
            note: noteClock.value,
            email: userInfo.email,
            username: userInfo.username
        }
        fetch(`${url}api/admin/note/new/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": InfoToken
            },
            body: JSON.stringify(newAlarm)
        }).then(res => res.text())
            .then(go => {
                if (go == 'create note') {
                    toastr.success('یادداشت ایجاد شد');
                    setTimeout(() => {
                        location.reload();
                    }, 3000);
                }
            })
    } else {
        toastr.error('مقادیر ورودی خالی میباشد');
    }
});


function appendDomAllAlarm() {
    fetch(`${url}api/admin/note/all/`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "authorization": InfoToken
        }
    })
        .then(res => res.json())
        .then(go => {
            document.querySelector('.container_add_event_clock').innerHTML = '';
            if (go.length) {
                go.forEach(alaram => {
                    document.querySelector('.container_add_event_clock').insertAdjacentHTML('beforeend', `
                <div class="list_event_clock" data-id="${alaram.id}">
                                    <p class="title_event_clock_list">${alaram.title}</p>
                                    <div>
                                    <button class="btn_remove_evet_clock" onclick="removeAlaram(this)">حذف</button>
                                    <button class="btn_information_evet_clock" onclick="viewInfoAlarm(this)">جزئیات</button>
                                    </div>
                                </div>
                `);
                });
            } else {
                document.querySelector('.container_add_event_clock').insertAdjacentHTML('beforeend', `<div class="alert-danger">
                <span>یادداشت تنظیم نشده است!</span>
                <i class="bx bxs-info-circle"></i>
                </div>`);
            }
        })
}

function removeAlaram(info) {
    let id = info.parentElement.parentElement.dataset.id
    fetch(`${url}api/admin/note/remove/${id}/`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "authorization": InfoToken
        }
    }).then(res => res.text())
        .then(go => {
            if (go == 'remove note') {
                toastr.error('یادداشت حذف شد');
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
        })
}

function viewInfoAlarm(info) {
    let infoTag = info.parentElement.parentElement.dataset.id;
    fetch(`${url}api/admin/note/all/`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "authorization": InfoToken
        }
    }).then(res => res.json())
    .then(go => {
        let SelectAlaram = go.find(alaram => {
            return alaram.id == infoTag
        });
        Swal.fire({
            title: `<strong>عنوان: ${SelectAlaram.title}</strong>`,
            icon: "info",
            html: `
              <h2>زمان ایجاد یادداشت: ${SelectAlaram.clock}</h2>
              <h2>توضیحات: ${SelectAlaram.note}</h2>
            `,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: `
              بستن
            `,
            confirmButtonAriaLabel: "Thumbs up, great!",
            cancelButtonText: `
              <i class="fa fa-thumbs-down"></i>
            `,
        });
    });
}