import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;
let list = [];
let editingIndex;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

//1. A post route for writing a new blog post
    //Adds title, content, date, and id keys into an data object
    //Pushes data into list and loop renders the entries into index.ejs
app.post('/add', (req, res) => {
    const data = {...req.body, date: new Date().toLocaleDateString(), id: list.length };
    list.push(data);
    res.render("index.ejs", {blog: list});
})

//2. A post route for editing a specific post
    //Request contains ID of the object, corresponding to its index 
    //Conditionally renders the title and contents onto write.ejs with the property isEditing
    //Delete the post with your removeEntry method, and hit up the /add route when user submits 
    //Bug: edit should not remove your entry if you click on home page while in /write
app.post('/edit', (req, res) => {
    let editingId = req.body.id;
    let editingIndex = list.findIndex(entry => entry.id == editingId); 
    res.render("write.ejs", {title: list[editingIndex].title, content: list[editingIndex].content, editingId: editingId});
    removeEntry(editingId);
    refresh();
})

//3. A post route for deleting your entry
    //Request contains ID of the object, which calls removeEntry(id) and renders the new posts
    //Call on refreshID() to sort IDs, remember with a forEach() loop we iterate over the element properties
app.post('/delete', (req, res) =>{
    console.log('/delete route requested');
    let deleteId = req.body.delete;
    removeEntry(deleteId);
    refresh();
    res.render('index.ejs', {blog: list});
})

//set up the home page
app.get('/', (req, res) => {
    res.render("index.ejs", {blog: list});
});

//sets up the write page
app.get('/write', (req, res) => {
    res.render("write.ejs");
})

function refresh() {
    list.map((entry, index) => {
        entry.id = index;
        return entry;
    });
    console.log(list);
}
function removeEntry(id) {
    list = list.filter(entry => {
        if (entry.id != id) {
            return entry;
        }
    })
    console.log(list);
}

//launches the server at port and notifies the user
app.listen(PORT, ()=> {
    console.log("Server running successfully");
});