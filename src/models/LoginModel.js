const mongoose = require('mongoose');
const validator = require('validator');
//ler documentação bcrypt faz o hash de senha
const bcrypt = require('bcryptjs');


const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }
    async login() {
        this.Valida();
        if (this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email });

        if (!this.user) {
            this.errors.push('Usuário não existe.')
            return;
        }

        if (!bcrypt.compareSync(this.body.password, this.user.password)){
            this.errors.push('Usuário ou senha invalidos.')
            this.user = null;
            return;
        }

    }

    async register() {
        this.Valida();
        if (this.errors.length > 0) return;

        this.userExists();

        if (this.errors.length > 0) return;

        const salt = bcrypt.genSaltSync();
        this.body.password = bcrypt.hashSync(this.body.password, salt);

        const user = await LoginModel.create(this.body);

    }

    async userExists() {
        this.user = await LoginModel.findOne({ email: this.body.email });
        if (this.user) {
            this.errors.push('Usuário já existe')
        }
    }

    Valida() {
        // valida se os campos são strings e separa apenas o email e a senha 

        this.cleanup();
        //validar campos
        //o e-mail precisa ser válido
        if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido')

        //A senha precisa ter entre 3 e 12 chars
        if (this.body.password.length < 3 || this.body.password.length >= 12) this.errors.push('A senha precisa ter entre 3 e 12 caracteres')

    }

    cleanup() {
        for (let key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        }
    }
}

module.exports = Login;