let exit_panel = document.querySelector('#exit_panel');
let title_body_left_panel = document.querySelector('.title_body_left_panel');
let profile_user = document.querySelector('#profile_user');
let count_wallet = document.querySelector('#count_wallet');
let close_popup = document.querySelector('.close_popup');
let container_popup = document.querySelector('.container_popup');
let increase_wallet = document.querySelector('#increase_wallet');
let userInfo = JSON.parse(localStorage.getItem('user'));
exit_panel.addEventListener('click', () => {
    localStorage.removeItem('user');
    location.reload();
});

increase_wallet.addEventListener('click', () => {
    container_popup.style.transform = 'translateY(10px)';
    document.querySelector('body').classList.add('dark_blur')
});

close_popup.addEventListener('click', () => {
    container_popup.style.transform = 'translateY(-528px)';
    setTimeout(function () {
        document.querySelector('body').classList.remove('dark_blur')
    }, 200);
});

function GetProfileUser(email) {
    fetch(`https://sabzlearn.chbk.run/api/users/profile/${email}/`)
        .then(res => res.text())
        .then(res => {
            profile_user.src = res
        })
}

window.addEventListener('DOMContentLoaded', () => {
    if (!userInfo) {
        location.href = '../../auth/index.html'
    } else {
        count_wallet.innerHTML = (userInfo.wallet).toLocaleString('fa-IR') + ' تومان'
        GetProfileUser(userInfo.email);
        title_body_left_panel.innerHTML = `${userInfo.name == 'empty' ? 'مهمان' : userInfo.name} عزیز؛ خوش اومدی 🙌`
    }
});