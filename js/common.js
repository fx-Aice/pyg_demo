$(function(){
    const baseURL = 'http://157.122.54.189:9094/api/public/v1/'
    $.ajaxSettings.beforeSend = function(xhr,obj){
        obj.url = baseURL + obj.url;
    }
})