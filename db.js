async function connect(){
            if(global.connection && global.connection.state !== 'disconnected')
                        return global.connection;

            const mysql = require("mysql2/promise");
            const connection = await mysql.createConnection("Censored :D");
            console.log("Conectou no MySQL!");
            global.connection = connection;
            return connection;
}

async function selectUsers(){
            const conn = await connect();
            const [rows] = await conn.query('SELECT * FROM usuario;');
            console.log("select * from usuario");
           //console.log(rows);
            return rows;
}

async function selectPayments(){
                    const conn = await connect();
                    const [rows] = await conn.query('SELECT * FROM pagamento;');
                    console.log("select * from pagamento");
                   //console.log(rows);
                    return rows;
}
async function selectPayment(id){
        const conn = await connect();
        const query = `SELECT * FROM pagamento WHERE id="${id}";`;
        console.log(query);
        const list = await conn.query(query);
        return list[0][0];
}

async function selectUser(id){
                const conn = await connect();
                const user = await conn.query('SELECT * FROM usuario WHERE id=' + id + ';');
                console.log('SELECT * FROM usuario WHERE id="' + id + '"');
                const value = user[0][0];
                return value;
}

async function insertUser(user){
        const conn = await connect();
        const {nome, email, senha, empregador, saldo, tipo} = user;
        console.log('INSERT INTO usuario (nome, email, senha, empregador, saldo, tipo) VALUES ("'+ nome + '", "' + email + '", "' + senha + '", "' + empregador + '", "' + saldo + '", "' + tipo + '")');
        await conn.query('INSERT INTO usuario (nome, email, senha, empregador, saldo, tipo) VALUES ("'+ nome + '", "' + email + '", "' + senha + '", "' + empregador + '", "' + saldo + '", "' + tipo + '");');
}
async function updateUser(field, value, id){
        const conn = await connect();
        console.log('UPDATE usuario SET ' + field +'="' + value + '" WHERE id="' + id + '"');
        await conn.query('UPDATE usuario SET ' + field +'="' + value + '" WHERE id="' + id + '";');
}

async function selectUserByType(type){
        const conn = await connect();
        console.log('SELECT * FROM usuario WHERE tipo="' + type + '"');
        const lista = await conn.query('SELECT * FROM usuario WHERE tipo="' + type + '";');
        return lista[0];
}

async function selectUserByEmployer(employer){
        const conn = await connect();
        console.log('SELECT * FROM usuario WHERE empregador="' + employer + '";');
        const list = await conn.query('SELECT * FROM usuario WHERE empregador="' + employer + '";');
        return list[0];
}

async function insertPayment(payment){
        const conn = await connect();
        console.log('INSERT INTO pagamento (valor, status, cedente, cedenteNome, beneficiario, beneficiarioNome) VALUES ("' + payment.valor + '", "' + payment.situacao  + '", "' +  payment.cedente + '", "' + payment.cedenteNome + '", "' +  payment.beneficiario + '", "' + payment.beneficiarioNome + '")');
        await conn.query('INSERT INTO pagamento (valor, status, cedente, cedenteNome, beneficiario, beneficiarioNome) VALUES ("' + payment.valor + '", "' + payment.situacao  + '", "' +  payment.cedente + '", "' + payment.cedenteNome + '", "' +  payment.beneficiario + '", "' + payment.beneficiarioNome + '")');

}
async function selectPaymentsStatus(id, status){
        const conn = await connect();
        console.log('SELECT * FROM pagamento WHERE beneficiario=' + id + ' AND status=' + status);
        const list = await conn.query('SELECT * FROM pagamento WHERE beneficiario=' + id + ' AND status=' + status + ';');
        return list[0];
}

async function updateStatus(id, value){
        const conn = await connect();
        console.log('UPDATE pagamento SET status=' + value + ' WHERE id=' + id);
        await conn.query('UPDATE pagamento SET status=' + value + ' WHERE id=' + id + ';');
}
async function selectUserByEmail(email){
        const conn = await connect();
        const query = 'SELECT * FROM usuario WHERE email="' + email + '";';
        console.log(query);
        const list = await conn.query(query);
        return list[0];
}

async function selectUserByPassword(password){
        const conn = await connect();
        const query = 'SELECT * FROM usuario WHERE senha="' + password + '";';
        console.log(query);
        const list = await conn.query(query);
        return list[0];
}

async function selectPaymentByCoworker(id){
        const conn = await connect();
        const query = `SELECT * FROM pagamento WHERE cedente=${id}`;
        console.log(query);
        const list = await conn.query(query);
        return list[0];
}

module.exports = {selectPayment, selectUsers, selectPayments, selectUser, insertUser, updateUser, selectUserByType, selectUserByEmployer, insertPayment, selectPaymentsStatus, updateStatus, selectUserByEmail, selectUserByPassword, selectPaymentByCoworker}
