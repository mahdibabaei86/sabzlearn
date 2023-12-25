let container_boxs_last_course = document.querySelector('.container_boxs_last_course');
let swiperWrapper = document.querySelector('#swipeerCustom');
let container_popular_courses = document.querySelector('.container_popular_courses');
let userInfo = JSON.parse(localStorage.getItem('user'));
let profile_header_user = document.querySelector('#profile_header_user');
let profile_dropdown_user = document.querySelector('#profile_dropdown_user');
let btn_header_main = document.querySelector('.btn_header_main');
let name_user_account = document.querySelector('.name_user_account');
let exit_panel = document.querySelector('#exit_panel');
let count_wallet_user = document.querySelector('.count_wallet_user');
let input_search_nav = document.querySelector('.input_search_nav');
let logo_header = document.querySelector('#logo_header');
let btn_toggle_hamberger = document.querySelector('.btn_toggle_hamberger');
let body = document.querySelector('body');
let url = 'http://localhost:3000/';
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 4,
    spaceBetween: 1,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});

function formatPrice(price, persentOff) {
    let priceOff = price.split(',').join('') - ((price.split(',').join('') * persentOff) / 100);
    let formater = priceOff.toLocaleString('fa-IR');
    return formater
}


exit_panel.addEventListener('click', () => {
    localStorage.removeItem('user');
    location.reload();
});

profile_header_user.addEventListener('click', () => {
    body.classList.toggle('blur_black');
    if (body.className) {
        document.querySelector('.dropdown_memu_profile_user').style.display = 'block';
    } else {
        document.querySelector('.dropdown_memu_profile_user').style.display = 'none';
    }
});

function GetProfileUser(email) {
    fetch(`${url}api/public/users/profile/${email}/`)
        .then(res => res.text())
        .then(res => {
            profile_header_user.src = res
            profile_dropdown_user.src = res
        })
}

if (!userInfo) {
    btn_header_main.addEventListener('click', () => {
        location.href = './auth/index.html'
    });
}

document.querySelector('#panel_btn_li_user_header').addEventListener('click', () => {
    if (userInfo.type == '1') {
        location.href = './panel_admin/home/home.html'
    } else {
        location.href = './panel_user/home/home.html'
    }
});

document.querySelector('#panel_my_course_btn_li_user_header').addEventListener('click', () => {
    if (userInfo.type == '1') {
        location.href = './panel_admin/courses/home.html'
    } else {
        location.href = './panel_user/my_courses/home.html'
    }
});

document.querySelector('#tcket_support').addEventListener('click', () => {
    if (userInfo.type == '1') {
        location.href = './panel_admin/tickets/'
    } else {
        location.href = './panel_user/tickets/'
    }
});

