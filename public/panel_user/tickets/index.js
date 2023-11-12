let exit_panel = document.querySelector('#exit_panel');
let title_body_left_panel = document.querySelector('.title_body_left_panel');
let profile_user = document.querySelector('#profile_user');
let newTicket = document.querySelector('#newTicket');
let list_all_tickets = document.querySelector('.list_all_tickets');
let all_tickets = document.querySelector('#all_tickets');
let open_tickets = document.querySelector('#open_tickets');
let InfoToken = localStorage.getItem('token');
let close_tickets = document.querySelector('#close_tickets');
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
                if (!isLoginUser) {
                    location.href = pathRedirect;
                }
            })
    } else {
        location.href = pathRedirect;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    isLogin('../../auth/index.html');
    GetProfileUser(userInfo.email);
    title_body_left_panel.innerHTML = `${userInfo.name == 'empty' ? 'مهمان' : userInfo.name} عزیز؛ خوش اومدی 🙌`
    appendTicketsView(userInfo);
});

newTicket.addEventListener('click', () => {
    location.href = './add-ticket/index.html'
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
            counterInfoHeaderfeacher(go);
            if (go.length) {
                go.forEach(ticket => {
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
            } else {
                list_all_tickets.insertAdjacentHTML('beforeend', `<div class="alert-danger">
                <span>تیکتی یافت نشد :)</span>
                <i class="bx bxs-info-circle"></i>
                </div>`)
            }
        })
}

function getlocationTicket(e) {
    let idTicket = e.dataset.id
    location.href = `./chat_ticket/index.html?id=${idTicket}`
}

function counterInfoHeaderfeacher(tickets) {
    let Open_tickets = tickets.filter(ticket => {
        return ticket.status == 'open'
    });
    let Close_tickets = tickets.filter(ticket => {
        return ticket.status == 'close'
    });

    all_tickets.innerHTML = `${Open_tickets.length + Close_tickets.length} تیکت`
    open_tickets.innerHTML = `${Open_tickets.length} تیکت`
    close_tickets.innerHTML = `${Close_tickets.length} تیکت`
}