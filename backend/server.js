const express = require('express')
const app = express();
require('dotenv').config()

const port = 3000
const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PW,
  database : process.env.DB_NAME
});

connection.connect();

app.use(express.json())

app.post('/api/question', (req, res) => {
    const questions = req.body.map(que => {
        return [que.quetion, que.options]
    })
    connection.query('INSERT INTO quetions(quetion, options) values ?', [questions], function (error, results, fields) {
        if (error) throw error;
        res.json(done(results.insertId))
    });
})

app.get('/api/questions', (req, res) => {
    connection.query(`SELECT id,quetion,options from quetions`, function (error, results, fields) {
        if (error) throw error;
        res.json(done(results));
    });
})

app.get('/api/jobapplications', (req, res) => {
    connection.query(`SELECT id,email,role from candidate`, function (error, results, fields) {
        if (error) throw error;
        res.json(done(results));
    });
})

app.post('/api/checkuser', (req, res) => {
    const email = req.body.email
    connection.query(`SELECT email from candidate where email = '${email}'`, function (error, results, fields) {
        if (error) throw error;
        res.json(done(results[0]));
    });
})

app.get('/api/question/:id', (req, res) => {
    const que_id = req.params.id
    connection.query(`SELECT id,quetion,options from quetions where id = ${que_id}`, function (error, results, fields) {
        if (error) throw error;
        res.json(done(results[0]));
    });
})

app.get('/api/applicant/:id', (req, res) => {
    const que_id = req.params.id
    connection.query(`SELECT a.id,a.email,b.quetions_id,b.answer,c.quetion from candidate as a left join history as b on (a.id = candidate_id) left join quetions as c on (c.id = b.quetions_id)  where a.id = ${que_id}`, function (error, results, fields) {
        if (error) throw error;
        res.json(done(results));
    });
})

app.delete('/api/question/:id', (req, res) => {
    const que_id = req.params.id
    connection.query(`DELETE FROM quetions where id = ${que_id}`, function (error, results, fields) {
        if (error) throw error;
        res.json(done(results));
    });
})

app.post('/api/jobapply', (req, res) => {
    const email = req.body.user.email
    const role = req.body.user.role
    connection.query('INSERT INTO candidate SET ?', {email, role }, function (error, results, fields) {
        const candidate_id = results?.insertId
        const questions = req.body.questions.map(que => {
            return [
                candidate_id,
                que.quetion_id,
                que.ans
            ]
        })
        if(candidate_id){
            connection.query('INSERT INTO history (candidate_id,quetions_id,answer) values ?', [questions], function (error, results, fields) {
                if (error) throw error;
                res.json(done(results.insertId))
            });    
        }else{
            res.json(failed("Email address already registerd!"))
        }
    });
})

function done(data){
    return {
        status: "success",
        data: data,
        msg: ""
    }
}

function failed(msg){
    return {
        status: "failed",
        msg
    }
}

app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
});
