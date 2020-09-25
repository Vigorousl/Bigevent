$(function() {
    var layer = layui.layer
    var form = layui.form
        //获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                // console.log(res);
                //调用模板引擎
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    initArtCateList()
    var addIndex = null
    $('#btnAddCate').on('click', function() {
        addIndex = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });

    })

    //因为表单是动态生成的，所以不能直接绑定submit事件，而是通过事件委托的形式
    $('body').on('submit', '#form_add', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('新增文章分类失败！')
                    }
                    initArtCateList()
                    layer.msg('新增文章分类成功！')
                        //关闭弹出层 通过上面的open函数返回值的索引，删除对应的弹出层
                    layer.close(addIndex)

                }
            })
        })
        //为编辑按钮绑定点击事件
    var editIndex = null
    $('tbody').on('click', '#btn-edit', function() {
        editIndex = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id')
            // console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                form.val('form_edit', res.data);
            }
        })
    })

    //为表单绑定submit事件
    $('body').on('submit', '#form_edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！')
                }
                layer.msg('更新分类信息成功！')
                    //关闭弹出层
                layer.close(editIndex)
                    //重新获取列表
                initArtCateList()
            }
        })
    })


    //为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章分类失败！")
                    }
                    layer.msg("删除文章分类成功！")
                    layer.close(index);
                    initArtCateList()
                }

            })

        });

    })
})