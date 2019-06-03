var http = require('http');
var express = require('express');
var app = express();

// configurations

//be able to read the request data

var bparse = require('body-parser');
app.use(bparse.json());

/* enable CORS for testing */
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* server html files to the client  */
var ejs = require('ejs');
app.set('views', __dirname + '/views'); //configure 
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

/* send static files (css, js, media, pdf) */
app.use(express.static(__dirname + '/views'));


/* mongoose connection */
var mongoose = require('mongoose');
mongoose.connect('mongodb://ThiIsAPassword:TheRealPassword@cluster0-shard-00-00-euadh.mongodb.net:27017,cluster0-shard-00-01-euadh.mongodb.net:27017,cluster0-shard-00-02-euadh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin', {
    userMongoClient: true
});

var db = mongoose.connection;
var Todo;

/* end mongo config */

app.get('/', function (req, res) {
    res.render("index.html");
});

app.get('/about', function (req, res) {
    res.render("about.html");
});

app.get('/about', function (req, res) {
    res.render("test.html");
});

app.get('/API/test', function (req, res) {
    res.send("Working");
});

app.get('/temp', function (req, res) {
    res.render("temp.html");
});

app.post('/API/temp', function (req, res) {
    var f = req.body.value;
    console.log("********",f);
    f = f * 1; //force convert to number
    var c = (f - 32) * 5 / 9;
    console.log(c);
    res.json({result: c});

});

//create a new endpoint /test
//render sme html with a button 
//when you click on that button 
//perform a get request to api/test
//simple string 

var cnt = 3; //unique id for todos
var todoDB = [{
        text: "TODO 1",
        user: "Marian",
        status: 0,
        id: 1,
        priority: "P2"
    },
    {
        text: "Bathe baby",
        user: "Marian",
        status: 0,
        id: 2,
        priority: "P1"

    }
];

// send all the todos back to the client 
app.get('/API/todo', function (req, res) {
    console.log("Someone req the GET todos");

    // read data from mongoose
    Todo.find({}, function (error, data) {
        if (error) {
            console.log(error);
            res.status(500);
            res.send(error);
        }

        res.json(data);
    });
});

app.get('/API/todo/filter/:userName', function (req, res) {
    // read data from mongoose
    Todo.find({
        user: req.params.userName
    }, function (error, data) {
        if (error) {
            console.log(error);
            res.status(500);
            res.send(error);
        }

        res.json(data);
    });
});

app.get('/API/todo/filter/:userName/:status', function (req, res) {
    // read data from mongoose
    Todo.find({
        user: req.params.userName,
        status
    }, function (error, data) {
        if (error) {
            console.log(error);
            res.status(500);
            res.send(error);
        }

        res.json(data);
    });
});

app.post('/API/todo', function (req, res) {
    console.log("Someone req the POST");

    //create an object & assign an unique ID
    var todo = new Todo(req.body);
    todo.save(function (error, savedItem) {
        if (error) {
            console.log(error);
            res.status(500);
            res.send(error);
        }

        console.log(savedItem);
        savedItem.id = savedItem._id;

        //coms with db when finished
        res.json(savedItem); //answer to client
    });
});

app.put('/API/todo', function (req, res) {
    var todo = req.body;
    if (!todo.id) {
        res.status(412);
        res.send("TODO object should have an ID");
    }

    //find the object on mongo and update it 
    Todo.findByIdAndUpdate(todo.id, todo, function (error, savedItem) {
        if (error) {
            console.log(error);
            res.status(500);
            res.send(error);
        }

        res.status(201);
        res.json(savedItem);

    });
});

app.delete('/API/todo', function (req, res) {
    var todo = req.body;
    if (!todo.id) {
        res.status(412);
        res.send("TODO object should have an ID");
    }

    //remove the todo from mongoose
    Todo.findByIdAndDelete(todo.id, function (error) {
        if (error) {
            console.log(error);
            res.status(500);
            res.send(error);
        }

        res.status(201);
        res.send("Item Removed");

    });
});






/*
get 
post
put
patch
delete

better to specify ports > 3000
8080 is common port for testing
*/

//start the db connection

db.on('error', function (error) {
    console.log("ERROR ON DB CONNECTION", error);
});

db.on('open', function () {
    console.log('DB IS LIVE');

    /* the allowed SchemaTypes are:
        String, Number, Date, Buffer, Boolean, Mixed, ObjectId, Array */

    var todoSchema = mongoose.Schema({
        user: String,
        text: String,
        priority: String,
        status: Number
    });

    Todo = mongoose.model('todoCh3', todoSchema);
});

//starts the server

app.listen(8080, function () {
    console.log("Server running on http://localhost:8080");

});