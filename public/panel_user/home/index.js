let title_body_left_panel = document.querySelector('.title_body_left_panel');
let profile_user = document.querySelector('#profile_user');
let exit_panel = document.querySelector('#exit_panel');
let all_tickets = document.querySelector('#all_tickets');
let InfoToken = localStorage.getItem('token');
let count_wallet = document.querySelector('#count_walletSS');
let userInfo = JSON.parse(localStorage.getItem('user'));
let url = 'http://localhost:3000/';
function GetProfileUser(email) {
    fetch(`http://localhost:3000/api/public/users/profile/${email}/`)
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
    importDataUser();
    appendTicketsView(userInfo);
    GetProfileUser(userInfo.email);
    title_body_left_panel.innerHTML = ` ${userInfo.name == 'empty' ? 'مهمان' : userInfo.name} عزیز؛ خوش اومدی 🙌`;
    profile_user.src = userInfo.profile ? userInfo.profile : 'https://secure.gravatar.com/avatar/35be9895be58a709cae98d8657d93f93?s=96&d=mm&r=g';
});

function appendTicketsView(info) {
    fetch(`${url}api/user/ticket/view/${info.username}/${info.password}/`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "authorization": InfoToken
        }
    })
        .then(res => res.json())
        .then(go => {
            let Open_tickets = go.filter(ticket => {
                return ticket.status == 'open'
            });
            let Close_tickets = go.filter(ticket => {
                return ticket.status == 'close'
            });

            all_tickets.innerHTML = `${Open_tickets.length + Close_tickets.length} تیکت`
        })
}

// import data user to panel
function importDataUser() {
    fetch(`${url}api/public/users/all/`)
        .then(res => res.json())
        .then(go => {
            let findUser = go.find(user => {
                if (user.username == userInfo.username && user.password == userInfo.password) {
                    return user
                }
            });
            count_wallet.innerHTML = `${findUser.wallet} تومان`
        })
}