$(function () {
    // 初始化区域滚动
    var total;
    mui('.mui-scroll-wrapper').scroll({
        indicators: false,
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
    // 获取购物车的数据  动态生成商品列表结构
    init();
    function init() {
        $.ajax({
            type: 'get',
            url: 'my/cart/all',
            dataType: 'json',
            success: function (result) {
                console.log(result);
                if (result.meta.status == 401) {
                    location.href = './login.html'
                }
                // console.log(JSON.parse(result.data.cart_info));
                var orderListHtml = template('orderListTemp', { data: JSON.parse(result.data.cart_info) });
                $('.order_list').html(orderListHtml);
                // 手动初始化数字输入框
                mui($('.mui-numbox')).numbox()
                // 调用函数计算总价
                calculateTotalPrice();
            }
        })
    }

    // 点击编辑按钮，切换body的类名，控制元素的显示和隐藏
    $('.goodsEdit').on('tap', function () {
        // 切换body的类名,控制元素的隐藏和显示
        $('body').toggleClass('toggleElement');
        if ($(this).text() == '编辑') {
            // 改变字的内容
            $(this).text('完成');
        }
        else {
            $(this).text('编辑');
            // 更新数据，同步购物车
            syncCart($('.order_item'));
        }
    })


    // 同步购物车
    function syncCart(allItems) {
        // 创建变量存放需要更新的数据
        var orderObj = {};
        // 循环遍历
        allItems.each(function (index, value) {
            // 获取自定义属性值
            var data = $(value).data('order');
            console.log(data);
            // 用当前页面的数量,修改数据中的数量值
            data.amount = $(value).find('#test').val();
            // 重新给对象赋值
            orderObj[data.goods_id] = data;
        })
        $.ajax({
            type: 'post',
            url: 'my/cart/sync',
            data: { "infos": JSON.stringify(orderObj) },
            dataType: 'json',
            success: function (result) {
                console.log(result);
                if (result.meta.status == 200) {
                    init();
                }
            }
        })
    }

    // 计算总价
    function calculateTotalPrice() {
        total = 0;
        var allItems = $('.order_item');
        allItems.each(function (index, value) {
            // console.log($(value).data('order'));
            // 价格是从数据中获取
            var price = $(value).data('order').goods_price;
            // 由于数量要经常修改.数量是从页面中获取
            var count = $(value).find('#test').val();
            // 计算总价
            total = total + price * count;
        })
        // 给页面的总价赋值
        $('.total').text(total);
    }

    // 编辑商品数量
    $('.order_list').on('tap', '.mui-numbox button', function () {
        // console.log('tap');
        // 点击按钮,修改了商品数量,调用函数,重新计算商品的总价
        calculateTotalPrice();
    })

    // 删除商品
    $('.goodsDel').on('tap', function () {
        console.log($('.order_item .order_checkbox input').not(':checked'))
        // 查找出未被勾选的商品
        var remain = $('.order_item .order_checkbox input').not(':checked').parent().parent();
        var checked = $('.order_item .order_checkbox input:checked');
        if (checked.length != 0) {
            mui.confirm('删除后不可恢复，是否确定删除', '警告', ['确定', '取消'], function (e) {
                if (e.index == 0) {
                    // 调用同步购物车函数
                    syncCart(remain);
                } else {
                    // 不作为
                }
            })
        } else {
            mui.toast('请选择待删除的商品');
        }

    })

    // 生成订单
    $('.createdOrder').on('tap', function () {
        var arr = [];
        var allItems = $('.order_item');
        allItems.each(function (index, value) {
            var objTemp = {};
            objTemp.goods_id = $(value).data('order').goods_id;
            objTemp.goods_number = $(value).data('order').amount;
            objTemp.goods_price = $(value).data('order').goods_price;
            arr.push(objTemp);
        })
        $.ajax({
            type: 'post',
            url: 'my/orders/create',
            data: {
                "order_price": total,
                "consignee_addr": $('.userAddress').text(),
                "goods": arr
            },
            success: function (result) {
                console.log(result);
                mui.toast(result.meta.msg)
                if (result.meta.status == 200) {
                    location.href = './orderList.html';
                }
            }
        })
    })
})