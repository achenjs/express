/**
 * Created by achen on 2017/1/12.
 */
$(function () {
    var cId = null,                             // 当前评论 id
        tId = null                              // 被评论用户 id
    var comment = function() {
        if($('#cId').length > 0){
            $('#cId').val(cId)
        }else {
            $('<input>').attr({
                type: 'hidden',
                id: 'cId',
                name: 'comment[cId]',
                value: cId
            }).appendTo('#commentFrom')
        }
        if($('#tId').length > 0){
            $('#tId').val(tId)
        }else {
            $('<input>').attr({
                type: 'hidden',
                id: 'tId',
                name: 'comment[tId]',
                value: tId
            }).appendTo('#commentFrom')
        }
    }
    $('.comment').on('click', function () {
        cId = $(this).attr('data-cid')
        tId = $(this).attr('data-tid')
        cId && comment()
    })
})




