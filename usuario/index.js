const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./model/user');
const Session = require('./model/session');

const app = express();
app.use(express.json());
app.use(cors());

const url=database_url = "mongodb+srv://projetofiap:mbaFiap2023@projetofiap.jkfdhaz.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology:true})

// Cadastrar usuário
app.post("/register", (req,res) => {
    const user = new User(req.body);

    bcrypt
    .hash(user.password, 10)
    .then(hash => {
      console.log('Hash: ', hash)
      console.log(hash);
      user.password = hash
        user
            .save()
            .then((result) => {
                res.status(201).send({ output: `Usuário cadastrado com sucesso`, payload: result} );
            })
            .catch((error) => 
                res.status(500).send({output: `Erro ao cadastrar usuário -> ${error}`})
            )
    })
    .catch(err => console.error(err.message))
});

// Alterar senha 
app.put("/changePassword", (req, res) => {
    console.log(req.headers)
    const email = req.headers.email;
    const oldPassword = req.headers.oldpassword;
    const newPassword = req.headers.newpassword;
    const confirmNewPass = req.headers.confirmnewpassword;

    console.log(email);
    console.log(oldPassword);
    console.log(newPassword);
    console.log(confirmNewPass);

    bcrypt
    .hash(oldPassword, 10)
    .then(hash1 => {
        bcrypt
        .hash(newPassword, 10)
        .then(hash2 => {            
          const update = User.findOneAndUpdate({email: email, password: hash1}, {$set:{password: hash2}}, {upsert: true}).exec();
          
          update
          .then(user => {
              console.log(user)
              res.status(200).send({ output: `Senha alterada com sucesso.`, payload: user } );
          })
          .catch(err => {
              console.log("erro ao pesquisar um client")
              res.status(500).send({output: `Erro ao se autenticar 2 -> ${err}`})
          });
        })
        .catch(err => console.error(err.message))
    })
    .catch(err => console.error(err.message))
});

// Autenticar o usuário
app.post("/authentication", (req, res) => {
    
    const email = req.headers.email;
    const password = req.headers.password;

    bcrypt
    .hash(password, 10)
    .then(hash => {
        const userPromise = User.findOne({email, hash}).exec();
    
        const token = jwt.sign(email, 'teste_senha_criptogravada');
    
        userPromise
        .then(user => {
            const session = Session({token, user});
    
            session
            .save()
            .then((result) => {
                res.status(201).send({ output: `Autenticação realizada com sucesso. Token de sessão: ${token}`, payload: result} );
            })
            .catch((error) => 
                res.status(500).send({output: `Erro ao cadastrar usuário -> ${error}`})
            )
        })
        .catch(err => {
            console.log("erro ao pesquisar um client")
            res.status(500).send({output: `Erro ao se autenticar 2 -> ${err}`})
        });
    })
    .catch(err => console.error(err.message))
});

app.listen(4000, () => console.log(`Servidor online in http://localhost:4000`));