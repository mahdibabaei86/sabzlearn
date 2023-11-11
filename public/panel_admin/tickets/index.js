let exit_panel = document.querySelector('#exit_panel');
let title_body_left_panel = document.querySelector('.title_body_left_panel');
let profile_user = document.querySelector('#profile_user');
let list_all_tickets = document.querySelector('.list_all_tickets');
let all_tickets = document.querySelector('#all_tickets');
let open_tickets = document.querySelector('#open_tickets');
let close_tickets = document.querySelector('#close_tickets');
let token = localStorage.getItem('token');
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
    isLogin('../../auth/index.html');
    GetDataDom();
    appendTicketsView();
    GetProfileUser(userInfo.email);
    title_body_left_panel.innerHTML = `${userInfo.name == 'empty' ? 'مهمان' : userInfo.name} عزیز؛ خوش اومدی 🙌`
});

function setInfoStatusTicket(info) {
    if (info.status == 'Response') {
        return 'پاسخ داده شده'
    } else if (info.status == 'open') {
        return 'باز'
    } else if (info.status == 'close') {
        return 'بسته'
    } else if (info.status == 'no response') {
        return 'پاسخ داده نشده'
    }
}

function appendTicketsView() {
    fetch(`${url}api/admin/ticket/view/all/`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        },
    })
        .then(res => res.json())
        .then(go => {
            go.reverse().forEach(ticket => {
                let history = JSON.parse(ticket.chats);
                let lastmessage = history[history.length - 1];
                list_all_tickets.insertAdjacentHTML('beforeend', `<li class="one_tickets_user" onclick="getlocationTicket(this)" data-id="${ticket.id}">
                <span class="id_tickets">#${ticket.id}</span>
                <span class="title_tickets">${ticket.title}</span>
                <span class="time_tickets">${lastmessage.hour} ${lastmessage.date}</span>
                <span class="category_tickets">${ticket.departeman}</span>
                <span class="status_tickets">${setInfoStatusTicket(ticket)}</span>
            </li>`)
            });
        })
}

function getlocationTicket(e) {
    let idTicket = e.dataset.id
    location.href = `./chat_ticket/index.html?id=${idTicket}`
}

function GetDataDom() {
    fetch(`${url}api/admin/ticket/view/all/`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        },
    })
        .then(res => res.json())
        .then(go => {
            let OpenTickets = go.filter(ticket => {
                return ticket.status == 'open'
            })
            let CloseTickets = go.filter(ticket => {
                return ticket.status == 'close'
            })
            open_tickets.innerHTML = `${OpenTickets.length} تیکت`
            close_tickets.innerHTML = `${CloseTickets.length} تیکت`
            all_tickets.innerHTML = `${OpenTickets.length + CloseTickets.length} تیکت`
        })
}