let SelectFolder = document.querySelector('#SelectFolder');
let input_search_media = document.querySelector('.input_search_media');
let container_medias_gallery = document.querySelector('.container_medias_gallery');
let exit_panel = document.querySelector('#exit_panel');
let title_body_left_panel = document.querySelector('.title_body_left_panel');
let profile_user = document.querySelector('#profile_user');
let InfoToken = localStorage.getItem('token');
let titleModalFile = document.querySelector('.modal_info_files h3');
let coverModalFile = document.querySelector('.modal_info_files img');
let token = localStorage.getItem('token');
let title_input_clock = document.querySelector('.title_input_clock');
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
    container_medias_gallery.innerHTML = '';
    container_medias_gallery.insertAdjacentHTML('beforeend', `
        <div class="alert-danger">
        <span>از منو بالا دسته بندی را انتخاب کن.</span>
        <i class="bx bxs-info-circle"></i>
        </div>
                `);
    isLogin('../../auth/index.html');
    GetProfileUser(userInfo.email);
    title_body_left_panel.innerHTML = `${userInfo.name == 'empty' ? 'مهمان' : userInfo.name} عزیز؛ خوش اومدی 🙌`
});

SelectFolder.addEventListener('change', (e) => {
    if (e.target.value == 'selected') {
        container_medias_gallery.innerHTML = '';
        container_medias_gallery.insertAdjacentHTML('beforeend', `
        <div class="alert-danger">
        <span>از منو بالا دسته بندی را انتخاب کن.</span>
        <i class="bx bxs-info-circle"></i>
        </div>
                `);
    } else {
        fetch(`${url}api/admin/media/${e.target.value}/`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            },
        }).then(res => res.json())
            .then(go => {
                container_medias_gallery.innerHTML = '';
                go.forEach(file => {
                    if (e.target.value == 'covers') {
                        container_medias_gallery.insertAdjacentHTML('beforeend', `<div class="meida_box" data-name="${file}" onclick="openModalBox(this)">
                        <div class="type_media" title="image">
                            <i class="bx bxs-image-alt"></i>
                        </div>
                        <img src="../../../backend/uploads/${e.target.value}/${file}">
                    </div>`);
                    } else if (e.target.value == 'IntroductionVideoCourse') {
                        container_medias_gallery.insertAdjacentHTML('beforeend', `<div class="meida_box" data-name="${file}" onclick="openModalBox(this)">
                        <div class="type_media" title="mp4/video">
                            <i class="bx bxs-videos"></i>
                        </div>
                        <video src="../../../backend/uploads/${e.target.value}/${file}" muted="" autoplay=""></video>
                    </div>`);
                    } else {
                        container_medias_gallery.insertAdjacentHTML('beforeend', `<div class="meida_box_zip" data-name="${file}" onclick="openModalBox(this)">
                        <img src="../../../Images/rar_logo.png">
                    </div>`);
                    }
                });
            })
    }
});

input_search_media.addEventListener('keyup', (e) => {
    fetch(`${url}api/admin/media/search/${SelectFolder.value}/${e.target.value}/`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        },
    }).then(res => res.json())
        .then(go => {
            container_medias_gallery.innerHTML = '';
            go.forEach(file => {
                if (SelectFolder.value == 'covers') {
                    container_medias_gallery.insertAdjacentHTML('beforeend', `<div class="meida_box" data-name="${file}" onclick="openModalBox(this)">
                    <div class="type_media" title="image">
                        <i class="bx bxs-image-alt"></i>
                    </div>
                    <img src="../../../backend/uploads/${SelectFolder.value}/${file}">
                </div>`);
                } else if (SelectFolder.value == 'IntroductionVideoCourse') {
                    container_medias_gallery.insertAdjacentHTML('beforeend', `<div class="meida_box" data-name="${file}" onclick="openModalBox(this)">
                    <div class="type_media" title="mp4/video">
                        <i class="bx bxs-videos"></i>
                    </div>
                    <video src="../../../backend/uploads/${SelectFolder.value}/${file}" muted="" autoplay=""></video>
                </div>`);
                } else {
                    container_medias_gallery.insertAdjacentHTML('beforeend', `<div class="meida_box_zip" data-name="${file}" onclick="openModalBox(this)">
                    <img src="../../../Images/rar_logo.png">
                </div>`);
                }
            });
        })
});

input_search_media.addEventListener('click', () => {
    if (SelectFolder.value == 'selected') {
        Swal.fire({
            title: 'هشدار!',
            text: "ابتدا از دسته بندی نوع فایل را انتخاب کن",
            icon: 'warning',
            cancelButtonColor: '#d33',
        })
    }
});

function openModalBox(e) {
    if (SelectFolder.value == 'IntroductionVideoCourse') {
        coverModalFile.remove();
        document.querySelector('.modal_info_files video').style.display = 'block';
        document.querySelector('.modal_info_files video').src = `../../../backend/uploads/${SelectFolder.value}/${e.dataset.name}`;
    } else if (SelectFolder.value == 'mainfile') {
        coverModalFile.src = `../../../Images/rar_logo.png`;
        coverModalFile.style.width = '155px';
    }
    titleModalFile.innerHTML = e.dataset.name
    document.querySelector('.modal_info_files').style.transform = `translateY(0px)`;
    document.querySelector('body').classList.add('dark_model');
}

document.querySelector('#close_modal_file').addEventListener('click', () => {
    document.querySelector('.modal_info_files').style.transform = `translateY(-575px)`;
    document.querySelector('body').classList.remove('dark_model');
});

document.querySelector('#remove_modal_file').addEventListener('click', () => {
    fetch(`${url}api/admin/media/remove/${SelectFolder.value}/${titleModalFile.innerHTML}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        },
    }).then(res => res.text())
        .then(go => {
            if (go == 'successfully remove file') {
                toastr.error('فایل با موفقیت حذف شد');
                setTimeout(function () {
                    location.reload();
                }, 2500);
            }
        })
});