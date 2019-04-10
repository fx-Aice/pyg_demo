$(function () {
    // 发送验证码
    $('.sendCode').on('tap', function () {
        var mobile = $('[name="mobile"]').val();
        $.ajax({
            url: 'users/get_reg_code',
            type: 'post',
            data: { mobile },
            success: function (result) {
                console.log(result)
                $('[name="code"]').val(result.data);
            }
        })
    })
    // 注册
    $('.register').on('tap', function () {
        // 手机号码验证
        var mobile = $('[name="mobile"]').val();
        if (!/^1[3-9]\d{9}$/.test(mobile)) {
            mui.toast('手机号码格式错误');
            return false;
        }
        // 密码长度验证
        var pwd = $('[name="pwd"]').val();
        if (pwd.length < 6) {
            mui.toast('密码需要大于六位数');
            return false;
        }
        // 邮箱格式验证
        var email = $('[name="email"]').val();
        if (!/\w[@]\w{1,}[.]\w/.test(email)) {
            mui.toast('请输入正确的邮箱格式');
            return false;
        }
        // 确认密码
        if ($('.again').val() != pwd) {
            mui.toast('两次密码不一致');
            return false;
        }

        // 发起注册请求
        $.ajax({
            type: 'post',
            url: 'users/reg',
            data: $('form').serialize(),
            success: function (result) {
                console.log(result);
                if (result.meta.status == 200) {
                    mui.toast('注册成功');
                    location.href = './login.html';
                }
            }
        })
    })
})