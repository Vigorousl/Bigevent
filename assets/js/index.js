$(function() {
        var layer = layui.layer
        getUserInfo()
        $('#btnLogout').on('click', function() {
            layer.confirm('确定退出登录?', {
                icon: 3,
                title: '提示'
            }, function(index) {
                //do something
                //1.退出登陆就要清空本地存储的token
                localStorage.removeItem('token')
                    //2.跳转到登录页面
                location.href = '/login.html'
                layer.close(index);
            });
        })
    })
    //获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取信息失败！')
            }
            //调用渲染头像的函数
            genderAvator(res.data)
        },
        // //ajax()函数中还有complete的回调函数，不管成功或失败都会调用这个函数
        // complete: function(res) {
        //     //通过res.responseJSON可以得到服务器相应过来的数据
        //     console.log(res);
        //     //下面要进行判断，如果res.responseJSON.status===1&&res.responseJSON.message='...'那么就强制删除token并且强制跳转到登录页面
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         localStorage.removeItem('token')
        //         location.href = '/login.html'
        //     }
        // }

    })
}
//渲染头像的函数
function genderAvator(user) {
    //按需获取用户的名字，昵称优先级最高
    var name = user.nickname || user.username
        //修改欢迎词
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        //按需渲染头像
    if (user.user_pic !== null) {
        //渲染图片头像    
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avator').hide()
    } else {
        //渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avator').html(first)
    }
}