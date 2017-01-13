$(function () {
    $('.del').on('click', function () {
        var id = $(this).attr('data-id')
        axios.delete('/admin/delete/' + id)
        .then((response) => {
            if(response.data.success == 200){
                $(this).parents('tr').remove()
            }
        })
        .catch((err) => {
            console.error(err)
        })
    })

    $('#douban').on('click', function () {
        var text = $('.douban').val()
        $.ajax({
            type: 'get',
            url: "https://api.douban.com/v2/movie/subject/" + text,
            dataType: 'jsonp',
            callback: 'callback',
            success: function (response) {
                $("#inputTitle").val(response.title)
                $("#inputDoctor").val(response.directors[0].name)
                $("#inputCounrty").val(response.countries[0])
                $("#inputPoster").val(response.images.large)
                $("#inputYear").val(response.year)
                $("#inputSummary").val(response.summary)
            }
        })
    })
})