const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cfg = require('./config/config');
const Client = require('./model/client');
const Session = require('./model/session');

const app = express();
app.use(express.json());
app.use(cors());

const url=database_url = "mongodb+srv://projetofiap:mbaFiap2023@projetofiap.jkfdhaz.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology:true})


// Cadastrar novos clientes
app.post("/register", (req,res) => {

    const token = req.headers.token;

    const sessionPromise = Session.findOne({token, token}).exec();
    sessionPromise
        .then(session => {
            console.log(session.token)
            const client = new Client(req.body);
            client.id = new mongoose.Types.ObjectId();

            client
                .save()
                .then((result) => {
                    res.status(201).send({ output: `Cadastro realizado`, payload: result} );
                })
                .catch((error) => 
                    res.status(500).send({output: `Erro ao cadastrar -> ${error}`})
                )
        })
        .catch(err => {
            console.log("erro ao pesquisar um client")
            res.status(500).send({output: `Erro ao se autenticar 2 -> ${err}`})
        });
});

// Atualizar dados do cliente
app.put("/update", (req, res) => {

    const token = req.headers.token;

    const sessionPromise = Session.findOne({token, token}).exec();
    sessionPromise
        .then(session => {
            console.log(session.token)
            const clientBody = new Client(req.body);

            const update = Client.findOneAndUpdate({id: req.headers.id}, {$set:{name: clientBody.name, age: clientBody.age}}, {upsert: true}).exec();
            update
            .then(client => {
                console.log(client)
                res.status(200).send({ output: `Senha alterada com sucesso.`, payload: client } );
            })
            .catch(err => {
                console.log("erro ao pesquisar um client")
                res.status(500).send({output: `Erro ao se autenticar 2 -> ${err}`})
            });
        })
        .catch(err => {
            console.log("erro ao pesquisar um client")
            res.status(500).send({output: `Erro ao se autenticar 2 -> ${err}`})
        });
});

app.listen(5333, () => console.log(`Servidor online in http://localhost:5333`));