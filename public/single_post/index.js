let searchId = location.search;
let urlSeqarchParams = new URLSearchParams(searchId).get('id');
let body = document.querySelector('body');
let userInfo = JSON.parse(localStorage.getItem('user'));
let profile_header_user = document.querySelector('#profile_header_user');
let profile_dropdown_user = document.querySelector('#profile_dropdown_user');
let btn_header_main = document.querySelector('.btn_header_main');
let name_user_account = document.querySelector('.name_user_account');
let exit_panel = document.querySelector('#exit_panel');
let no_off_price = document.querySelector('.no_off_price del');
let description_box_commnet = document.querySelector('#description_box_commnet');
let name_course = document.querySelector('.name_course_producrs');
let count_wallet_user = document.querySelector('.count_wallet_user');
let percent_count = document.querySelector('.percent_count');
let meter = document.querySelector('.meter .width');
let prerequisite = document.querySelector('#prerequisite');
let count_student_course = document.querySelector('#count_student_course');
let price_oneCorse = document.querySelector('#price_oneCorse');
let description_short_course = document.querySelector('.description_short_course');
let left_header_product = document.querySelector('.left_header_product');
let status_courses = document.querySelector('#status_courses');
let time_hour = document.querySelector('#time_hour');
let last_updated = document.querySelector('#last_updated');
let status_support = document.querySelector('#status_support');
let watcher_type = document.querySelector('#watcher_type');
let last_one_course = document.querySelector('.last_one_course');
let btnBuyCourse = document.querySelector('.right_box_btn button');
let container = document.querySelector('.container');
let avatar_box_image = document.querySelector('.header_box_comment img');
let send_comment = document.querySelector('#send_comment');
let cancel_cooment_btn = document.querySelector('.cancel_cooment_btn');
let send_comment_btn = document.querySelector('.send_comment_btn');
let input_short_url = document.querySelector('.input_short_url');
let btn_toggle_hamberger = document.querySelector('.btn_toggle_hamberger');
let input_search_nav = document.querySelector('.input_search_nav');
let description_article = document.querySelector('.description_article');
let cover_article = document.querySelector('.cover_article');
let title_article = document.querySelector('.title_article');
let athor_user = document.querySelector('.athor_user');
let clender_article = document.querySelector('.clender_article');
let logo_header = document.querySelector('#logo_header');
let statusCommnet = 'new';
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
    fetch(`${url}api/users/profile/${email}/`)
        .then(res => res.text())
        .then(res => {
            profile_header_user.src = res
            profile_dropdown_user.src = res
            avatar_box_image.src = res
        })
}

