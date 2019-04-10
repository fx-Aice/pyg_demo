$(function () {
    // 初始化区域滚动
    mui('.mui-scroll-wrapper').scroll({
        indicators: false,
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
    // 创建对象，存放在加入购物车时需要发送的数据
    var info = {
        cat_id: '',
        goods_id: '',
        goods_name: '',
        goods_number: '',
        goods_price: '',
        goods_small_logo: '',
        goods_weight: ''
    };
    // 发起请求获取数据
    $.ajax({
        type: 'get',
        url: 'goods/detail',
        data: $.getParameter(location.search),
        success: function (result) {
            // var data = result.data;
            //  var {cat_id,goods_id,goods_name,goods_number,goods_price,goods_small_logo,goods_weight} = {data}
            // 为info赋值
            info.cat_id = result.data.cat_id;
            info.goods_id = result.data.goods_id;
            info.goods_name = result.data.goods_name;
            info.goods_number = result.data.goods_number;
            info.goods_price = result.data.goods_price;
            info.goods_small_logo = result.data.goods_small_logo;
            info.goods_weight = result.data.goods_weight;

            var detailHtml = template('goodsdetailTemp', result.data);
            $('.detailContain').html(detailHtml);
            mui('.mui-slider').slider({
                interval: 2000    //自动轮播周期，若为0则不自动播放，默认为0；
            });
        }
    })

    // 点击加入购物车 判断是否登录
    $('.btn_add').on('tap', function () {
        var token = sessionStorage.getItem('pyg_token');
        // 没有token，跳转到登录页面
        if (!token) {
            // 由于后面用路径做redirectUrl参数，在用$.getParameter()解析时，由于参数里面含有等号，问号等特殊符号，会解析错误
            // 所以用escape()方法把当前的href中的字符转义，在login中通过unescape()方法，把转义后的路径复原
            location.href = './login.html?redirectUrl=' + escape(location.href);
        } else {
            // 发起加购请求
            $.ajax({
                url: 'my/cart/add',
                type: 'post',
                data: {
                    info: JSON.stringify(info)
                },
                dataType: 'json',
                success: function (result) {
                    // console.log(result)
                    // token过期，重新登录
                    if (result.meta.status === 401) {
                        // 跳转到登录页面，把当前的路径存到参数redirectUrl中
                        location.href = './login.html?redirectUrl=' + escape(location.href)
                    }
                    else {
                        console.log(result)
                        // 加购成功
                        mui.confirm('成功加入购物车，是否立即查看', '温馨提示', ['跳转', '取消'], function (e) {
                            if (e.index == 0) {
                                // 跳到购物车
                                console.log('跳转');
                                location.href = './cart.html';
                            } else {
                                // 不作为
                            }
                        })
                    }
                }
            })
        }
    })
})