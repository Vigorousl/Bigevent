//每次调用$.get 或 $.post 或$.ajax 函数时，
//都会先调用$.ajaxPrefilter这个函数，
//在这个函数中，我们可以拿到给ajax提供的配置对象，
//在发起真正的ajax请求之前，统一拼接请求的根路径
$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    console.log(options.url);
})