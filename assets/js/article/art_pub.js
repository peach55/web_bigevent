$(function () {
  var layer = layui.layer;
  var form = layui.form;
  initCate();
  // 初始化富文本编辑器
  initEditor();
  // 定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章分类列表失败！");
        }
        // layer.msg('获取文章分类列表成功！')
        // 调用模板引擎渲染分类的下拉菜单
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        form.render();
      },
    });
  }

  // 实现基本裁剪效果
  // 1. 初始化图片裁剪器
  var $image = $("#image");
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };
  // 3. 初始化裁剪区域
  $image.cropper(options);

  // 点击选择封面按钮，为其绑定点击事件，模拟点击上传文件
  $("#btnChooseImg").on("click", function () {
    $("#coverFile").click();
  });

  // 为文件上传按钮绑定 change 事件，拿到选择的文件
  $("#coverFile").on("change", function (e) {
    // 用户选择的文件列表数组
    var fileList = e.target.files;
    // 判断用户是否选择了文件
    if (fileList.length === 0) {
      return;
    }
    // 根据选择的文件，创建一个对应的 URL 地址
    var newImgURL = URL.createObjectURL(fileList[0]);
    // console.log(file);
    // console.log(newImgURL);
    // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
    $image.cropper("destroy").attr("src", newImgURL).cropper(options);
  });

  // 定义发布文章的状态
  var art_state = "已发布";
  // 为存为草稿按钮，点击绑定事件处理函数
  $("#btnSave2").on("click", function () {
    art_state = "草稿";
  });

  // 为表单绑定 submit 事件
  $("#form-pub").on("submit", function (e) {
    // 1.阻止表单默认提交行为
    e.preventDefault();
    // 2.基于form 表单，快速创建一个 FormData 对象
    var fd = new FormData($(this)[0]);
    // 3.将文章的发布状态，存到fd中
    fd.append("state", art_state);
    // 4. 将裁剪后的图片，输出为文件
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 5.得到文件对象后，存到fd中
        fd.append("cover_img", blob);
        // 6.发起ajax 请求
        publishArticle(fd);


      });
  });

  // 发布文章的ajax请求
  function publishArticle(fd){
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function(res){
        if( res.status !== 0){
          return layer.msg('发布文章失败！')
        }
        layer.msg('发布文章成功！')
        // 发布文章成功后，跳转到文章列表页面
        location.href = '/article/art_list.html'
      }
    })
  }




});
