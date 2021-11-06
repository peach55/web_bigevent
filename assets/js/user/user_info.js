$(function () {
  // 表单验证
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    nickname: [/^[\S]{1,6}$/, "昵称必须1到6位，且不能出现空格"],
  });

  initUserInfo();

  // 初始化用户基本信息
  function initUserInfo() {
    $.ajax({
      type: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取用户信息失败");
        }
        // 获取信息回填入表单中
        /* if(res.data.username !== null ) {
                console.log(res.data.username);
                $('.layui-form [name=username]').val(res.data.username);
            } */
        // console.log(res);
        // 调用 layui 中的 form.val() 快速为表单赋值
        form.val("formUserInfo", res.data);
      },
    });
  }

  // 为重置按钮绑定点击事件
  $("#btnReset").on("click", function (e) {
    // 阻止表单的默认重置行为
    e.preventDefault();
    initUserInfo();
  });

  // 监听表单提交事件
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("修改用户信息失败！");
        }
        layer.msg("修改用户信息成功！");
        // 调用父页面中的方法，重新渲染用户的头像和用户信息
        window.parent.getUserInfo();
      },
    });
  });
});