window.addEventListener('DOMContentLoaded', () => {
    if (userInfo) {
        name_user_account.innerHTML = `${userInfo.name} ${userInfo.family}`
        count_wallet_user.innerHTML = 'موجودی: ' + userInfo.wallet + ' ' + 'تومان'
        GetProfileUser(userInfo.email);
        btn_header_main.remove();
    } else {
        profile_header_user.parentElement.style.display = 'none';
    }
    renderListNav();
    appendNotification();
    appendPost();
    container_boxs_last_course.innerHTML = ''
    fetch(`${url}api/public/products/all/`)
        .then(res => res.json())
        .then(res => {
            // end Course
            res.slice(-8).forEach(product => {
                container_boxs_last_course.insertAdjacentHTML('beforeend', `<div class="box_course" data-symbol="${product.symbol}" onclick="getviewCourse(this)" data-aos="flip-right">
                <span class="offer_course" style="display:${!product.persentOff == '0' ? 'block' : 'none'}">${product.persentOff}%</span>
                <img src="${product.cover.slice(1, -1)}" style="width: 260px;border-radius: 9px;">
                <span class="tag_category">${product.category}</span>
                <p class="name_course">${product.name}</p>
                <p class="description_course">${(product.shortdes).slice(0, 65)}...</p>
                <div class="info_course">
                    <div class="right_info_course">
                        <a href="#" class="link_page_techer_course">
                            <span class="name_techaer_course">${product.teacher}</span>
                            <i class="bx bxs-user"></i>
                        </a>
                    </div>
                    <div class="left_info_course">
                        <span class="time_course">${product.time}</span>
                        <i class="bx bx-time"></i>
                    </div>
                </div>
                <div class="bottom_box_course">
                    <div class="bottom_box_course_right">
                        <span class="counter_sell">${Array(product.student)[0].split(',').length - 1}</span>
                        <i class="bx bx-user-plus"></i>
                    </div>
                    <div class="bottom_box_course_left">
                        <div class="price-container">
                        <span class="price-value" style="display:${product.price == '0' ? 'block' : 'none'}">رایگان!</span>
                            <span class="price-value" style="display:${product.price == '0' ? 'none' : 'block'}">${formatPrice(product.price, product.persentOff)}</span>
                            <span class="price-label" style="display:${product.price == '0' ? 'none' : 'block'}"></span>
                        </div>
                    </div>
                </div>
            </div>`);
            });
            // new Course Swipper
            let newCourseArray = res.slice(-8);
            swiperWrapper.innerHTML = ''
            newCourseArray.forEach(product => {
                swiperWrapper.insertAdjacentHTML('beforeend', `<div class="swiper-slide swiper-slide-active" role="group" aria-label="1 / 5" style="width: 305px; margin-left: 1px;">
                <div class="box_course" data-symbol="${product.symbol}" onclick="getviewCourse(this)" data-aos="flip-right">
                <span class="offer_course" style="display:${!product.persentOff == '0' ? 'block' : 'none'}">${product.persentOff}%</span>
                <img src="${product.cover.slice(1, -1)}" style="width: 260px;border-radius: 9px;">
                <span class="tag_category">${product.category}</span>
                <p class="name_course">${product.name}</p>
                <p class="description_course">${(product.shortdes).slice(0, 68)}</p>
                <div class="info_course">
                    <div class="right_info_course">
                        <a href="#" class="link_page_techer_course">
                            <span class="name_techaer_course">${product.teacher}</span>
                            <i class="bx bxs-user"></i>
                        </a>
                    </div>
                    <div class="left_info_course">
                        <span class="time_course">${product.time}</span>
                        <i class="bx bx-time"></i>
                    </div>
                </div>
                <div class="bottom_box_course">
                    <div class="bottom_box_course_right">
                        <span class="counter_sell">${Array(product.student)[0].split(',').length - 1}</span>
                        <i class="bx bx-user-plus"></i>
                    </div>
                    <div class="bottom_box_course_left">
                    <div class="price-container">
                    <span class="price-value" style="display:${product.price == '0' ? 'block' : 'none'}">رایگان!</span>
                        <span class="price-value" style="display:${product.price == '0' ? 'none' : 'block'}">${formatPrice(product.price, product.persentOff)}</span>
                        <span class="price-label" style="display:${product.price == '0' ? 'none' : 'block'}"></span>
                    </div>
                    </div>
                </div>
            </div>
            </div>`)
            })
            // papular Course
            let Courses = [];
            res.forEach(product => {
                product.student = (Array(product.student)[0].split(',').length - 1);
                Courses.push(product)
            })
            Courses.sort(function (a, b) {
                return b.student - a.student
            })
            container_popular_courses.innerHTML = ''
            Courses.slice(-8).forEach(product => {
                container_popular_courses.insertAdjacentHTML('beforeend', `<div class="box_course" data-symbol="${product.symbol}" onclick="getviewCourse(this)" data-aos="flip-right">
                <span class="offer_course" style="display:${!product.persentOff == '0' ? 'block' : 'none'}">${product.persentOff}%</span>
                <img src="${product.cover.slice(1, -1)}" style="width: 260px;border-radius: 9px;">
                <span class="tag_category">${product.category}</span>
                <p class="name_course">${product.name}</p>
                <p class="description_course">${(product.shortdes).slice(0, 68)}</p>
                <div class="info_course">
                    <div class="right_info_course">
                        <a href="#" class="link_page_techer_course">
                            <span class="name_techaer_course">${product.teacher}</span>
                            <i class="bx bxs-user"></i>
                        </a>
                    </div>
                    <div class="left_info_course">
                        <span class="time_course">${product.time}</span>
                        <i class="bx bx-time"></i>
                    </div>
                </div>
                <div class="bottom_box_course">
                    <div class="bottom_box_course_right">
                        <span class="counter_sell">${product.student}</span>
                        <i class="bx bx-user-plus"></i>
                    </div>
                    <div class="bottom_box_course_left">
                    <div class="price-container">
                    <span class="price-value" style="display:${product.price == '0' ? 'block' : 'none'}">رایگان!</span>
                        <span class="price-value" style="display:${product.price == '0' ? 'none' : 'block'}">${formatPrice(product.price, product.persentOff)}</span>
                        <span class="price-label" style="display:${product.price == '0' ? 'none' : 'block'}"></span>
                    </div>
                    </div>
                </div>
            </div>`);
            });
        })
});

