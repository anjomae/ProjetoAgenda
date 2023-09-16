const express = require('express');
const route = express.Router();
const homeController = require('./src/Controllers/homeController.js')
const loginController = require('./src/Controllers/loginController.js')
const contatoController = require('./src/Controllers/contatoCotroller.js')
const { loginRequired } = require('./src/middlewares/middleware.js')
//routes.js define quem vai controlar as Rotas.

//rotas da home
route.get('/', loginRequired, homeController.index);

//rotas de login
route.get('/login/index', loginController.index)
route.post('/login/register', loginController.register)
route.post('/login/login', loginController.login)
route.get('/login/logout', loginController.logout)

//rotas de contato
route.get('/contato/index', loginRequired, contatoController.index);
route.post('/contato/register', loginRequired, contatoController.register)
route.get('/contato/index/:id', loginRequired, contatoController.editIndex);
route.post('/contato/edit/:id', loginRequired, contatoController.edit);
route.get('/contato/delete/:id', loginRequired, contatoController.delete);

module.exports = route;
