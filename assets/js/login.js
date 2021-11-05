// 入口函数
$(function(){
  // 1.登录和注册的按需切换
  // 点击 去注册账号 链接
  $('#link-reg').on('click',function(){
    $('.login-box').hide();
    $('.reg-box').show();
    
  })
  // 点击 去登录 链接
  $('#link-login').on('click',function(){
    $('.reg-box').hide();
    $('.login-box').show();
  })

  // 2.自定义表单校验规则
  // ① 从 layui中获取对象
  var form = layui.form
  var layer = layui.layer
  // ② 通过 form.verify() 函数自定义校验规则
  form.verify({
    pwd: [
      /^[\S]{6,12}$/,
      '密码必须6到12位，且不能出现空格'
    ],
    // 校验两次密码是否一致
    repwd: function(value){
      // value：表单的值，形参，拿到的是确认密码框中的值
      // 还需要拿到密码框的值
      // 进行等值判断
      // 判断失败，return 一个提示消息
      var val = $('.reg-box [name=password]').val()
      if(val !== value) {
        return '两次密码不一致！'
      }

    }
  })

  // 3. 监听注册表单中的提交事件
  $('#form-reg').on('submit',function(e){
    // 阻止默认行为
    e.preventDefault()
    // 发送ajax请求
    $.ajax({
      type: 'POST',
      url: '/api/reguser',
      data: {
        username: $('.reg-box [name=username]').val(),
        password: $('.reg-box [name=password]').val()
      },
      success: function(res){
        if(res.status !== 0 ) return layer.msg(res.message);
        layer.msg(res.message);
        // 模拟人的点击行为
        $('#link-login').click()
      }
    })
  })

  // 4.监听登录表单中的提交事件
  $('#form-login').on('submit',function(e){
    // 阻止默认提交行为
    e.preventDefault();
    // 发送ajax 请求
    $.ajax({
      type: 'POST',
      url:'/api/login',
      data: $(this).serialize(),
      success: function(res){
        if( res.status !== 0) return layer.msg("登录失败")
        layer.msg("登录成功")
        // console.log(res.token)
        // 将登录成功 得到的 token 字符串存到 localStorage 中
        localStorage.setItem('token',res.token)

        // 跳转到后台页面
        location.href = '/index.html'
      }
    })
  })




})