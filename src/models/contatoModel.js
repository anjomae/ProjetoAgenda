const mongoose = require('mongoose');
const validator = require('validator');

const contatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  telefone: { type: String, required: false, default: '' },
  criadoEm: { type: Date, default: Date.now }

});

const contatoModel = mongoose.model('contato', contatoSchema);

class contato {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;
  }

  static async buscaPorId(id) {
    if (typeof id !== 'string') return;
    const contato = await contatoModel.findById(id);
    return contato;
  }

  static async delete(id) {
    if (typeof id !== 'string') return;
    const contato = await contatoModel.findOneAndDelete({_id: id});
    return contato;
  }


  static async buscaContatos() {

    const contato = await contatoModel.find()
    .sort({criadoEm: 1});
    return contato;
  }

  async register() {
    this.Valida()
    if (this.errors.length > 0) return;
    this.contato = await contatoModel.create(this.body)
  }

  Valida() {

    this.cleanup();

    if (!this.body.nome) this.errors.push('Nome é um campo obrigatório');
    if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
    if (!this.body.email && !this.body.telefone) this.errors.push('O contato precisa de uma forma de ser contatado email ou telefone');
  }

  cleanup() {
    for (let key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      nome: this.body.nome,
      sobrenome: this.body.sobrenome,
      email: this.body.email,
      telefone: this.body.telefone,
    }
  }

  async edit(id) {
    if (typeof id !== 'string') return;
    this.Valida();
    if (this.errors.length > 0) return;

    this.contato = await contatoModel.findByIdAndUpdate(id, this.body, { new: true });
  }

}

module.exports = contato;