'use strict'

var controller = {

    getIndex: function (req, res) {
        res.render('pages/index', {
            PageTitle: 'Foro',
            path:'/'
        });
    }
};

module.exports = controller;