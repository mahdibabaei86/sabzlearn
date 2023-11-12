import isLogin from '../../../assets/js/IsLogin.js';
let btn_send_txt = document.querySelector('.btn_send_txt');
let btn_close_ticket = document.querySelector('.btn_close_ticket');
let exit_panel = document.querySelector('#exit_panel');
let title_body_left_panel = document.querySelector('.title_body_left_panel');
let profile_user = document.querySelector('#profile_user');
let msBody = document.querySelector('.ms-body');
let userInfo = JSON.parse(localStorage.getItem('user'));
let btn_send_file = document.querySelector('.btn_send_file');
let title_page = document.querySelector('.title_page');
let token = localStorage.getItem('token');
let inputMessage = document.querySelector('.box-bottom_replay_message input');
let idTicket = new URLSearchParams(location.search).get('id');
document.title = `تیکت #${idTicket} - پنل کاربری - سبز لرن`;
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

if (!idTicket) {
    location.href = '../index.html'
}

function isStatusTicket() {
    fetch(`${url}api/admin/ticket/views/${idTicket}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        },
    })
        .then(res => res.json())
        .then(go => {
            if (go[0].status == 'close') {
                document.querySelector('.box-bottom_replay_message').innerHTML = `
                <div class="alert-danger">
                <i class="bx bxs-info-circle"></i>
                <span>این تیکت توسط مدیریت بسته شده است<span>
                </div>
                `;
            }
        })
}

btn_close_ticket.addEventListener('click', () => {
    Swal.fire({
        title: 'آیا از بستن تیکت فوق مطمئن هستی؟',
        text: "با کلیک روی بستن دیگر امکان ارسال پیام از این بخش وجود نخواهد داشت",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'منصرف شدن',
        confirmButtonText: 'بستن تیکت'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${url}api/admin/ticket/close/${idTicket}/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                },
            })
                .then(res => res.text())
                .then(go => {
                    toastr.success('تیکت با موفقیت بسته شد');
                    setTimeout(function () {
                        location.reload();
                    }, 3500);
                })
        }
    })
})

btn_send_txt.addEventListener('click', () => {
    if (inputMessage.value) {
        let newTicket = {
            id: idTicket,
            userInfo: userInfo,
            description: inputMessage.value,
        }
        fetch(`${url}api/admin/ticket/send-response/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            },
            body: JSON.stringify(newTicket)
        }).then(res => res.text())
            .then(go => {
                if (go == 'send message') {
                    location.reload();
                }
            })
    }
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

window.addEventListener('DOMContentLoaded', () => {
    isLogin('../../../auth/index.html');
    isStatusTicket();
    msBody.innerHTML = ''
    fetch(`${url}api/admin/ticket/views/${idTicket}/`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        },
    })
        .then(res => res.json())
        .then(go => {
            title_page.innerHTML = `${go[0].title}  ${go[0].id}#`
            let chats = JSON.parse(go[0].chats);
            chats.forEach(el => {
                if (el.infoUser.username == userInfo.username) {
                    const regex = /\.(jpeg|jpg|gif|png)$/i;
                    if (regex.test(el.description)) {
                        msBody.insertAdjacentHTML('beforeend', `<div class="message-feed media">
                        <div class="media-body">
                        <div class="mf-content">
                        <h3>${el.infoUser.username}</h3>
                        <img src="${el.description}" class="img_sending_message"/>
                            </div>
                            <p class="mf-date"><i class="fa fa-clock-o"></i>${el.hour} ${el.date}</p>
                        </div>
                    </div>`);
                    } else {
                        msBody.insertAdjacentHTML('beforeend', `<div class="message-feed media">
                        <div class="media-body">
                        <div class="mf-content">
                        <h3>${el.infoUser.username}</h3>
                               ${el.description}
                            </div>
                            <p class="mf-date"><i class="fa fa-clock-o"></i>${el.hour} ${el.date}</p>
                        </div>
                    </div>`);
                    }
                } else {
                    const regex = /\.(jpeg|jpg|gif|png)$/i;
                    if (regex.test(el.description)) {
                        msBody.insertAdjacentHTML('beforeend', `<div class="message-feed right">
                            <div class="media-body">
                            <div class="mf-content">
                            <h3>${el.infoUser.username}</h3>
                            <img src="${el.description}" class="img_sending_message"/>
                                </div>
                                <p class="mf-date"><i class="fa fa-clock-o"></i>${el.hour} ${el.date}</p>
                            </div>
                        </div>`);
                    } else {
                        msBody.insertAdjacentHTML('beforeend', `<div class="message-feed right">
                            <div class="media-body">
                            <div class="mf-content">
                            <h3>${el.infoUser.username}</h3>
                                ${el.description}
                                </div>
                                <p class="mf-date"><i class="fa fa-clock-o"></i>${el.hour} ${el.date}</p>
                            </div>
                        </div>`);
                    }
                }
            });
        })
    GetProfileUser(userInfo.email);
    title_body_left_panel.innerHTML = `${userInfo.name == 'empty' ? 'مهمان' : userInfo.name} عزیز؛ خوش اومدی 🙌`
});

btn_send_file.addEventListener('click', () => {
    document.querySelector('#file_uploading').click();
});

document.querySelector('#file_uploading').addEventListener('change', () => {
    let formDataFile = new FormData();
    formDataFile.append('file', document.querySelector('#file_uploading').files[0]);
    fetch(`${url}api/user/ticket/upload/file/`, {
        method: 'POST',
        headers: {
            "authorization": token
        },
        body: formDataFile
    }).then(res => res.text())
        .then(go => {
            let urlFile = go.replace(/C:\\xampp\\htdocs\\/, "http://localhost/");
            const urlFile3 = urlFile.replace(/\\/g, '/');
            inputMessage.value = urlFile3;
            console.log(urlFile3);
            inputMessage.style.display = 'none';
        })
})