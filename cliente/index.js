require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Client = require('./model/client');
const Session = require('./model/session');

const app = express();
app.use(express.json());
app.use(cors());

const url=database_url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@projetofiap.jkfdhaz.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology:true})

// Cadastrar novos clientes
app.post("/register", (req,res) => {
    const token = req.headers.token;

    if(token == "") {
        res.status(401).send({ output: `Informe um token de sessão`} );
    } else {
        const sessionPromise = Session.findOne({token, token}).exec();
        sessionPromise
        .then(session => {
            const client = new Client(req.body);
            client.id = new mongoose.Types.ObjectId();
            client
                .save()
                .then((result) => {
                    res.status(201).send({ output: `Cliente cadastrado com sucesso.`, payload: result} );
                })
                .catch((error) => 
                    res.status(500).send({output: `Erro ao tentar cadastrar um novo cliente -> ${error}`})
                )
        })
        .catch(err => {
            res.status(500).send({output: `Erro ao tentar cadastrar um novo cliente -> ${err}`})
        });
    }
});

// Atualizar dados do cliente
app.put("/update", (req, res) => {
    const token = req.headers.token;

    if(token == "") {
        res.status(401).send({ output: `Informe um token de sessão`} );
    } else {
        const sessionPromise = Session.findOne({token, token}).exec();
        sessionPromise
        .then(session => {
            const clientBody = new Client(req.body);

            const update = Client.findOneAndUpdate({id: req.headers.id}, {$set:{name: clientBody.name, age: clientBody.age}}, {upsert: true}).exec();
            update
            .then(client => {
                res.status(200).send({ output: `Dados atualizados com sucesso.`, payload: client } );
            })
            .catch(err => {
                res.status(500).send({output: `erro ao tentar atualizar os dados -> ${err}`})
            });
        })
        .catch(err => {
            res.status(500).send({output: `erro ao tentar atualizar os dados -> ${err}`})
        });
    }
});

app.listen(process.env.PORT, () => console.log(`Servidor online in http://${process.env.DB_HOST}:${process.env.PORT}`));