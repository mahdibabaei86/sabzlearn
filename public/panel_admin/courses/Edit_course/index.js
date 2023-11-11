import isLogin from '../../../assets/js/IsLogin.js';
let name_input = document.querySelector('.name_input');
let price_input = document.querySelector('.price_input');
let Introduction_video = document.querySelector('.Introduction_video');
let percent_courses_complate = document.querySelector('.percent_courses_complate');
let time_date_courses = document.querySelector('.time_date_courses');
let list_status_course = document.querySelector('#list_status_course');
let list_support_wait_course = document.querySelector('#list_support_wait_course');
let list_whatch_course = document.querySelector('#list_whatch_course');
let requirements_input = document.querySelector('.requirements_input');
let list_type_course = document.querySelector('#list_type_course');
let cover_picture_course = document.querySelector('.cover_picture_course');
let symbolInput = document.querySelector('.symbolInput');
let profile_user = document.querySelector('#profile_user');
let userInfo = JSON.parse(localStorage.getItem('user'));
let token = localStorage.getItem('token');
let title_page_edit_course = document.querySelector('#title_page_edit_course');
let cover_picture_course_url = document.querySelector('.cover_picture_course_url');
let persent_Off_course = document.querySelector('.persent_Off_course');
let description_short_course = document.querySelector('.description_short_course');
let description_long_course = document.querySelector('.description_long_course');
let input_upload_box_video = document.querySelector('.input_upload_box_video');
let symbolUrl = new URLSearchParams(location.search).get('symbol');
let Introduction_video_url = document.querySelector('.Introduction_video_url');
let btn_create_course = document.querySelector('.btn_create_course');
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

function appendInfoCourse() {
    fetch(`${url}api/public/products/view/${symbolUrl}/`)
        .then(res => res.json())
        .then(go => {
            title_page_edit_course.innerHTML = `ویرایش دوره : ${go[0].name}`
            name_input.value = go[0].name;
            price_input.value = go[0].price;
            symbolInput.value = go[0].symbol;
            percent_courses_complate.value = go[0].percentComplete;
            time_date_courses.value = go[0].time;
            list_support_wait_course.value = go[0].support;
            list_status_course.value = go[0].status;
            list_whatch_course.value = go[0].whatcher;
            requirements_input.value = go[0].prerequisite;
            list_type_course.value = go[0].category;
            persent_Off_course.value = go[0].persentOff;
            Introduction_video_url.value = (go[0].shortVideo).replace('"', '');
            cover_picture_course_url.value = (go[0].cover).replace('"', '');
            description_long_course.value = go[0].description;
            description_short_course.value = go[0].shortdes;
        })
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
    isLogin('../../../auth/index.html');
    GetProfileUser(userInfo.email);
    appendInfoCourse();
});

function editCourse(e) {
    let now = new Date();
    e.preventDefault();
    let charCountDescription = description_long_course.value.split('').length
    let newCourse = {
        symbol: symbolInput.value,
        name: name_input.value,
        price: price_input.value,
        videoShort: Introduction_video_url.value,
        percentComplateCourse: percent_courses_complate.value,
        timeCourse: time_date_courses.value,
        support: list_support_wait_course.value,
        statusCourse: list_status_course.value,
        whatcherType: list_whatch_course.value,
        requirements: requirements_input.value,
        category: list_type_course.value,
        persentOff: persent_Off_course.value,
        teacher: JSON.parse(localStorage.getItem('user')).username,
        updated: `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`,
        cover: cover_picture_course_url.value,
        descriptionLong: description_long_course.value,
        descriptionShort: description_short_course.value,
    }
    // console.log(newCourse);
    fetch(`${url}api/admin/products/edit/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify(newCourse)
    }).then(res => res.json())
        .then(res => {
            if (res.status == 200) {
                toastr.success('دوره با موفقیت آپدیت شد');
                setTimeout(function () {
                    location.reload();
                }, 3000)
            }
        }).catch(() => {
            toastr('خطا در آپدیت دوره');
        })

}

btn_create_course.addEventListener('click', editCourse);

let fileInput = document.getElementById("file-input");
let fileList = document.getElementById("files-list");
let numOfFiles = document.getElementById("num-of-files");

fileInput.addEventListener("change", () => {
    fileList.innerHTML = "";
    numOfFiles.textContent = `${fileInput.files.length} Files Selected`;

    for (i of fileInput.files) {
        let reader = new FileReader();
        let listItem = document.createElement("li");
        let fileName = i.name;
        let fileSize = (i.size / 1024).toFixed(1);
        listItem.innerHTML = `<p>${fileName}</p><p>${fileSize}KB</p>`;
        if (fileSize >= 1024) {
            fileSize = (fileSize / 1024).toFixed(1);
            listItem.innerHTML = `<p>${fileName}</p><p>${fileSize}MB</p>`;
        }
        fileList.appendChild(listItem);
    }
});

Introduction_video.addEventListener('change', () => {
    let IntroductionFile = Introduction_video.files[0];
    let formData = new FormData();
    formData.append('file', IntroductionFile);
    fetch(`${url}api/products/uploads/`, {
        method: 'POST',
        body: formData
    }).then(res => res.json()).then(resss => {
        if (resss.status == 200) {
            toastr.success("ویدویی معرفی با موفقیت آپلود شد.");
        } else {
            toastr.error('ویدویی معرفی آپلود نشد!');
        }
        // localStorage.setItem('path_Introduction_video', JSON.stringify(resss));
        Introduction_video_url.value = (resss.urlVideo).replace('"', '');
        Introduction_video_url.value = (Introduction_video_url.value).replace(/C:\\xampp\\htdocs\\/, "http://localhost/");
    });
});

cover_picture_course.addEventListener('change', () => {
    let coverPictureCourse = cover_picture_course.files[0];
    let formData = new FormData();
    formData.append('cover', coverPictureCourse);
    fetch(`${url}api/products/uploads/covers/`, {
        method: 'POST',
        body: formData
    }).then(res => res.json()).then(resss => {
        if (resss.status == 200) {
            toastr.success("کاور با موفقیت آپلود شد.");
        } else {
            toastr.error('کاور معرفی آپلود نشد!');
        }
        // localStorage.setItem('coversPath', JSON.stringify(resss));
        cover_picture_course_url.value = (resss.urlCover).replace('"', '');
        cover_picture_course_url.value = (cover_picture_course_url.value).replace(/C:\\xampp\\htdocs\\/, "http://localhost/");
    });
});

// fileInput.addEventListener('change', () => {
//     let mainFileCourse = fileInput.files[0];
//     let formData = new FormData();
//     formData.append('mainfile', mainFileCourse);
//     fetch(`http://localhost:3000/api/products/uploads/mainfile/`, {
//         method: 'POST',
//         body: formData
//     }).then(res => res.json()).then(resss => {
//         if (resss.status == 200) {
//             toastr.success("دوره با موفقیت آپلود شد.");
//         } else {
//             toastr.error('دوره معرفی آپلود نشد!');
//         }
//         localStorage.setItem('mainfile', JSON.stringify(resss));
//     });
// });