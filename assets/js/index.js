// 入口函数
$(function(){
    // 调用函数获取用户基本信息
    getUserInfo()

    var layer = layui.layer
    // 为退出按钮绑定点击事件
    $('#btnLogout').on('click',function(){
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            // 清空本地存储的 token
            localStorage.removeItem('token') 
            // 重新跳转到登录页
            location.href = '/login.html'
            // 关闭confirm 询问框
            layer.close(index);
          });
    })
   
})

// 获取用户的基本信息
function getUserInfo(){
    $.ajax({
        type: 'GET',
        url:'/my/userinfo',
        // 请求头配置对象
        /* headers: { 
            Authorization: localStorage.getItem('token') || ''
        }, */
        success: function(res){
            // console.log(res);
            if(res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用渲染用户头像方法
            renderAvater(res.data)
        },
        // 无论成功或者失败，都会调用 complete 函数
        /* complete: function(res){
            // console.log(res);
            if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 强制清空token
                localStorage.removeItem('token')
                // 强制跳转
                location.href = '/login.html'
            }
        } */
    })
};

// 渲染用户头像
function renderAvater(user) {
    // 1. 获取用户名称
    var name = user.nickname || user.username
    // 2. 设置文本内容
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3. 按需渲染用户头像
    if( user.user_pic !== null){
        // 3.1 渲染图片头像
        $('.layui-nav-img')
          .attr('src', user.user_pic)
          .show()
        $('.text-avatar').hide()
    }else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
        $('.layui-nav-img').hide()
    }
}

