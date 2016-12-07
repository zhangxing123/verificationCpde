/**
 * Created by user on 2016/12/6.
 */
var num;
$(document).ready(function () {
   commit();
    $("#commit_bt").click(function () {
        commit();
    });
    //监听回车键，进行提交
    $(document).keyup(function(event){
        if(event.keyCode ==13){
            var code,captcha;
            var item=$("input:focus").parent();
            code= item.attr("code");
            captcha=item.children(".in_text").val();
            if(captcha==""||captcha==null){
                alert("输入不能为空");
                return;
            }
            fillCaptcha(item,code,captcha);
        }
    });
});
var commit=function () {

    num=$("#eidt_num").val();
    if (isNaN(num))
    {alert("非法字符:"+num);
        return ;
    }else {
        getCaptcha(num);
    }
};
function getCaptcha(code){
    $.ajax({
        url:'http://139.196.22.202:86/service/getCaptcha.php?r='+code,
        type:'get',
        dataType:'json',
        success:function(data){
            //alert(data.data[0].id);
            if(data.result=='success') {
                var ul=$("#item_ul");
                ul.empty();

                $.each(data.data,function(i,j){
                    // alert("mingz"+j.picture_name);
                    var pic ="http://139.196.22.202:86/uploads/"+j.picture_name;
                    var htmlstr ='';
                    htmlstr+='<li class="items" id=';
                    htmlstr+=j.id ;
                    htmlstr+=' code=';
                    htmlstr+=j.code;
                    htmlstr+='>';
                    htmlstr+='<img src=';
                    htmlstr+=pic;
                    htmlstr+=' class="img" /> <input type="text" name="val" value="" class="in_text" /> ' +
                    '<input type="button" class="sure_bt" name="com" value="确定" /> </li>';
                    ul.append(htmlstr);
                    // var s=".sure_bt:eq("+i+")";
                    $(".sure_bt:eq("+i+")").click(function () {
                        var code,captcha;
                        // $(".img:eq("+i+")").attr("src","captcha.png");
                        //alert(this.getAttribute("zx"));
                        var item=$(this).parent();
                        code= item.attr("code");
                        captcha=item.children(".in_text").val();
                        if(captcha==""||captcha==null){
                            alert("输入不能为空");
                            return;
                        }
                        fillCaptcha(item,code,captcha);
                    });
                if(num==1||data.data.length==1){
                    $("li:first").addClass('items_one');
                }
            });
            }
        }
        });

}
function fillCaptcha(item,code,captcha){
    $.ajax({
        url:'http://139.196.22.202:86/service/fillCaptcha.php?code='+code+'&captcha='+captcha,
        type:'get',
        dataType:'json',
        success:function(data){
            //alert(data.data[0].id);
            if(data.result=='success') {
                $("#errormsg").html("提交成功").show(300).delay(1500).hide(300);
                item.children(".img").attr("src","");
                item.children(".in_text").val("");

                $.ajax({
                    url:'http://139.196.22.202:86/service/getCaptcha.php?r=1',
                    type:'get',
                    dataType:'json',
                    success:function(data){
                        //alert(data.data[0].id);
                        if(data.result=='success') {
                            var pic ="http://139.196.22.202:86/uploads/"+data.data[0].picture_name;
                            item.attr("code",data.data[0].code);
                            item.attr("id",data.data[0].id);
                            item.children(".img").attr("src",pic);
                        }
                    }
                });
            }
        }
    });

}