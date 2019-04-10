$(function () {
    // console.log('myinfo')
    $.ajax({
        type: 'get',
        url: 'my/users/userinfo',
        dataType: 'json',
        success: function (result) {
            console.log(result);
            if (result.meta.status == 401) {
                mui.toast('还没登录，即将跳转到登录页面');
                location.href = './login.html';
            } else if (result.meta.status == 200) {
                $('.tel').text(result.data.user_tel);
                $('.userInfo .right span').text(result.data.user_email);
            }
        }
    })
})