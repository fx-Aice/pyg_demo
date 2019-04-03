$(function () {
    banner();
    goodsList();
})

// 轮播图
function banner() {
    $.ajax({
        type: 'get',
        url: 'home/swiperdata',
        success: function (result) {
            // console.log(result);
            // 动态生成轮播图片
            var bannerHtml = template('bannerTemp', result);
            $('.pyg_bannerBox').html(bannerHtml);
            // 动态生成的结构，需要调用此方法，使轮播图自动播放
            mui('.mui-slider').slider({
                interval: 2000    //自动轮播周期，若为0则不自动播放，默认为0；
            });
            // 小圆点
            var indicatorHtml = template('indicatorTemp',result);
            $('.pyg_indicator').html(indicatorHtml);
        }
    })
}
// 商品列表
function goodsList(){
    $.ajax({
        type:'get',
        url:'home/goodslist',
        dataType:'json',
        success:function(result){
            console.log(result);
            var goodslistHtml = template('goodslistTemp',result);
            $('.goodsList').html(goodslistHtml);
        }
    })

}