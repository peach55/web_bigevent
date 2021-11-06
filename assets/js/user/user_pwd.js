$(function () {
  // 表单校验 密码为6-15的费控字符
  var form = layui.form;
  var layer = layui.layer
  form.verify({
    pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    // 新密码也旧密码不可以一样
    samePwd: function(value){
        if(value === $('[name=oldPwd]').val()){
            return '新旧密码不能相同！'
        }
    },
    // 确认密码，两次密码需要一致
    rePwd: function(value){
        if(value !== $('[name=newPwd]').val()){
            return '两次密码不一致！'
        }
    }

  });

  /* initUserInfo();
  // 初始化用户基本信息
  function initUserInfo() {
    $.ajax({
      type: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取用户信息失败");
        }
        console.log(res);
        // 调用 layui 中的 form.val() 快速为表单赋值
        form.val("formUserInfo", res.data);
      },
    });
  } */

//   用户基本信息中无 password 字段，无法对输入的原密码进行比对

//   为表单绑定提交事件
$('.layui-form').on('submit',function(e){
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/my/updatepwd',
        data: $(this).serialize(),
        success: function(res){
            if(res.status !== 0) {
                return layer.msg('更新密码失败！')
            }
            layer.msg('更新密码成功！')
            // 重置表单
            $('.layui-form')[0].reset();
        }
    })
})



});
