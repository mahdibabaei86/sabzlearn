let body = document.querySelector('body');
let userInfo = JSON.parse(localStorage.getItem('user'));
let profile_header_user = document.querySelector('#profile_header_user');
let profile_dropdown_user = document.querySelector('#profile_dropdown_user');
let btn_toggle_hamberger = document.querySelector('.btn_toggle_hamberger');
let input_search_nav = document.querySelector('.input_search_nav');
let container_list_courses = document.querySelector('.container_list_courses');
let checkBoxFree = document.querySelector('.inputCheckboxFree');
let search_courses = document.querySelector('.search_courses');
let logo_header = document.querySelector('#logo_header');
let statusCommnet = 'new';
let categoryArray = [];
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

window.addEventListener('DOMContentLoaded', () => {
    renderAllCourse();
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
    document.querySelector('.btn_header_main').addEventListener('click', () => {
        location.href = '../auth/index.html'
    });
}
document.querySelector('#panel_btn_li_user_header').addEventListener('click', () => {
    if (userInfo.type == '1') {
        location.href = '../panel_admin/home/home.html'
    } else {
        location.href = '../panel_user/home/'
    }
});

document.querySelector('#panel_my_course_btn_li_user_header').addEventListener('click', () => {
    if (userInfo.type == '1') {
        location.href = '../panel_admin/courses/home.html'
    } else {
        location.href = '../panel_user/my_courses/'
    }
});

document.querySelector('#tcket_support').addEventListener('click', () => {
    if (userInfo.type == '1') {
        location.href = '../panel_admin/tickets/'
    } else {
        location.href = '../panel_user/tickets/'
    }
});

if (userInfo) {
    document.querySelector('.count_wallet_user').innerHTML = 'موجودی: ' + userInfo.wallet + ' ' + 'تومان'
    GetProfileUser(userInfo.email);
    document.querySelector('.btn_header_main').remove();
    document.querySelector('.name_user_account').innerHTML = userInfo.username;
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
                                    <img src="../../Images/search_no_result.png">
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

function getviewArticle(e) {
    let symbolArticle = e.dataset.id
    location.href = `./index.html?id=${symbolArticle}`
}

search_courses.addEventListener('keyup', (e) => {
    if (e.key == 'Enter') {
        if (e.target.value) {
            fetch(`${url}api/public/products/search/${e.target.value}/`)
                .then(res => res.json())
                .then(go => {
                    container_list_courses.innerHTML = '';
                    go.forEach(course => {
                        container_list_courses.insertAdjacentHTML('beforeend', `
                        <div class="box_course" data-symbol="${course.symbol}" onclick="getviewCourse(this)" data-aos="flip-right">
                        <span class="offer_course" style="display:${!course.persentOff == '0' ? 'block' : 'none'}">${course.persentOff}%</span>
                        <img src="${(course.cover).slice(1, -1)}" style="width: 260px;border-radius: 9px;">
                        <span class="tag_category">${course.category}</span>
                        <p class="name_course">${course.name}</p>
                        <p class="description_course">${(course.description).slice(1, 109)}...</p>
                        <div class="info_course">
                            <div class="right_info_course">
                                <a href="#" class="link_page_techer_course">
                                    <span class="name_techaer_course">${course.teacher}</span>
                                    <i class="bx bxs-user"></i>
                                </a>
                            </div>
                            <div class="left_info_course">
                                <span class="time_course">${course.time}</span>
                                <i class="bx bx-time"></i>
                            </div>
                        </div>
                        <div class="bottom_box_course">
                            <div class="bottom_box_course_right">
                                <span class="counter_sell">${Array(course.student)[0].split(',').length - 1}</span>
                                <i class="bx bx-user-plus"></i>
                            </div>
                            <div class="bottom_box_course_left">
                                <div class="price-container">
                                <span class="price-value" style="display:${course.price == '0' ? 'block' : 'none'}">رایگان!</span>
                                <span class="price-value" style="display:${course.price == '0' ? 'none' : 'block'}">${formatPrice(course.price, course.persentOff)}</span>
                                <span class="price-label" style="display:${course.price == '0' ? 'none' : 'block'}"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                        `)
                    });
                })
        }
    }
});

checkBoxFree.addEventListener('change', (e) => {
    if (e.target.checked) {
        freeCourseRender();
    } else {
        location.reload();
    }
});

function formatPrice(price, persentOff) {
    let priceOff = price.split(',').join('') - ((price.split(',').join('') * persentOff) / 100);
    let formater = priceOff.toLocaleString('fa-IR');
    return formater
}

function convertPrice(price, persentOff) {
    let priceOff = price.split(',').join('') - ((price.split(',').join('') * persentOff) / 100);
    return priceOff
}

function getviewCourse(e) {
    let symbolCourse = e.dataset.symbol
    location.href = `../single_course/index.html?symbol=${symbolCourse}`
}

function freeCourseRender() {
    fetch(`${url}api/public/products/all/`)
        .then(res => res.json())
        .then(go => {
            let findFreeCourse = go.filter(course => {
                return course.price == '0'
            });
            container_list_courses.innerHTML = '';
            findFreeCourse.forEach(course => {
                container_list_courses.insertAdjacentHTML('beforeend', `
                <div class="box_course" data-symbol="${course.symbol}" onclick="getviewCourse(this)" data-aos="flip-right">
                        <span class="offer_course" style="display:${!course.persentOff == '0' ? 'block' : 'none'}">${course.persentOff}%</span>
                        <img src="${(course.cover).slice(1, -1)}" style="width: 260px;border-radius: 9px;">
                        <span class="tag_category">${course.category}</span>
                        <p class="name_course">${course.name}</p>
                        <p class="description_course">${(course.description).slice(1, 109)}...</p>
                        <div class="info_course">
                            <div class="right_info_course">
                                <a href="#" class="link_page_techer_course">
                                    <span class="name_techaer_course">${course.teacher}</span>
                                    <i class="bx bxs-user"></i>
                                </a>
                            </div>
                            <div class="left_info_course">
                                <span class="time_course">${course.time}</span>
                                <i class="bx bx-time"></i>
                            </div>
                        </div>
                        <div class="bottom_box_course">
                            <div class="bottom_box_course_right">
                                <span class="counter_sell">${Array(course.student)[0].split(',').length - 1}</span>
                                <i class="bx bx-user-plus"></i>
                            </div>
                            <div class="bottom_box_course_left">
                                <div class="price-container">
                                <span class="price-value" style="display:${course.price == '0' ? 'block' : 'none'}">رایگان!</span>
                                <span class="price-value" style="display:${course.price == '0' ? 'none' : 'block'}">${formatPrice(course.price, course.persentOff)}</span>
                                <span class="price-label" style="display:${course.price == '0' ? 'none' : 'block'}"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
            })
        })
}

document.querySelectorAll('.list_ul_ordered li').forEach(li => {
    li.addEventListener('click', (e) => {
        orderedCourse(e.target.id);
    });
})

function orderedCourse(order) {
    let orderElement = document.querySelector(`#${order}`);
    document.querySelectorAll('.list_ul_ordered li').forEach(li => {
        li.classList.remove('active-menu');
    })
    orderElement.classList.add('active-menu');
    fetch(`${url}api/public/products/all/`)
        .then(res => res.json())
        .then(go => {
            if (order == 'all') {
                renderAllCourse();
            } else if (order == 'cheap') {
                renderCheapCourse();
            } else if (order == 'expensive') {
                renderExpensiveCourse();
            }
        })
}

function renderCheapCourse() {
    fetch(`${url}api/public/products/all/`)
        .then(res => res.json())
        .then(go => {
            container_list_courses.innerHTML = '';
            let cheapCourse = go.sort(function (a, b) {
                return convertPrice(a.price, a.persentOff) - convertPrice(b.price, b.persentOff)
            });
            cheapCourse.forEach(course => {
                container_list_courses.insertAdjacentHTML('beforeend', `
            <div class="box_course" data-symbol="${course.symbol}" onclick="getviewCourse(this)" data-aos="flip-right">
                        <span class="offer_course" style="display:${!course.persentOff == '0' ? 'block' : 'none'}">${course.persentOff}%</span>
                        <img src="${(course.cover).slice(1, -1)}" style="width: 260px;border-radius: 9px;">
                        <span class="tag_category">${course.category}</span>
                        <p class="name_course">${course.name}</p>
                        <p class="description_course">${(course.description).slice(1, 109)}...</p>
                        <div class="info_course">
                            <div class="right_info_course">
                                <a href="#" class="link_page_techer_course">
                                    <span class="name_techaer_course">${course.teacher}</span>
                                    <i class="bx bxs-user"></i>
                                </a>
                            </div>
                            <div class="left_info_course">
                                <span class="time_course">${course.time}</span>
                                <i class="bx bx-time"></i>
                            </div>
                        </div>
                        <div class="bottom_box_course">
                            <div class="bottom_box_course_right">
                                <span class="counter_sell">${Array(course.student)[0].split(',').length - 1}</span>
                                <i class="bx bx-user-plus"></i>
                            </div>
                            <div class="bottom_box_course_left">
                                <div class="price-container">
                                <span class="price-value" style="display:${course.price == '0' ? 'block' : 'none'}">رایگان!</span>
                                <span class="price-value" style="display:${course.price == '0' ? 'none' : 'block'}">${formatPrice(course.price, course.persentOff)}</span>
                                <span class="price-label" style="display:${course.price == '0' ? 'none' : 'block'}"></span>
                                </div>
                            </div>
                        </div>
                    </div>
            `)
            });
        })
}

function renderExpensiveCourse() {
    fetch(`${url}api/public/products/all/`)
        .then(res => res.json())
        .then(go => {
            container_list_courses.innerHTML = '';
            let cheapCourse = go.sort(function (a, b) {
                return convertPrice(b.price, b.persentOff) - convertPrice(a.price, a.persentOff)
            });
            cheapCourse.forEach(course => {
                container_list_courses.insertAdjacentHTML('beforeend', `
            <div class="box_course" data-symbol="${course.symbol}" onclick="getviewCourse(this)" data-aos="flip-right">
                        <span class="offer_course" style="display:${!course.persentOff == '0' ? 'block' : 'none'}">${course.persentOff}%</span>
                        <img src="${(course.cover).slice(1, -1)}" style="width: 260px;border-radius: 9px;">
                        <span class="tag_category">${course.category}</span>
                        <p class="name_course">${course.name}</p>
                        <p class="description_course">${(course.description).slice(1, 109)}...</p>
                        <div class="info_course">
                            <div class="right_info_course">
                                <a href="#" class="link_page_techer_course">
                                    <span class="name_techaer_course">${course.teacher}</span>
                                    <i class="bx bxs-user"></i>
                                </a>
                            </div>
                            <div class="left_info_course">
                                <span class="time_course">${course.time}</span>
                                <i class="bx bx-time"></i>
                            </div>
                        </div>
                        <div class="bottom_box_course">
                            <div class="bottom_box_course_right">
                                <span class="counter_sell">${Array(course.student)[0].split(',').length - 1}</span>
                                <i class="bx bx-user-plus"></i>
                            </div>
                            <div class="bottom_box_course_left">
                                <div class="price-container">
                                <span class="price-value" style="display:${course.price == '0' ? 'block' : 'none'}">رایگان!</span>
                                <span class="price-value" style="display:${course.price == '0' ? 'none' : 'block'}">${formatPrice(course.price, course.persentOff)}</span>
                                <span class="price-label" style="display:${course.price == '0' ? 'none' : 'block'}"></span>
                                </div>
                            </div>
                        </div>
                    </div>
            `)
            });
        })
}

function renderAllCourse() {
    fetch(`${url}api/public/products/all/`)
        .then(res => res.json())
        .then(go => {
            container_list_courses.innerHTML = '';
            go.forEach(course => {
                container_list_courses.insertAdjacentHTML('beforeend', `
            <div class="box_course" data-symbol="${course.symbol}" onclick="getviewCourse(this)" data-aos="flip-right">
                        <span class="offer_course" style="display:${!course.persentOff == '0' ? 'block' : 'none'}">${course.persentOff}%</span>
                        <img src="${(course.cover).slice(1, -1)}" style="width: 260px;border-radius: 9px;">
                        <span class="tag_category">${course.category}</span>
                        <p class="name_course">${course.name}</p>
                        <p class="description_course">${(course.description).slice(1, 109)}...</p>
                        <div class="info_course">
                            <div class="right_info_course">
                                <a href="#" class="link_page_techer_course">
                                    <span class="name_techaer_course">${course.teacher}</span>
                                    <i class="bx bxs-user"></i>
                                </a>
                            </div>
                            <div class="left_info_course">
                                <span class="time_course">${course.time}</span>
                                <i class="bx bx-time"></i>
                            </div>
                        </div>
                        <div class="bottom_box_course">
                            <div class="bottom_box_course_right">
                                <span class="counter_sell">${Array(course.student)[0].split(',').length - 1}</span>
                                <i class="bx bx-user-plus"></i>
                            </div>
                            <div class="bottom_box_course_left">
                                <div class="price-container">
                                <span class="price-value" style="display:${course.price == '0' ? 'block' : 'none'}">رایگان!</span>
                                <span class="price-value" style="display:${course.price == '0' ? 'none' : 'block'}">${formatPrice(course.price, course.persentOff)}</span>
                                <span class="price-label" style="display:${course.price == '0' ? 'none' : 'block'}"></span>
                                </div>
                            </div>
                        </div>
                    </div>
            `)
            });
        })
}

function selectCategory(info) {
    let category = info.dataset.category;
    if (info.checked) {
        categoryArray.push(category);
    } else {
        let findCat = categoryArray.findIndex(cat => {
            return cat == category
        });
        categoryArray.splice(findCat, 1);
    }

    container_list_courses.innerHTML = '';
    categoryArray.forEach(category => {
        fetch(`${url}api/public/products/all/`)
            .then(res => res.json())
            .then(go => {
                let findCategory = go.filter(product => {
                    return product.category == category
                });
                findCategory.forEach(course => {
                    container_list_courses.insertAdjacentHTML('beforeend', `
                    <div class="box_course" data-symbol="${course.symbol}" onclick="getviewCourse(this)" data-aos="flip-right">
                        <span class="offer_course" style="display:${!course.persentOff == '0' ? 'block' : 'none'}">${course.persentOff}%</span>
                        <img src="${(course.cover).slice(1, -1)}" style="width: 260px;border-radius: 9px;">
                        <span class="tag_category">${course.category}</span>
                        <p class="name_course">${course.name}</p>
                        <p class="description_course">${(course.description).slice(1, 109)}...</p>
                        <div class="info_course">
                            <div class="right_info_course">
                                <a href="#" class="link_page_techer_course">
                                    <span class="name_techaer_course">${course.teacher}</span>
                                    <i class="bx bxs-user"></i>
                                </a>
                            </div>
                            <div class="left_info_course">
                                <span class="time_course">${course.time}</span>
                                <i class="bx bx-time"></i>
                            </div>
                        </div>
                        <div class="bottom_box_course">
                            <div class="bottom_box_course_right">
                                <span class="counter_sell">${Array(course.student)[0].split(',').length - 1}</span>
                                <i class="bx bx-user-plus"></i>
                            </div>
                            <div class="bottom_box_course_left">
                                <div class="price-container">
                                <span class="price-value" style="display:${course.price == '0' ? 'block' : 'none'}">رایگان!</span>
                                <span class="price-value" style="display:${course.price == '0' ? 'none' : 'block'}">${formatPrice(course.price, course.persentOff)}</span>
                                <span class="price-label" style="display:${course.price == '0' ? 'none' : 'block'}"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    `);
                });
            })
    });

}

logo_header.addEventListener('click', () => location.href = `${location.protocol + '//' + location.host + '/sabzlearn' + '/public/'}`);