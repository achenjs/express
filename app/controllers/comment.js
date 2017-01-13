const Comment = require('../models/comment')

exports.save = function(req, res) {
    const _comment = req.body.comment
    const movieId = _comment.movie
    if(_comment.cId) {
        Comment.findById(_comment.cId, (err, comment) => {
            console.log(comment)
            if(err) console.error(err)
            var reply = {
                from: _comment.from,
                to: _comment.tId,
                content: _comment.content
            }
            comment.reply.push(reply)
            comment.save((err, comment) => {
                if(err) console.error(err)
                res.redirect('/movie/' + movieId)
            })
        })
    }else {
        const comment = new Comment(_comment)
        comment.save((err, comment) => {
            if(err) console.error(err)
            res.redirect('/movie/' + movieId)
        })
    }
}