function getviewCourse(e) {
    let symbolCourse = e.dataset.symbol
    location.href = `single_course/index.html?symbol=${symbolCourse}`
}

function getviewArticle(e) {
    let symbolArticle = e.dataset.id
    location.href = `./single_post/index.html?id=${symbolArticle}`
}

input_search_nav.addEventListener('keyup', (e) => {
    if (e.key == 'Enter') {
        if (e.target.value) {
            fetch(`${url}api/public/products/search/${e.target.value}/`)
                .then(res => res.json())
                .then(go => {
                    document.querySelector('.container_result_search').innerHTML = '';
                    if (go.length) {
                        go.forEach(course => {
                            document.querySelector('.container_result_search').insertAdjacentHTML('beforeend', `
                                    <div class="course_search" onclick="getviewCourse(this)" data-symbol="${course.symbol}">
                                        <img src="${(course.cover).replace('"', '')}" class="cover_course_last_one">
                                        <div class="info_course_last">
                                            <h3 class="name_course">${course.name}</h3>
                                            <p class="description_course">${(course.description).slice(0, 125)}...</p>
                                        </div>
                                    </div>
                                    `)
                        });
                    } else {
                        document.querySelector('.container_result_search').insertAdjacentHTML('beforeend', `
                                    <div class="not_result_search">
                                    <img src="../Images/search_no_result.png">
                                    </div>
                                    `)
                    }
                    setAnimation();
                });
        } else {
            document.querySelector('.container_result_search').innerHTML = ''
        }
    }
});

// animation result search navbar
function setAnimation() {
    anime({
        targets: '.course_search',
        translateY: 20,
        delay: anime.stagger(190) // increase delay by 100ms for each elements.
    });
}

btn_toggle_hamberger.addEventListener('click', () => {
    body.classList.add('blur_black');
    document.querySelector('.menu_hamberger_right').style.transform = 'translateX(0px)';
});

// close btn menu mobile
document.querySelector('.bx-x').addEventListener('click', () => {
    body.classList.remove('blur_black');
    document.querySelector('.menu_hamberger_right').style.transform = 'translateX(332px)';
});

function appendPost() {
    fetch(`${url}api/public/blog/all/`)
        .then(res => res.json())
        .then(res => {
            document.querySelector('.container_blog_and_post').innerHTML = ''
            res.slice(-4).forEach(post => {
                let cover = (post.cover).slice(1, -1).replace(/C:\\xampp\\htdocs\\/, "http://localhost/");
                document.querySelector('.container_blog_and_post').insertAdjacentHTML('beforeend', `
                <div class="box_course box_post_article" data-id="${post.id}" onclick="getviewArticle(this)" data-aos="flip-right">
                <img src="${cover}" style="width: 100%;border-radius: 9px;">
                <span class="tag_category">${post.category}</span>
                <p class="name_course">${post.title}</p>
                <p class="description_course">${(post.description).slice(1, 165)}...</p >
                <div class="info_course" style="border-top: 1px solid #c0c0c0;
                margin-top: 5px;
                padding-top: 11px;border-bottom:none !important;">
                    <div class="right_info_course">
                        <a href="#" class="link_page_techer_course">
                            <span class="name_techaer_course">نوسینده سبزلرن</span>
                            <i class="bx bxs-user"></i>
                        </a>
                    </div>
                    <div class="left_info_course">
                        <span class="time_course">${post.clendare}</span>
                        <i class="bx bx-time"></i>
                    </div>
                </div>
            </div >
                `);
            });
        })
}

function appendNotification() {
    fetch(`${url}api/public/notification/get/`)
        .then(res => res.json())
        .then(go => {
            if (go[0].status == 'active') {
                document.querySelector('.txt_notification').innerHTML = go[0].message;
                document.querySelector('.container_notification').style.visibility = 'visible';
            } else {
                document.querySelector('.title_main_one').style.marginTop = '-60px';
            }
        })
}

function renderListNav() {
    let frontNav = document.querySelector('.frontNav');
    fetch(`http://localhost:3000/api/public/products/all/`)
        .then(res => res.json())
        .then(go => {
            let fetchFrontEnd = go.filter(course => {
                return course.category == "فرانت اند"
            });
            fetchFrontEnd.forEach(course => {
                frontNav.insertAdjacentHTML('beforeend', `
                <li class="li_menu_mega_main" data-symbol="${course.symbol}" onclick="getviewCourse(this)">${course.name}</li>
                `);
            })
        })
}

logo_header.addEventListener('click', () => location.href = `${location.protocol + '//' + location.host + location.pathname}`);