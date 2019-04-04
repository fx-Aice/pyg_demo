$(function () {
    // 在每次发起ajax请求之前，在url开头增加基准路径
    const baseURL = 'http://157.122.54.189:9094/api/public/v1/'
    $.ajaxSettings.beforeSend = function (xhr, obj) {
        obj.url = baseURL + obj.url;
    }
    // 在mui中会屏蔽a链接的跳转，所以需要通过绑定tap事件，实现a链接的跳转
    mui('body').on('tap', 'a', function (e) {
        e.preventDefault()
        window.top.location.href = this.href;
    });

})