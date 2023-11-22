require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cfg = require('./config/config');
const User = require('./model/user');
const Session = require('./model/session');

const app = express();
app.use(express.json());
app.use(cors());

const url=database_url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@projetofiap.jkfdhaz.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology:true})

// Cadastrar usuário
app.post("/register", (req,res) => {
    const user = new User(req.body);

    bcrypt
    .hash(user.password, 10)
    .then(hash => {
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
    const email = req.headers.email;
    const oldPassword = req.headers.oldpassword;
    const newPassword = req.headers.newpassword;
    const confirmNewPass = req.headers.confirmnewpassword;

    if(newPassword != confirmNewPass) {
        res.status(400).send({ output: `A nova senha ${newPassword} e a confimação da nova senha ${confirmNewPass} são diferentes.`} );
    } else {
        bcrypt
        .hash(oldPassword, 10)
        .then(hash1 => {
            const findUser = User.findOne({email: email, password: hash1}).exec();
            findUser.then(user => {
                bcrypt
                .hash(newPassword, 10)
                .then(hash2 => {            
                const update = User.findOneAndUpdate({email: email, password: hash1}, {$set:{password: hash2}}, {upsert: true}).exec();
                update
                .then(user => {
                    res.status(200).send({ output: `Senha alterada com sucesso.`} );
                })
                .catch(err => {
                    res.status(500).send({output: `Erro ao tentar alterar a senha -> ${err}`})
                });
                })
                .catch(err => {
                    res.status(500).send({output: `Erro ao tentar alterar a senha -> ${err}`})
                });
            })
            .catch(err => {
                res.status(500).send({output: `Erro ao tentar alterar a senha -> ${err}`})
            });
        })
        .catch(err => {
            res.status(500).send({output: `Erro ao tentar alterar a senha -> ${err}`})
        });
    }
});

// Autenticar o usuário
app.post("/authentication", (req, res) => {
    const email = req.headers.email;
    const password = req.headers.password;

    bcrypt
    .hash(password, 10)
    .then(hash => {
        const token = jwt.sign(email, cfg.jwt_key);
    
        const userPromise = User.findOne({email, hash}).exec();
        userPromise
        .then(user => {
            const session = Session({token, user});
            session
            .save()
            .then((result) => {
                res.status(201).send({ output: `Autenticação realizada com sucesso. Token de sessão: ${token}`, payload: result} );
            })
            .catch((error) =>  {
                res.status(500).send({output: `Erro ao tentar autenticar usuário. -> ${error}`})
            })
        })
        .catch((error) =>  {
            res.status(500).send({output: `Erro ao tentar autenticar usuário. -> ${error}`})
        })
    })
    .catch((error) =>  {
        res.status(500).send({output: `Erro ao tentar autenticar usuário. -> ${error}`})
    });
});

app.listen(process.env.PORT, () => console.log(`Servidor online in http://${process.env.DB_HOST}:${process.env.PORT}`));