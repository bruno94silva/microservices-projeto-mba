const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Financial = require('./model/financial');
const Session = require('./model/session')

const app = express();
app.use(express.json());
app.use(cors());

const url=database_url = "mongodb+srv://projetofiap:mbaFiap2023@projetofiap.jkfdhaz.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology:true})


// Cadastrar dados financeiros do cliente
app.post("/register", (req,res) => {

    const token = req.headers.token;

    const sessionPromise = Session.findOne({token, token}).exec();
    sessionPromise
        .then(session => {
            console.log(session.token)
            const financial = new Financial(req.body);
            financial.id = new mongoose.Types.ObjectId();
        
            financial
                .save()
                .then((result) => {
                    res.status(201).send({ output: `Dados financeiros cadastrados com sucesso`, payload: result} );
                })
                .catch((error) => 
                    res.status(500).send({output: `Erro ao cadastrar dados financeiros -> ${error}`})
                )
        })
        .catch(err => {
            console.log("erro ao pesquisar um client")
            res.status(500).send({output: `Erro ao se autenticar 2 -> ${err}`})
        });
});

// Atualizar dados financeiros do cliente
// Atualizar dados do cliente
app.put("/update", (req, res) => {

    const token = req.headers.token;

    const sessionPromise = Session.findOne({token, token}).exec();
    sessionPromise
        .then(session => {
            console.log(session.token)
            const financialBody = new Financial(req.body);

            const update = Financial.findOneAndUpdate(
                {id: req.headers.id}, 
                {$set:{bankName: financialBody.bankName, typeAccount: financialBody.typeAccount, accountPersonName: financialBody.accountPersonName, cardLimit: financialBody.cardLimit}}, 
                {upsert: true}
            )
            .exec();
            
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

app.listen(6667, () => console.log(`Servidor online in http://localhost:6667`));