$(function () {
    // 在每次发起ajax请求之前，在url开头增加基准路径
    // const baseURL = 'http://157.122.54.189:9094/api/public/v1/'
    const baseURL = 'http://140.143.222.79:8899/api/public/v1/';
    // 每次发送请求之前调用，拦截器
    $.ajaxSettings.beforeSend = function (xhr, obj) {
        $('body').addClass('loadding');
        obj.url = baseURL + obj.url;
        // 在访问私有路径的时候，手动的将token值传递给服务器
        // 判断是否是私有路径
        if (obj.url.indexOf('/my/') != -1) {
            // 通过请求头的方式将token值传递给服务器
            xhr.setRequestHeader('Authorization', sessionStorage.getItem('pyg_token'));
        }
    }
    // 每次发送请求完成后调用
    $.ajaxSettings.complete = function () {
        $('body').removeClass('loadding');
    }
    // 在mui中会屏蔽a链接的跳转，所以需要通过绑定tap事件，实现a链接的跳转
    mui('body').on('tap', 'a', function (e) {
        e.preventDefault()
        window.top.location.href = this.href;
    });

    // 动态扩展zepto方法
    $.extend($, {
        /**
         * 通过url解析参数
         * @param {string} url   需要解析的url的search路径  ?id=2&name="abc"
         */
        getParameter(url) {
            // 创建变量，保存解析后的参数对象
            var queryObj = {};
            // 从第一位?开始开始截取，截取到最后
            var queryStr = url.substring(1);
            // 把字符串，按照'&'分割成数组
            var queryArr = queryStr.split('&');
            // 循环遍历该数组
            queryArr.forEach(function (item) {
                // 对数组中的每一项用 '=' 分割成数组，存入对象中
                var tempArr = item.split('=');
                // tempArr[0]代表等号前面的属性，tempArr[1]里面是值
                queryObj[tempArr[0]] = tempArr[1];
            })
            return queryObj;
        }
    })

})