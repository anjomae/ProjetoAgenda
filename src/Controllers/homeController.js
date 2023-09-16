const contato = require('../models/contatoModel')

exports.index = async (req, res) => {
        try {
                const contatos = await contato.buscaContatos();
                res.render('index', { contatos });
        } catch (e) {
                console.log(e);
                return res.render('404');
        }
}

