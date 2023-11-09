const express = require('express');
const { resolve } = require('path');

// set up the port number
const port = 7004;

// importing the DataBase
const db = require('./config/mongoose');

// importng the Schema For tasks
const  Task  = require('./models/task');

// using express
const app = express();

// using static files
app.use(express.static("./views"));
// to use encrypted data
app.use(express.urlencoded());

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// rendering the App Page
app.get('/', function(req, res){
    const studentContacts=Task.find({}).exec();
    studentContacts.then((data,task)=>{
        console.log(data);
        res.render('home',{ tittle: "Home",task: data});
    }).catch(err=>{
        console.log("error while fetchimg from db");
    });
});
    

// creating Tasks
app.post('/create-task', function(req, res){
  //  console.log("Creating Task");
  const stu_data=new Promise((resolve,reject)=>{
    Task.create({
        description: req.body.description,
         category: req.body.category,
         date: req.body.date
    }).then(newData=>{
        console.log("*new data*",newData);
        resolve(newData);
    }).catch(err=>{
        console.log("Error is",err);
        reject(err);
    });
  });
  stu_data.then(newData=>{
    res.redirect('back');
  }).catch(err=>{
    console.log("Error is",err);
  });
});

// deleting Tasks
app.get('/delete-task', function(req, res){
    // get the id from query
    var id = req.query;

    // checking the number of tasks selected to delete
    var count = Object.keys(id).length;

    var deletePromises = [];

    for(let i=0; i < count ; i++){
        // finding and deleting tasks from the DB one by one using id
        deletePromises.push(Task.findByIdAndDelete(Object.keys(id)[i]));
    }

    Promise.all(deletePromises).then(function(){
        return res.redirect('back'); 
    }).catch(function(err){
        console.log('error in deleting task', err);
        return res.redirect('back');
    });
});

// make the app to listen on asigned port number
app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
    }

    console.log(`Server is running on port : ${port}`);
});

