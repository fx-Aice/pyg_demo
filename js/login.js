$(function () {
    // 登录
    $('.login').on('tap', function () {
        // 获取输入框的用户名和密码
        var username = $('.username').val();
        var password = $('.password').val();
        // 判断用户格式是否正确
        if (!/^1[3-9]\d{9}$/.test(username)) {
            mui.toast('手机号码格式不正确');
            return false;
        }
        // 判断密码长度是否大于6位
        if (password.length < 6) {
            mui.toast('密码长度需要大于6位');
            return false;
        }
        // 发起登录请求
        $.ajax({
            type: 'post',
            url: 'login',
            data: {
                username, password
            },
            success: function (result) {
                console.log(result);
                // 登录成功
                if (result.meta.status == 200) {
                    // 登录成功 ，存token
                    sessionStorage.setItem('pyg_token', result.data.token);
                    // 获取由跳转到登录的页面的上个href，为了方便登录成功后跳转回去
                    var redirectUrl = unescape($.getParameter(location.search).redirectUrl);
                    // 若没有这个参数，登录成功后，直接跳到主页面
                    if (redirectUrl != 'undefined') {
                        location.href = redirectUrl;
                    } else {
                        location.href = '../index.html';
                    }
                } else {
                    console.log('登录失败')
                    mui.toast(result.meta.msg)
                }
            }
        })
    })
})