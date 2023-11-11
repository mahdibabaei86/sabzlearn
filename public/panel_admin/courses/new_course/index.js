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
let persent_Off_course = document.querySelector('.persent_Off_course');
let description_short_course = document.querySelector('.description_short_course');
let description_long_course = document.querySelector('.description_long_course');
let input_upload_box_video = document.querySelector('.input_upload_box_video');
let btn_create_course = document.querySelector('.btn_create_course');
let url = 'http://localhost:3000/';

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
});

function removeLocaloathFile(name) {
    localStorage.removeItem(name);
}

function GetLocaloathFile(name, removeLocaloathFile, property) {
    setTimeout(function () {
        removeLocaloathFile(name);
    }, 500);
    let resultLocal = JSON.parse(localStorage.getItem(name));
    let pattern = /^C:\\xampp\\htdocs\\/;
    resultLocal[property] = resultLocal[property].replace(pattern, 'http://localhost/');
    return resultLocal
}

function courseCreated(e) {
    let now = new Date();
    e.preventDefault();
    let charCountDescription = description_long_course.value.split('').length
    let newCourse = {
        symbol: symbolInput.value,
        name: name_input.value,
        price: price_input.value,
        videoShort: GetLocaloathFile('path_Introduction_video', removeLocaloathFile, 'urlVideo'),
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
        cover: GetLocaloathFile('coversPath', removeLocaloathFile, 'urlCover'),
        descriptionLong: description_long_course.value,
        descriptionShort: description_short_course.value,
        videosFile: GetLocaloathFile('mainfile', removeLocaloathFile, 'urlmainfile')
    }

    fetch(`${url}api/admin/products/add/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify(newCourse)
    }).then(res => res.json())
        .then(res => {
            if (res.status == 200) {
                toastr.success("دوره با موفقیت منتشر شد");
            } else {
                toastr.error('دوره منتشر نشد');
            }
            setTimeout(function () {
                location.reload();
            }, 5000)
        })

}

btn_create_course.addEventListener('click', courseCreated);

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

Introduction_video.addEventListener('change', () => {
    let IntroductionFile = Introduction_video.files[0];
    let formData = new FormData();
    formData.append('file', IntroductionFile);
    fetch(`${url}api/admin/products/uploads/`, {
        method: 'POST',
        headers: {
            "Authorization": token
        },
        body: formData
    }).then(res => res.json()).then(resss => {
        if (resss.status == 200) {
            toastr.success("ویدویی معرفی با موفقیت آپلود شد.");
            console.log(resss);
        } else {
            toastr.error('ویدویی معرفی آپلود نشد!');
        }
        localStorage.setItem('path_Introduction_video', JSON.stringify(resss));
    });
});

cover_picture_course.addEventListener('change', () => {
    let coverPictureCourse = cover_picture_course.files[0];
    let formData = new FormData();
    formData.append('cover', coverPictureCourse);
    fetch(`${url}api/admin/products/uploads/covers/`, {
        method: 'POST',
        headers: {
            "Authorization": token
        },
        body: formData
    }).then(res => res.json()).then(resss => {
        if (resss.status == 200) {
            toastr.success("کاور با موفقیت آپلود شد.");
        } else {
            toastr.error('کاور معرفی آپلود نشد!');
        }
        localStorage.setItem('coversPath', JSON.stringify(resss));
    });
});

fileInput.addEventListener('change', () => {
    let mainFileCourse = fileInput.files[0];
    let formData = new FormData();
    formData.append('mainfile', mainFileCourse);
    fetch(`${url}api/admin/products/uploads/mainfile/`, {
        method: 'POST',
        headers: {
            "Authorization": token
        },
        body: formData
    }).then(res => res.json()).then(resss => {
        if (resss.status == 200) {
            toastr.success("دوره با موفقیت آپلود شد.");
            console.log(resss);
        } else {
            toastr.error('دوره معرفی آپلود نشد!');
        }
        localStorage.setItem('mainfile', JSON.stringify(resss));
    });
});