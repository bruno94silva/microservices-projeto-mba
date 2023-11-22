require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Financial = require('./model/financial');
const Session = require('./model/session')

const app = express();
app.use(express.json());
app.use(cors());

const url=database_url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@projetofiap.jkfdhaz.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology:true})


// Cadastrar dados financeiros do cliente
app.post("/register", (req,res) => {

    const token = req.headers.token;

    if(token == "") {
        res.status(401).send({ output: `Informe um token de sessão`} );
    } else {
        const sessionPromise = Session.findOne({token, token}).exec();
        sessionPromise
        .then(session => {
            const financial = new Financial(req.body);
            financial.id = new mongoose.Types.ObjectId();
        
            financial
                .save()
                .then((result) => {
                    res.status(201).send({ output: `Dados financeiros cadastrados com sucesso`, payload: result} );
                })
                .catch((error) => 
                    res.status(500).send({output: `Erro ao tentar cadastrar dados financeiros -> ${error}`})
                )
        })
        .catch(err => {
            res.status(500).send({output: `Erro ao tentar cadastrar dados financeiros -> ${err}`})
        });
    }
});

// Atualizar dados financeiros do cliente
// Atualizar dados do cliente
app.put("/update", (req, res) => {
    const token = req.headers.token;

    if(token == "") {
        res.status(401).send({ output: `Informe um token de sessão`} );
    } else {
        const sessionPromise = Session.findOne({token, token}).exec();
        sessionPromise
        .then(session => {
            const financialBody = new Financial(req.body);

            const update = Financial.findOneAndUpdate(
                {id: req.headers.id}, 
                {$set:{bankName: financialBody.bankName, typeAccount: financialBody.typeAccount, accountPersonName: financialBody.accountPersonName, cardLimit: financialBody.cardLimit}}, 
                {upsert: true}
            )
            .exec();
            
            update
            .then(client => {
                res.status(200).send({ output: `Dados financeiros atualizados com sucesso.`, payload: client } );
            })
            .catch(err => {
                res.status(500).send({output: `Erro ao tentar atualizar os dados financeiros -> ${err}`})
            });
        })
        .catch(err => {
            res.status(500).send({output: `Erro ao tentar atualizar os dados financeiros -> ${err}`})
        });
    }
});

app.listen(process.env.PORT, () => console.log(`Servidor online in http://${process.env.DB_HOST}:${process.env.PORT}`));