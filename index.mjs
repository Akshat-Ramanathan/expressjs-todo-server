import express from 'express';
const app = express();
// var bodyParser = require('body-parser');
const port = 3000
import { LowSync, JSONFileSync } from 'lowdb'

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded());
// app.use(bodyParser());

const db = new LowSync(new JSONFileSync('./db.json'));

app.get('/', async (req, res) => {
    db.read();
    res.render('base', { todo_list: db.data.todo_list ?? [] });
});

app.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    db.read();
    var newList = db.data.todo_list.filter(todo => todo.id != id);
    db.data.todo_list = [...newList];
    db.write();
    res.redirect('/');
});

app.get('/update/:id', async (req, res) => {
    const { id } = req.params;
    db.read();
    var newList = db.data.todo_list.map(todo => {
        if (todo.id == id) {
            todo.complete = !todo.complete
        }
        return todo;
    });
    db.data.todo_list = [...newList];
    db.write();
    res.redirect('/');
});

app.post('/add', async (req, res) => {
    db.read();
    var { title } = req.body;
    db.data.todo_list.push(
        {
            "id": db.data.todo_list.length+1,
            title,
            "complete": false
        }
    );
    db.write();
    res.redirect('/');
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})