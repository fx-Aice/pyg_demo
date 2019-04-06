$(function () {
    // 点击搜索图标，实现左边滑动
    $('.mui-icon-search').on('tap', function (e) {
        mui('.mui-off-canvas-wrap').offCanvas('show');
    })
    // 发起ajax需要传的数据
    var data = {
        cid: getParameter(location.search).cid,
        pagenum: 1,
        pagesize: 10
    }
    // 实现上拉加载，下拉刷新
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                height: 50,//可选,默认50.触发下拉刷新拖动距离,
                auto: true,//可选,默认false.首次加载自动下拉刷新一次
                contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: function () {//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    // 获取数据，渲染页面，刷新是直接用新数据覆盖
                    getGoodsList(function (result) {
                        var goodsListHtml = template('goodsListTemp', result.data);
                        $('.goodslist').html(goodsListHtml);
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        // 为了防止切换分类的时候，无法再上拉，所以在每次刷新的时候将上拉加载重新启用
                        mui('#refreshContainer').pullRefresh().refresh(true)
                    });

                }
            },
            up: {
                height: 50,//可选.默认50.触发上拉加载拖动距离
                auto: false,//可选,默认false.自动上拉加载一次
                contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
                callback: function () {//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    // 上拉加载，获取下一页，页码加一
                    data.pagenum++;
                    // 用数据追加到页面，而不是覆盖
                    getGoodsList(function (result) {
                        var goodsListHtml = template('goodsListTemp', result.data);
                        $('.goodslist').append(goodsListHtml);
                        mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                        // 为了防止切换分类的时候，无法再上拉，所以在每次刷新的时候将上拉加载重新启用
                        mui('#refreshContainer').pullRefresh().refresh(true)
                    })
                }
            }
        }
    });


    // 渲染历史记录
    renderHistory(getQueryHistory());
    // 点击搜索按钮，搜索商品
    $('.query_btn').on('tap', function () {
        var query_text = $('.query_text').val();
        // console.log(query_text);
        // renderGoods(query_text);
        // 获取历史记录
        var queryHistoryArr = getQueryHistory();
        // 追加历史记录
        queryHistoryArr.push(query_text);
        // 渲染
        renderHistory(queryHistoryArr);
        // 存localStorage
        localStorage.setItem('query_history', JSON.stringify(queryHistoryArr));
    })

    // 点击清空按钮，清空历史记录
    $('.clearAll').on('tap', function () {
        // 清除localStorage中的query_history
        localStorage.removeItem('query_history');
        // 清空历史记录的列表
        $('.query_result').html('');
    })

    // 点击历史记录中的数据，进行查询
    $('.query_result').on('tap', 'li', function () {
        console.log($(this).text());
        // 根据点击的数据，发起请求
        // renderGoods($(this).text());
    })


    /**
     * 根据查询条件，查询并渲染商品数据
     * @param {string} query   查询的参数字符串
     */
    function renderGoods(query) {
        var obj = {};
        obj.query = query;
        getGoodsList(function (result) {
            console.log(result);
        }, obj)
    }

    /**
     * 获取商品列表
     * @param {function} callback   数据请求成功后的回调函数
     * @param {obj} obj             对象，是查询的参数字符串query
     */
    function getGoodsList(callback, obj) {
        $.ajax({
            url: 'goods/search',
            type: 'get',
            data: $.extend(data, obj),
            dataType: 'json',
            success: function (result) {
                console.log(result);
                callback(result);
            }
        })
    }

    /**
     * 从localStorage获取查询历史记录
     */
    function getQueryHistory() {
        var queryHistory = localStorage.getItem('query_history');
        var queryHistoryArr = JSON.parse(queryHistory || '[]');
        return queryHistoryArr;
    }

    /**
     * 根据数组数据，渲染搜索历史记录到页面
     * @param {array} queryHistoryArr 历史记录的数组
     */
    function renderHistory(queryHistoryArr) {
        var str = '';
        queryHistoryArr.forEach(function (item) {
            str += `<li>${item}</li>`;
        })
        $('.query_result').html(str);
    }

})










/**
 * 通过url解析参数
 * @param {string} url   需要解析的url的search路径  ?id=2&name="abc"
 */
function getParameter(url) {
    // 创建变量，保存解析后的参数对象
    var queryObj = {};
    // 从第一位?开始开始截取，截取到最后
    var queryStr = url.substring(1);
    // 把字符串，按照'&'分割成数组
    var queryArr = queryStr.split('&');
    // 循环遍历该数组
    queryArr.forEach(function (item) {
        // 对数组中的每一项用 ‘=’ 分割成数组，存入对象中
        var tempArr = item.split('=');
        // tempArr[0]代表等号前面的属性，tempArr[1]里面是值
        queryObj[tempArr[0]] = tempArr[1];
    })
    return queryObj;
}