if (!userInfo) {
    btn_header_main.addEventListener('click', () => {
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
    document.querySelector('.name_user_box_comment').innerHTML = userInfo.username
    name_user_account.innerHTML = `${userInfo.name} ${userInfo.family}`
    count_wallet_user.innerHTML = 'موجودی: ' + userInfo.wallet + ' ' + 'تومان'
    GetProfileUser(userInfo.email);
    btn_header_main.remove();
}

window.addEventListener('DOMContentLoaded', () => {
    appendDomArticle();
    appedDomComment();
    input_short_url.value = location.href;
});

send_comment.addEventListener('click', () => {
    if (userInfo) {
        document.querySelector('.box_send_comment').classList.add('active_box_send_comment');
        statusCommnet = 'new'
        localStorage.setItem('statusCommnet', statusCommnet);
    } else {
        toastr.error('ابتدا وارد وبسایت شوید');
    }
});

cancel_cooment_btn.addEventListener('click', () => {
    description_box_commnet.value = ''
    localStorage.removeItem('toReplay');
    document.querySelector('.box_send_comment').classList.remove('active_box_send_comment');
});

send_comment_btn.addEventListener('click', () => {
    let now = new Date();
    if (description_box_commnet.value < 5) {
        toastr.error('متن دیدگاه باید بیشتر از 5 کاراکتر باشد!');
    } else {
        if (statusCommnet == 'new') {
            let newComment = {
                id: generateUniqueCharacters(5),
                article: urlSeqarchParams,
                user: {
                    username: userInfo.username,
                    type: userInfo.type,
                    email: userInfo.email
                },
                history: `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`,
                description: description_box_commnet.value.replace(/\n/g, ' '),
                replays: [],
            }
            description_box_commnet.value = ''
            fetch(`${url}api/blog/new-comment/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newComment)
            })
                .then(res => res.text())
                .then(go => {
                    if (go == 'SuccessFully Send Comment') {
                        toastr.success('سپاس از ارسال نظر');
                        setTimeout(function () {
                            location.reload();
                        }, 3000)
                    } else {
                        toastr.error('شما مجاز به ارسال این کامنت نمیباشید');
                    }
                }).catch(() => {
                    toastr.error('خطا در ارسال نظر');
                })
        } else {
            sendreplayComment();
        }

    }
});


function appedDomComment() {
    fetch(`${url}api/blog/all-comments/${urlSeqarchParams}/`)
        .then(res => res.json())
        .then(go => {
            let commnets = JSON.parse(go[0]["Comments"]);
            if (!commnets.length) {
                document.querySelector('.commects').insertAdjacentHTML('beforeend', `<div class="alert-danger">
                <span>اولین نفری باشید که نظر ثبت میکنید :)</span>
                <i class='bx bxs-info-circle'></i>
                </div>`)
            } else {
                commnets.forEach(comment => {
                    if ((comment.replays).length) {
                        document.querySelector('.commects').insertAdjacentHTML('beforeend', `
                        <div class="comment" id="${comment.id}" data-id="${comment.id}">
                                    <span onclick="replayComment(this)"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                                            <style>
                                                svg {
                                                    fill: #5c5c5c
                                                }
                                            </style>
                                            <path d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z"></path>
                                        </svg></span>
                                    <div class="right_comment">
                                        <img src="${comment.user.profile}" class="avatar">
                                        <span class="status_type">${comment.user.type == 1 ? 'مدیریت' : 'دانشجو'}</span>
                                    </div>
                                    <div class="left_comment">
                                        <h2 class="name_user_comment">${comment.user.username}</h2>
                                        <span class="history_new_comment">${comment.history}</span>
                                        <p class="description_comment">${comment.description}</p>
                                    </div>
                                </div>
                        `)
                    } else {
                        document.querySelector('.commects').insertAdjacentHTML('beforeend', `
                        <div class="comment" data-id="${comment.id}">
                                    <span onclick="replayComment(this)"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                                            <style>
                                                svg {
                                                    fill: #5c5c5c
                                                }
                                            </style>
                                            <path d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z"></path>
                                        </svg></span>
                                    <div class="right_comment">
                                        <img src="${comment.user.profile}" class="avatar">
                                        <span class="status_type">${comment.user.type == 1 ? 'مدیریت' : 'دانشجو'}</span>
                                    </div>
                                    <div class="left_comment">
                                        <h2 class="name_user_comment">${comment.user.username}</h2>
                                        <span class="history_new_comment">${comment.history}</span>
                                        <p class="description_comment">${comment.description}</p>
                                    </div>
                                </div >
                        `);
                    }
                });
                appendDomReplay();
            }
        })
}

document.querySelector('.bxs-copy').addEventListener('click', () => {
    (input_short_url).select();
    navigator.clipboard.writeText(input_short_url.value);
    toastr.success('با موفقیت کپی شد');
})

function replayComment(info) {
    if (userInfo) {
        document.querySelector('.box_send_comment').classList.add('active_box_send_comment');
        statusCommnet = 'replay';
        localStorage.setItem('toReplay', JSON.stringify(info.parentElement.dataset.id));
    } else {
        toastr.error('ابتدا وارد وبسایت شوید');
    }
}

function sendreplayComment() {
    let now = new Date();
    let commentReplayFile = {
        id: generateUniqueCharacters(5),
        article: urlSeqarchParams,
        resiveReplay: JSON.parse(localStorage.getItem('toReplay')),
        user: {
            username: userInfo.username,
            type: userInfo.type,
            email: userInfo.email
        },
        history: `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`,
        description: description_box_commnet.value.replace(/\n/g, ' ')
    }

    fetch(`${url}api/blog/replay-comment/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(commentReplayFile)
    }).then(res => res.text())
        .then(go => {
            toastr.success(`پاسخ برای کاربر ثبت شد`);
            setTimeout(function () {
                localStorage.removeItem('toReplay');
                location.reload();
            }, 3000)
        })
}

function appendDomReplay() {
    fetch(`${url}api/blog/all-comments/${urlSeqarchParams}/`)
        .then(res => res.json())
        .then(go => {
            let commnets = JSON.parse(go[0]["Comments"]);
            let findReplays = commnets.filter(comment => {
                return (comment.replays).length !== 0
            })

            findReplays.forEach(comment => {
                let commentDom = document.querySelector(`#${comment.id} .left_comment`);
                (comment.replays).forEach(replay => {
                    commentDom.insertAdjacentHTML('beforeend', `
                    <div class="replay_comment">
                    <div class="right_comment">
                        <img src="${replay.user.profile}"
                            class="avatar">
                        <span class="status_type">${replay.user.type == 1 ? 'مدیریت' : 'دانشجو'}</span>
                    </div>
                    <div class="left_comment">
                        <h2 class="name_user_comment">${replay.user.username}</h2>
                        <span class="history_new_comment">${replay.history}</span>
                        <p class="description_comment">${replay.description}</p>
                    </div>
                </div>
                    `);
                })
            })
        })
}

function generateUniqueCharacters(count) {
    let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let uniqueChars = '';

    while (uniqueChars.length < count) {
        let randomChar = charset.charAt(Math.floor(Math.random() * charset.length));
        if (uniqueChars.indexOf(randomChar) === -1) {
            uniqueChars += randomChar;
        }
    }

    return uniqueChars;
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
            fetch(`${url}api/products/search/${e.target.value}/`)
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

function appendDomArticle() {
    fetch(`${url}api/blog/view-article/${urlSeqarchParams}/`)
        .then(res => res.json())
        .then(go => {
            let main = go[0];
            document.title = main.title;
            cover_article.src = ((main.cover).slice(1, -1));
            description_article.innerHTML = main.description
            title_article.innerHTML = main.title
            athor_user.innerHTML = `<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 ml-0.5" width="24" height="24"><defs><symbol id="user" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5px" stroke="#000000">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" stroke="#000000" fill="none" stroke-width="1.5px"></path>
        </symbol></defs>
                                        <g>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" stroke="#000000" fill="none" stroke-width="1.5px"></path>
        </g>
                                    </svg><span>تیم تولید محتوا سبزلرن</span>`;
            clender_article.innerHTML = `<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 ml-0.5" width="24" height="24"><defs><symbol id="calendar-days" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5px" stroke="#000000">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" stroke="#000000" fill="none" stroke-width="1.5px"></path>
        </symbol></defs>
                                    <g>
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" stroke="#000000" fill="none" stroke-width="1.5px"></path>
        </g>
                                </svg><span>${main.clendare}</span>`;
        })
    // new Article
    fetch(`${url}api/blog/all/`)
        .then(res => res.json())
        .then(go => {
            newArticleList(go);
        })
}

function newArticleList(articles) {
    document.querySelector('.container_new_article').innerHTML = '';
    document.querySelector('.container_category_article').innerHTML = '';
    // new article dom
    articles.slice(-5).forEach(post => {
        document.querySelector('.container_new_article').insertAdjacentHTML('beforeend', `
        <span data-id="${post.id}" onclick="getviewArticle(this)">${post.title}</span>
        `);
    })
    // category dom
    articles.forEach(post => {
        document.querySelector('.container_category_article').insertAdjacentHTML('beforeend', `
    <li data-id="${post.id}" onclick="getviewArticle(this)"><i class='bx bxs-left-arrow'></i><span>${post.category}</span></li>
    `)
    })
}

function getviewArticle(e) {
    let symbolArticle = e.dataset.id
    location.href = `./index.html?id=${symbolArticle}`
}

logo_header.addEventListener('click', () => location.href = `${location.protocol + '//' + location.host + '/sabzlearn' + '/public/'}`);