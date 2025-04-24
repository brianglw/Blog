import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;
const posts = {list: []};
let editingIndex;
//enable static files in ejs files
app.use(express.static('public'));

//enable body-parser to access body requests
app.use(bodyParser.urlencoded({extended: true}));

//post route for blog submissions 
app.post('/submit', (req, res) => {
    const data = {...req.body, date: new Date().toLocaleDateString(), id: posts.list.length };
    posts.list.push(data);
    console.log(data);
    console.log(posts);
    res.render("index.ejs", posts);
})

//set up routes for edit and delete requests
app.post('/edit', (req, res) => {
    let id = req.body.edit;
    let reqindex = posts.list.findIndex(item => item.id == id); 
    console.log(id, posts.list.findIndex(item => item.id == id));
    //render another route include a post request there to replace title and content and date values 
    res.render("revise.ejs", {title: posts.list[reqindex].title, content: posts.list[reqindex].content});
    editingIndex = posts.list[reqindex].id;
})

app.post('/', (req, res) =>{
    console.log('remove route requested');
    let id = req.body.remove;
    remove(id);
    res.render('index.ejs', posts);
})

app.post('/revisions', (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const date = new Date().toLocaleDateString();
    const data = {title: title, content: content, date: date, id: posts.list.length };
    posts.list.push(data);
    remove(editingIndex);
    editingIndex = null;
    res.render("index.ejs", posts);
})
//set up the home page
app.get('/', (req, res) => {
    res.render("index.ejs", posts);
});

//sets up the write page
app.get('/write', (req, res) => {
    res.render("write.ejs");
})

function remove(id) {
    posts.list = posts.list.filter((item) => {
        if (item.id != id) {
            return item;
        }
    })
    console.log(posts.list);
}

//launches the server at port and notifies the user
app.listen(PORT, ()=> {
    console.log("Server running successfully");
});