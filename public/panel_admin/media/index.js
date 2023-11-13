let SelectFolder = document.querySelector('#SelectFolder');
let container_medias_gallery = document.querySelector('.container_medias_gallery');
let token = localStorage.getItem('token');
let url = 'http://localhost:3000/';

window.addEventListener('DOMContentLoaded', () => {
    container_medias_gallery.innerHTML = '';
    container_medias_gallery.insertAdjacentHTML('beforeend', `
        <div class="alert-danger">
        <span>از منو بالا دسته بندی را انتخاب کن.</span>
        <i class="bx bxs-info-circle"></i>
        </div>
                `);
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
    }
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
                    container_medias_gallery.insertAdjacentHTML('beforeend', `<div class="meida_box">
                    <div class="type_media" title="image">
                        <i class="bx bxs-image-alt"></i>
                    </div>
                    <img src="../../../backend/uploads/${e.target.value}/${file}">
                </div>`);
                } else if (e.target.value == 'IntroductionVideoCourse') {
                    container_medias_gallery.insertAdjacentHTML('beforeend', `<div class="meida_box">
                    <div class="type_media" title="mp4/video">
                        <i class="bx bxs-videos"></i>
                    </div>
                    <video src="../../../backend/uploads/${e.target.value}/${file}" muted="" autoplay=""></video>
                </div>`);
                } else {
                    container_medias_gallery.insertAdjacentHTML('beforeend', `<div class="meida_box_zip">
                    <img src="../../../Images/rar_logo.png">
                </div>`);
                }
            });
        })
});