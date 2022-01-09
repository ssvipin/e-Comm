const express = require('express');
const {MongoClient} = require('mongodb')
const bodyParser = require('body-parser')


const app = express();


app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(express.json());
app.set('view engine', 'ejs');
app.set("views","./public")


const url = "mongodb+srv://vipin:vipin@cluster0.bzaez.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

var array = [];
// With middleware
app.get('/', function(req, res,next){
    res.render('pages/index');
    next();
    
});

app.get("/products",(req,res,next) => {
    MongoClient.connect(url,(err,db) => {
        if(err) throw err;
        var dbo = db.db('dynamo_db');
        dbo.collection('products').find({}).toArray((err,result) => {
            if(err) throw err;
            array.push(result);
        });
    })
    // we use when method is post but in get data is goes in url
    // console.log(req.body.name);
    string = req.query.name;
    var result = array[0];
    var data = [];
    if(!string)
    {
        result.forEach((item) => {
            data.push(item);
        })
    }
    else
    {
        result.forEach((item) => {
            if(item.title.includes(string))
            {
                data.push(item);
            }
        })
    }

    res.render('pages/products',{data});
    next();

})

app.get('/cart',(req,res,next) => {
    res.render('pages/cart');
})

app.listen(8080,(err) => {
    if(err) throw err;
    console.log("server is running on port 8080");
});