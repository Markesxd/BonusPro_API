const express = require('express');
const db = require ('./db');
const cors = require('cors');

const app = express();
const port = 80;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
                  res.send('Hello World!' + process.version);
})

app.get('/usuarios', async (req, res) => {
                const list = await db.selectUsers();
                res.json(list);
});
app.get('/usuario/:tipo/:valor', async (req, res) => {
                const {tipo, valor} = req.params;
                let usuario;
                switch(tipo){
                        case 'id':
                                usuario = await db.selectUser(valor);
                                break;
                        case 'email':
                                usuario = await db.selectUserByEmail(valor);
                                break;
                        case 'senha':
                                usuario = await db.selectUserByPassword(valor);
                                break;
                        case 'tipo':
                                usuario = await db.selectUserByType(valor);
                                break;
                }
                res.json(usuario);
});

app.get('/saldo/:id', async (req, res) => {
                const {id} = req.params;
                const usuario = await db.selectUser(id);
                const {saldo} = usuario;
                res.json(saldo);
});

app.get('/empresas', async (req, res) => {
                const lista = await db.selectUserByType(2);
                res.json(lista);
});
app.get('/colaboradores/:empregador', async (req, res) => {
                const {empregador} = req.params;
                const lista = await db.selectUserByEmployer(empregador);
                res.json(lista);
});

app.post('/pagamento/:cedente/:beneficiario/:valor', async (req, res) => {
                let pagamento = req.params;
                pagamento.cedenteNome = req.body.cedenteNome;
                pagamento.beneficiarioNome = req.body.beneficiarioNome;
                pagamento.situacao = 0;

                const cedente = await db.selectUser(pagamento.cedente);
                const saldo = Number(cedente.saldo) - Number(pagamento.valor);
                if(saldo < 0){
                        res.json({message: 'Saldo insuficiente'});
                        return;
                }

                await db.updateUser('saldo', saldo, pagamento.cedente);
                await db.insertPayment(pagamento);
                res.json(pagamento);
});

app.get('/pagamentos/pendentes/:empresa', async (req, res) => {
                const {empresa} = req.params;
                const pendentes = await db.selectPaymentsStatus(empresa, 0);
                res.json(pendentes);
});

app.get('/pagamentos/pendente/:colaborador', async (req, res) => {
                const {colaborador} = req.params;
                const pendentes = await db.selectPaymentByCoworker(colaborador);
                res.json(pendentes);
});

app.post('/pagamentos/pendentes/confirmar/:id', async (req, res) => {
                const {id} = req.params;
                const pagamento = await db.selectPayment(id);
                const empresa = await db.selectUser(pagamento.beneficiario);
                const saldo = Number(empresa.saldo) + Number(pagamento.valor);

                await db.updateUser('saldo', saldo, pagamento.beneficiario);
                await db.updateStatus(id, 1);
                res.json({message: "Operação realizada com sucesso"});
});

app.post('/colaborador', async (req, res) => {
                let user = req.body;
                user.tipo = 3;
                user.saldo = 0;
                await db.insertUser(user);
                res.json(user);
});

app.post('/empresa', async (req, res) => {
                let user = req.body;
                user.tipo = 2;
                user.saldo = 0;
                user.empregador = 0;
                await db.insertUser(user);
                res.json(user);
});

app.post('/saldo/depositar', async (req, res) => {
                const {listaColaboradores, valor, idEmpresa} = req.body;

                const empresa = await db.selectUser(idEmpresa);
                const saldo = Number(empresa.saldo) - (Number(valor) * Number(listaColaboradores.length));

                if(saldo < 0){
                        res.json({message: 'Saldo insuficiente'});
                        return;
                }

                await db.updateUser('saldo', saldo, idEmpresa);

                for(let i = 0; i < listaColaboradores.length; i++){
                        let usuario = await db.selectUser(listaColaboradores[i]);
                        usuario.saldo = Number(usuario.saldo) + Number(valor);
                        await db.updateUser('saldo', usuario.saldo, listaColaboradores[i]);
                }


                res.json({message: 'operação concluida com sucesso'});
});

app.post('/saldo/adicionar/:empresaId/:saldo', async (req, res) => {
                const {empresaId, saldo} = req.params;
                let usuario = await db.selectUser(empresaId);
                usuario.saldo = Number(usuario.saldo) + Number(saldo);
                await db.updateUser('saldo', usuario.saldo, empresaId);
                res.json(usuario);
});

app.post('/saldo/retirar/:empresaId/:saldo', async (req, res) => {
                const {empresaId, saldo} = req.params;
                let usuario = await db.selectUser(empresaId);
                usuario.saldo = Number(usuario.saldo) - Number(saldo);
                if(usuario.saldo < 0){
                        res.json({message: 'o saldo não pode ser negativo'});
                        return;
                }
                await db.updateUser('saldo', usuario.saldo, empresaId);
                res.json(usuario);
});

app.listen(port, () => {
                  console.log('App running');
}
);
      
