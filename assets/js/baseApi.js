//每次调用$.get 或 $.post 或$.ajax 函数时，
//都会先调用$.ajaxPrefilter这个函数，
//在这个函数中，我们可以拿到给ajax提供的配置对象，
//在发起真正的ajax请求之前，统一拼接请求的根路径
$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url
        // console.log(options.url);
        //统一为有权限的借口，设置headers请求头
        //如果是以/my/开头的才设置请求头，所以加一个判断条件
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //在全局挂载complete回调函数，优化了代码的书写量
    options.complete = function(res) {
        //通过res.responseJSON可以得到服务器相应过来的数据
        // console.log(res);
        //下面要进行判断，如果res.responseJSON.status===1&&res.responseJSON.message='...'那么就强制删除token并且强制跳转到登录页面
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})