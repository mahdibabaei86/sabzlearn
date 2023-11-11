const inputs = document.querySelectorAll("input");
const button = document.querySelector("button");
const counter_time = document.querySelector('#counter_time');
let InfoToken = localStorage.getItem('token');
let queryUrl = new URLSearchParams(location.search);
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

// iterate over all inputs
inputs.forEach((input, index1) => {
    input.addEventListener("keyup", (e) => {
        // This code gets the current input element and stores it in the currentInput variable
        // This code gets the next sibling element of the current input element and stores it in the nextInput variable
        // This code gets the previous sibling element of the current input element and stores it in the prevInput variable
        const currentInput = input,
            nextInput = input.nextElementSibling,
            prevInput = input.previousElementSibling;

        // if the value has more than one character then clear it
        if (currentInput.value.length > 1) {
            currentInput.value = "";
            return;
        }
        // if the next input is disabled and the current value is not empty
        //  enable the next input and focus on it
        if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
            nextInput.removeAttribute("disabled");
            nextInput.focus();
        }

        // if the backspace key is pressed
        if (e.key === "Backspace") {
            // iterate over all inputs again
            inputs.forEach((input, index2) => {
                // if the index1 of the current input is less than or equal to the index2 of the input in the outer loop
                // and the previous element exists, set the disabled attribute on the input and focus on the previous element
                if (index1 <= index2 && prevInput) {
                    input.setAttribute("disabled", true);
                    input.value = "";
                    prevInput.focus();
                }
            });
        }
        //if the fourth input( which index number is 3) is not empty and has not disable attribute then
        //add active class if not then remove the active class.
        if (!inputs[3].disabled && inputs[3].value !== "") {
            button.classList.add("active");
            return;
        }
        button.classList.remove("active");
    });
});

//focus the first input which index is 0 on window load
window.addEventListener("load", () => {
    createOTP();
    counterExpiresOTP();
    inputs[0].focus();
});

function createOTP() {
    fetch(`${url}api/auth/otp/created/${queryUrl.get('email')}/`, {
        method: 'GET',
        headers: {
            'Authorization': InfoToken
        }
    })
        .then(res => res.json())
        .then(go => {
            let now = new Date();
            now.setTime(now.getTime() + 60000);
            document.cookie = `otpCode=${go.otp};expires="${now}"`;
        })
}

function counterExpiresOTP() {
    let counters = 60
    setInterval(function () {
        if (counters >= 1) {
            counter_time.innerHTML = counters--
        } else {
            counter_time.innerHTML = `<a href="#" onclick="location.reload()">ارسال مجدد</a>`
        }
    }, 1000);
}

button.addEventListener('click', (e) => {
    e.preventDefault();
    let CODEOTP = '';
    for (let i = 0; i <= 3; i++) {
        CODEOTP += String(inputs[i].value);
    }
    fetch(`${url}api/auth/otp/vreify/${CODEOTP}/`, {
        method: 'GET',
        headers: {
            'Authorization': InfoToken
        }
    })
        .then(res => res.json())
        .then(go => {
            let mainCookie;
            document.cookie.split(';').some(info => {
                if (info.includes('otpCode')) {
                    mainCookie = info.slice(info.indexOf('=') + 1);
                    return true
                }
            });

            if (mainCookie == go) {
                HelloSabzlearn();
                toastr.success('به سبزلرن خوش آمدید :)');
            } else {
                toastr.error('رمز دوم معتبر نمیباشد');
            }
            // if (go == 'Success OTP') {
            //     HelloSabzlearn();
            //     toastr.success('به سبزلرن خوش آمدید :)');
            // } else {
            //     toastr.error('رمز دوم معتبر نمیباشد');
            // }
        })
});

function HelloSabzlearn() {
    fetch(`${url}api/public/users/all/`)
        .then(res => res.json())
        .then(go => {
            let findUser = go.find(user => {
                return user.username == queryUrl.get('username')
            });
            localStorage.setItem('user', JSON.stringify(findUser));
            setTimeout(function () {
                authRedirectPanel();
            }, 5000);
        })
}

function authRedirectPanel() {
    let userInfo = JSON.parse(localStorage.getItem('user'))
    let auth = userInfo
    if (auth) {
        fetch(`${url}api/public/users/validate/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInfo)
        }).then(res => res.json())
            .then(go => {
                if (go) {
                    if (userInfo.type == '1') {
                        location.href = '../../panel_admin/home/home.html';
                    } else if (userInfo.type == '0') {
                        location.href = '../../panel_user/home/home.html';
                    }
                }
            })
    }
}