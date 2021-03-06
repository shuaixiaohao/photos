//模态框居中的控制
function centerModals(){
    $('.modal').each(function(i){   //遍历每一个模态框
        var $clone = $(this).clone().css('display', 'block').appendTo('body');    
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top-30);  //修正原先已经有的30个像素
    });
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);
    $(".order-accept").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-accept").attr("order-id", orderId);
    });
    $(".order-reject").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-reject").attr("order-id", orderId);
    });

    $.get('/order/fd/', function (data) {
        var lorder_html = template('orders-list',{o_list:data.o_list});
        $('.orders-list').html(lorder_html);

        //接单
        $('.order-accept').on('click', function () {
            var orderId = $(this).parents('li').attr('order-id')
            $('.modal-accept').attr('order-id', orderId)
        })
        //拒单
        $('.order-reject').on('click', function () {
            var orderId = $(this).parents('li').attr('order-id')
            $('.modal-reject').attr('order-id', orderId)
        })
    })


});



//确定接单
$('.modal-accept').click(function () {
    var order_id = $(this).attr('order-id');
    $.ajax({
        url: '/order/order/' + order_id + '/',
        type: 'PUT',
        dataType: 'json',
        data: {'status': 'WAIT_PAYMENT'},
        success: function (data) {
            // $('#accept-modal').hide()
            // $('.modal-backdrop').css({'display': 'None'})
            $("#accept-modal").modal('hide');
            $('li[order-id=\"'+ order_id +'\"] .order-operate').hide()
            $('#' + order_id).text('待支付');

        }
    })
})