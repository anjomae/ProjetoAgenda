require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
mongoose.connect(process.env.CONNETIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.emit('pronto')
    })
    .catch(e => console.log('senha incorreta'));
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
// const helmet = require('helmet'); ler a documentação depois
const csrf = require('csurf'); // ler o documento depois
const routes = require('./routes');
const path = require('path');
const {middlewareGlobal, chekcsrfErro, csrfMiddleware} = require('./src/middlewares/middleware.js')


app.use(express.urlencoded({ extended: true }))

//Conteudo Statico Ex.: Css das paginas
app.use(express.static(path.resolve(__dirname, 'public')))
app.use(express.json())
const sessionOptions = session({
    secret:'Anjomae12',
    store: new MongoStore({ mongoUrl: process.env.CONNETIONSTRING }),
    resave: false,
    saveUninitialized: false,
});

app.use(sessionOptions);
app.use(flash());
// app.use(helmet())

app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')

app.use(csrf());
//Nossos proprios middlewares
app.use(middlewareGlobal);
app.use(chekcsrfErro);
app.use(routes);
/* 
caso estivesse especificando rota por exemplo app.use('/contato', meuMiddleware.middlewareGlobal) ficaria disponivel
apenas na rota, mas como não especifica nada então fica disponivel para todas as rotas usarem
*/

app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('to on')
        console.log("http://127.0.0.1:3000")
    });
})
