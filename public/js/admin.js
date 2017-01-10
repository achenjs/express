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
})