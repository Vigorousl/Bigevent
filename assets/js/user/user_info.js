$(function() {
    var form = layui.form
    var layer = layui.layer
        //1.自定义昵称的校验规则
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return layer.msg('昵称长度必须在1-6个字符之间')
            }
        }
    })
    initUserInfo()
        //初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                console.log(res);
                //调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }
    //重置表单的数据
    $('#btnReset').on('click', function(e) {
        e.preventDefault()
            //调用initUserInfo() ，重新获取初始化的信息
        initUserInfo()
    })

    //监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
            //发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                    //并且要渲染父页面的头像和欢迎信息，当前所在的是iframe页面里面，需要调用父页面，
                window.parent.getUserInfo()
            }


        })
    })
})