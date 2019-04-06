$(function () {
    // 设置全局变量存储localStorage中的列表数据
    var cateData;
    // 调用函数，渲染页面
    render();
    /**
     * 2. 渲染页面
     * 在里面判断是渲染页面还是重新获取数据，若里面已经有了数据，并且和当前的时间比较并没有失效，就渲染页面
     * 否则重新获取数据，重新存localStorage
     */
    function render() {
        // 从localStorage取出存的cateLists
        $('body').addClass('loadding');
        cateData = JSON.parse(localStorage.getItem('cateLists'));
        // 判断是否已经有了数据，并且和当前时间比较，没有超过一小时
        if (cateData && Date.now() - cateData.time < 60 * 60 * 1000) {
            leftListRender();
            rightListRender(0);
        } else {
            // 否则重新获取数据
            getData();
        }
    }

    /**
     * 1. 从后台获取数据，并且存入localStorage
     * 为了避免重复向后台提交数据，这里把获取到的数据存在本地localStorage中，并且设置一个是失效时间
     */
    function getData() {
        $.get('categories', function (result) {
            // console.log(result);
            // list中保存的是获取的数据，time是当前存储数据的时间
            var cateData = { 'list': result.data, 'time': Date.now() }
            // 注意在localStorage中只能存字符串，所以用stringify转换
            localStorage.setItem('cateLists', JSON.stringify(cateData));
            // 存了localStorage之后调用render()渲染页面
            render();
        }, 'json');
    }

    // 3. 渲染左边菜单列表
    function leftListRender() {
        console.log(cateData);
        // 模板引擎生成模板字符串
        var leftListHtml = template('leftListTemp', cateData);
        $('.menu_wrap').html(leftListHtml);
        // 实现左侧菜单滑动效果
        var leftScroll = new IScroll('.left_menu');
        // 点击左边的菜单栏切换样式
        $('.menu_wrap').on('tap', 'li', function () {
            // console.log('tap');
            $(this).addClass('active').siblings().removeClass('active');
            // scrollToElement方法可以使其滚动到该点击元素的左上角位置
            leftScroll.scrollToElement(this);
            // 点击该菜单之后传当前点击菜单的索引给rightListRender(),在右边渲染出与该菜单对应的商品列表
            rightListRender($(this).index());
        })
    }
    // 4. 渲染右边商品列表
    function rightListRender(index) {
        // 生成模板字符串
        var rightListHtml = template('rightListTemp', cateData.list[index])
        // 渲染到页面
        $('.scroll_box').html(rightListHtml);
        /**
         * 由于：img的src链接的网络文件，会发起二次请求，需要时间，所以当页面结构生成时，图片信息并没有回来，会造成父盒子的宽度并不是真实的宽度
         * 有一定的偏差，所以会造成右边页面滑不动的情况，为了解决此情况，需要在页面所有图片都已经加载完成之后才调用IScroll方法
         * 通过onload方法可以监听图片的加载完成，每张图片加载完成都会触发此事件，所以先获取图片总数，再在事件中--，到0的时候就是图片全部加载完成的时候
         */
        // 获取scroll_box中一共有多少个img标签
        var imgTotal = $('.scroll_box img').length;
        // console.log(imgTotal)
        $('.scroll_box img').on('load', function () {
            // 每加载完一次图片，总数就减一
            imgTotal--;
            if (imgTotal == 0) {
                // 图片已经全部加载完毕，调用scroll，实现滑动
                var rightScroll = new IScroll('.right_menu');
                $('body').removeClass('loadding');
            }
        })
    }















})