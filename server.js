const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');

// Databse details..........

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'dks@2002',
        database: 'loginform'
    }
})

// Data collection from server..................

const app = express();

let intialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(intialPath));  

app.get('/', (req, res) => {
    res.sendFile(path.join(intialPath, "index.html"));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(intialPath, "login.html"));
})
app.get('/register', (req, res) => {
    res.sendFile(path.join(intialPath, "register.html"));
})

app.post('/register-user', (req, res) => {
    const { name, email, mobile, password, confirmpassword} = req.body;

    if(!name.length || !email.length || !mobile.length || !password.length || !confirmpassword.length){
        res.json('fill all the fields');
    } else{
        db("users").insert({
            name: name,
            email: email,
            mobile: mobile,
            password: password,
            confirmpassword: confirmpassword
        })
        .returning(["name", "email"])
        .then(data => {
            res.json(data[0])
        })

// if user have already register then alert message...........

        .catch(err => {
            if(err.detail.includes('already exists')){
                res.json('email already exists');
            }
        })
    }
})

// login scripts..............

app.post('/login-user', (req, res) => {
    const { email, password } = req.body;

    db.select('name', 'email')
    .from('users')
    .where({
        email: email,
        password: password
    })
    .then(data => {
        if(data.length){
            res.json(data[0]);
        } else{
            res.json('email or password is incorrect');
        }
    })
})

app.listen(3000, (req, res) => {
    console.log('listening on port 3000......')
})

//----------------------suryesh--------------------


//---------------------Thank you-----------------