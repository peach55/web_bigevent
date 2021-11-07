$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date);
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  // 补零函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  // 定义一个查询参数对象，将来请求数据
  // 需要将请求数据参数对象发送到服务器
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: "", // 文章分类的 Id
    state: "", // 文章的发布状态
  };

  initTable();
  initCate();

  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          // console.log(res.message);
          return layer.msg("获取文章列表失败！");
        }
        // 使用模板引擎渲染页面的数据
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);

        renderPage(res.total);
      },
    });
  }

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章分类数据失败！");
        }
        // layer.msg('获取文章分类数据成功！')

        var htmlStr = template("tpl-cate", res);
        // console.log(htmlStr);
        $("[name=cate_id]").html(htmlStr);
        // 通知 layui 重新渲染表单区域的UI结构
        form.render();
      },
    });
  }

  // 为筛选表单绑定 submit 事件
  $("#form-search").on("submit", function (e) {
    // 阻止表单默认提交行为
    e.preventDefault();
    // 获取表单的中选中项的值
    var cate_id = $("[name=cate_id]").val();
    var state = $("[name=state]").val();
    // 将获取的表单之赋值给查询对象q
    q.cate_id = cate_id;
    q.state = state;
    // 重新加载文章数据列表
    initTable();
  });

  // 定义渲染分页的方法
  function renderPage(total) {
    //执行一个laypage实例
    laypage.render({
      elem: "pageBox", //这里的是 ID
      count: 50, //数据总数
      limit: q.pagesizepagenum, // 每页显示的条数
      curr: q.pagenum, // 当前页
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 15],
      // 分页发生切换的时候，触发 jump 回调
      // 触发 jump 回调的方式有两种：
      // 1. 点击页码的时候，会触发 jump 回调 first= undefined
      // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调 first=true
      jump: function (obj, first) {
        // 把最新的页码值赋值给q查询参数
        q.pagenum = obj.curr;
        // 把最新的条目数赋值给q查询参数
        q.pagesize = obj.limit;
        // console.log(obj.curr);
        // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
        // 如果 first 的值为 true，证明是方式2触发的
        // 否则就是方式1触发的
        if (!first) {
          initTable();
        }
      },
    });
  }

  // 通过代理形式为删除按钮绑定点击事件
  $("tbody").on("click", "btn-delete", function () {
    var id = $(this).attr("data-id");
    var len = $('.btn-delete').length;
    // 询问用户是否要删除数据
    layer.confirm("确定删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除失败！");
          }
          layer.msg("删除成功！");
          // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
          // 如果没有剩余的数据了,则让页码值 -1 之后,
          // 再重新调用 initTable 方法
          if(len === 1) {
            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
            // 页码值最小必须是 1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable();
          
        },
      });
      layer.close(index);
    });
  });
});
