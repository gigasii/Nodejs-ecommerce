exports.pageNotFound = (req, res, next) => {
    res.status(404).render('status/404', 
    {
        pageTitle: 'Page Not Found',
        path: '/error'
    });
}

exports.serverError = (req, res, next) => {
    res.status(500).render('status/500', 
    {
        pageTitle: 'Server Error',
        path: '/error'
    });
}