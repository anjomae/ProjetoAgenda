exports.middlewareGlobal = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.errors = req.flash('erros');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
}

exports.chekcsrfErro = (err, req, res, next) => {
    if (err) {
        console.log(err)
        return res.send('404');
    }
    next();
}

exports.loginRequired = (req, res, next) => {
    if (!req.session.user) {
        req.flash('erros', 'você precisa estar logado para ver está pagina.');
        req.session.save(()=> res.redirect('/login/index'));
        return
    }
    next();
}