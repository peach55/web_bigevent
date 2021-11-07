$(function () {
  var layer = layui.layer;
  var form = layui.form
  initArtCateList();

  // 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      type: "GET",
      url: "/my/article/cates",
      success: function (res) {
        // console.log(res);
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
      },
    });
  }

  var indexAdd = null;
  // 给添加类别按钮注册点击事件
  $("#addItem").on("click", function () {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "260px"],
      title: "添加文章分类",
      content: $("#dialog-add").html(),
    });

    // 通过代理的形式，给form表单绑定submit提交事件
    // 监听添加类别按钮中表单提交事件
    $("body").on("submit", "#addForm", function (e) {
      e.preventDefault();
      $.ajax({
        type: "POST",
        url: "/my/article/addcates",
        data: $(this).serialize(),
        success: function (res) {
          // console.log(res);
          if (res.status !== 0) {
            return layer.msg("新增文章分类失败！");
          }
          layer.msg("新增文章分类成功！");
          initArtCateList();
          layer.close(indexAdd);
        },
      });
    });
  });

  var indexEdit = null
  // 通过代理形式给编辑按钮 btn-edit 注册点击事件
  $('tbody').on('click','.btn-edit',function(){
    // 弹出层
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "260px"],
      title: "编辑文章分类",
      content: $("#dialog-edit").html(),
    });

    var id = $(this).attr('data-id');
    // console.log(id);
    // 发送请求获取对应分类的数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function(res){
        /* console.log(res);
        if(res.status !== 0) {
          return layer.msg('获取文章分类数据失败！')
        } */
        // layer.msg('获取文章分类数据成功！')
        form.val('editForm', res.data)
      }
    })

    // 提交表单
    $('body').on('submit','#editForm',function(e){
      e.preventDefault()
      $.ajax({
        method: 'POST',
        url: '/my/article/updatecate',
        data: $(this).serialize(),
        success: function(res){
          // console.log(res);
          if(res.status !== 0){
            return layer.msg('更新分类信息失败！');
          }
          layer.msg('更新分类信息成功！');
          initArtCateList();
          layer.close(indexEdit);
        }
      })
    })



  })

  // 通过代理形式给删除按钮绑点点击事件
  $('tbody').on('click','.btn-del',function(){
    var id = $(this).attr('data-id');
    // console.log(id);
    // 跳出询问框
    layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function(res){
          if(res.status !== 0){
            return layer.msg('删除文章分类失败！')
          }
          layer.msg('删除文章分类成功！')
          layer.close(index);
          initArtCateList()
        }
  
      })
      
      
    });

  })





});
