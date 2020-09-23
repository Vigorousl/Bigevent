$(function() {
    //1.点击link_reg切换到注册页面，让注册页面显示，登录页面隐藏
    $('#link_reg').on('click', function() {
            $('.reg-box').show()
            $('.login-box').hide()
        })
        //2.点击link_login切换到登录页面，让注册页面隐藏，登录页面显示
    $('#link_login').on('click', function() {
            $('.reg-box').hide()
            $('.login-box').show()
        })
        //   1.从layui获取form对象
    var form = layui.form
        //从layui获取layer对象
    var layer = layui.layer
        //  2.利用form.verify()属性自定义校验规则
    form.verify({
        // 自定义一个密码校验的规则
        'pwd': [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 检验两次密码是否一致的规则
        'repwd': function(value) {
            //通过形参接收到在此确认密码的内容
            //再获得输入密码内的内容
            var passward = $('.reg-box [name=password]').val()
                //进行判断，如果两次值不相同，return出去
            if (passward !== value) {
                return '两次密码不一致'
            }
        }
    })

    //给注册表单监听submit事件
    $('#form_reg').on('submit', function(e) {
            e.preventDefault()
            var data = {
                    username: $('#form_reg [name=username]').val(),
                    password: $('#form_reg [name=password]').val()
                }
                //发起ajax的post请求
            $.post('/api/reguser', data,
                function(res) {
                    if (res.status !== 0) {

                        return layer.msg(res.message)
                    }

                    layer.msg('注册成功!请登录')
                        //注册成功后，给去登陆一个点击事件就能跳转到登录页面
                    $('#link_login').click()
                }
            )
        })
        //给登录表单监听submit事件
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(), //直接获得表单有name属性的内容，
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败！')
                }
                //将登陆成功得到的token字符串，存储到本地locationstorage
                localStorage.setItem('token', res.token)
                    // console.log(res.token);
                layer.msg('登陆成功！')
                location.href = '/index.html'
            }
        })
    })
})