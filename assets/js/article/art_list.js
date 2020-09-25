$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    //定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值,默认为1
        pagesize: 2, //每页显示多少条数据，默认2
        cate_id: '', //文章分类的 Id
        state: '' //文章的发布状态
    }
    initTable()
    initCate()
        //定义获取文章列表数据的函数
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // console.log(res);
                //调用模板引擎
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    //调用渲染分页的函数 其中res里面有一个total，返回的就是数据的总条数
                renderPage(res.total)
            }
        })
    }

    //定义美化时间的过滤器
    template.defaults.imports.dateFormat = function(date) {
        var dt = new Date(date)
        var y = dt.getFullYear()
        var m = dt.getMonth() + 1
        m = m < 10 ? '0' + m : m
        var d = dt.getDate()
        d = d < 10 ? '0' + d : d
        var h = dt.getHours()
        h = h < 10 ? '0' + h : h
        var mm = dt.getMinutes()
        mm = mm < 10 ? '0' + mm : mm
        var s = dt.getSeconds()
        s = s < 10 ? '0' + s : s
        return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s
    }

    //初始化获取文章分类列表的函数
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
                    // 通知layui重新渲染表单的UI结构
                form.render()
            }
        })


    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            //获取分类和状态的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            //往查询对象q中进行赋值
        q.cate_id = cate_id
        q.state = state
            //调用 initTable()函数，重新获取数据列表
        initTable()
    })

    //定义渲染分页的函数
    function renderPage(total) {

        laypage.render({
            elem: 'pageBox', //分页的容器的id
            count: total, //总数据条数，从服务端得到
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum, //设置默认选中的页数
            //分页发生切换的时候，触发这个回调函数
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //junp回调函数触发有两种方式，
            //1.点击分页的时候触发
            //2.调用   laypage.render（）方法触发  这是原因所在
            jump: function(obj, first) {
                // console.log(first); //first的值是一个布尔值
                // console.log(obj.curr); //拿到最新的页码值
                q.pagenum = obj.curr //赋值给q这个查询对象，就可以重新渲染
                    //把最新的条目数，赋值到q这个查询对象的pagesize属性中
                q.pagesize = obj.limit

                //根据最新的q，获取对应的数据列表，并渲染表格
                // initTable() 直接写会发生死循环

                //如果是第二种方式触发，first值是true，，就不能调用initTable()，如果是第一种undefined  则可以    
                if (!first) { //说明是以第一种方式触发的
                    initTable()
                }
            }
        })

    }

    //通过代理的方式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        var len = $('.btn-delete').length
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败')
                    }
                    layer.msg('删除文章分类成功')

                    //当数据删除完成后，先判断本页的数据是否完全删除，
                    //如果完全删除了，就让页码值 - 1 之后，
                    //在重新渲染页面    initTable()
                    //怎么知道页面还有几条数据，是通过删除按钮的个数获得的，
                    //所以先获得按钮的个数

                    if (len === 1) {
                        //如果删除按钮的值等于1，证明数据删除完了，页面没有任何数据了
                        //页码值最小是1,
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()

                }
            })
            layer.close(index);
        })

    })
})