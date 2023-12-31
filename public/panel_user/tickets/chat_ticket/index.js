let btn_send_txt = document.querySelector('.btn_send_txt');
let exit_panel = document.querySelector('#exit_panel');
let title_body_left_panel = document.querySelector('.title_body_left_panel');
let profile_user = document.querySelector('#profile_user');
let msBody = document.querySelector('.ms-body');
let userInfo = JSON.parse(localStorage.getItem('user'));
let title_page = document.querySelector('.title_page');
let InfoToken = localStorage.getItem('token');
let btn_send_file = document.querySelector('.btn_send_file');
let inputMessage = document.querySelector('.box-bottom_replay_message input');
let idTicket = new URLSearchParams(location.search).get('id');
document.title = `تیکت #${idTicket} - پنل کاربری - سبز لرن`
let url = 'http://localhost:3000/';

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

function isStatusTicket() {
    fetch(`${url}api/user/ticket/view/${idTicket}/${userInfo.username}/${userInfo.password}/`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "authorization": InfoToken
        }
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

btn_send_txt.addEventListener('click', () => {
    if (inputMessage.value) {
        let newTicket = {
            id: idTicket,
            username: userInfo.username,
            password: userInfo.password,
            userInfo: userInfo,
            description: inputMessage.value,
        }
        fetch(`${url}api/user/ticket/send-response/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": InfoToken
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
            document.querySelectorAll('.img-avatar').forEach(profile => {
                profile.src = res
            })
        })
}

window.addEventListener('DOMContentLoaded', () => {
    isLogin('../../../auth/index.html');
    isStatusTicket();
    msBody.innerHTML = ''
    fetch(`${url}api/user/ticket/view/${idTicket}/${userInfo.username}/${userInfo.password}/`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "authorization": InfoToken
        }
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
            "authorization": InfoToken
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