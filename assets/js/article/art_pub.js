$(function() {
    var layer = layui.layer
    var form = layui.form
    initCate()
        // 初始化富文本编辑器
    initEditor()
        //定义文章分类列表的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    //一定要记得调用form.render()方法
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //点击选择封面按钮，上传文件
    $('#chooseImg').on('click', function() {
        $('#upload').click()
    })

    //监听upload的change事件，获取用户选择的文件
    $('#upload').on('change', function(e) {
        //获得文件列表数组
        var files = e.target.files
            //判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
            //先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //定义文章发布的状态,默认为已发布
    var art_status = '已发布'
        //给存为草稿按钮绑定点击事件
    $('#btn-save').on('click', function() {
        art_status = '草稿'
    })

    // 给表单监听submit事件
    $('#form-pub').on('submit', function(e) {
            //1.阻止表单的默认提交行为
            e.preventDefault()
                //2.给予form表单快速创建一个formdata对象
            var fd = new FormData($(this)[0])
                //3.将发布状态添加到fd中
            fd.append('state', art_status)
                // fd.forEach(function(v, k) {
                //     console.log(k, v);
                // })
                //4.将文章封面裁剪后的图片，输出为文件
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    //5.将文件添加到fd中
                    fd.append('cover_img', blob)
                        //6.发起ajax请求
                    publisherArticle(fd)
                })

        })
        //定义发布文章的方法
    function publisherArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意，这两个必须要写
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                    //同时跳转到文章列表区域
                location.href = "/article/art_list.html"
            }
        })
    }
})