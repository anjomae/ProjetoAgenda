const Login = require('../models/LoginModel');


exports.index = (req, res) => {
    if(req.session.user) return ('/')
        return res.render('login');
}

exports.register = async (req, res) => {
    const login = new Login(req.body)
    try {
        await login.register()
        if (login.errors.length > 0) {
            req.flash('erros', login.errors)
            req.session.save(() => {
                return res.redirect('/login/index');
            });
            return;
        }

        req.flash('success', 'seu usuario foi criado com sucesso.')
        req.session.save(() => {
            return res.redirect('/login/index');
        });

    } catch (e) {
        console.log(e)
        res.render('404');
    }

}
exports.login = async (req, res) => {
    try {
    const login = new Login(req.body)
        await login.login()

        if (login.errors.length > 0) {
            req.flash('erros', login.errors)
            req.session.save(() => {
                return res.redirect('/login/index');
            });
            return;
        }
    
        req.flash('success', 'login efetuado com sucesso')
        req.session.user = login.user;
        req.session.save(() => {
            return res.redirect('/');
        });

    } catch (e) {
        console.log(e)
        res.render('404');
    }

}
exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login/index'); 
}

