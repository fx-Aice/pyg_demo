$(function () {
    mui('.mui-scroll-wrapper').scroll({
        indicators: false,
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

    // 渲染订单数据
    init(1)
    /**
     * 
     * @param {num} index   根据索引，判断是哪个版块的数据  1:全部订单 2:待付款 3:待发货
     */
    function init(index){
        $.ajax({
            type:'get',
            url:'my/orders/all',
            data:{type:index},
            dataType:'json',
            success:function(result){
                console.log(result);
                var html = template('orderListTemp',result);
                $('#item'+index).html(html);
            }
        })
    }

    // 单击选项卡切换数据
    $('#segmentedControl').on('tap','a',function(){
        // console.log($(this).data('index'));
        // 获取自定义属性
        var index = $(this).data('index');
        init(index);
    })
})