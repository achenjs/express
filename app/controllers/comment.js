const Comment = require('../models/comment')

exports.save = function(req, res) {
    const _comment = req.body.comment
    const movieId = _comment.movie
    const comment = new Comment(_comment)
    comment.save((err, comment) => {
        if(err) console.error(err)
        res.redirect('/movie/' + movieId)
    })
}