const express = require('express')
const fileUpload = require('express-fileupload')
const mongodb = require('mongodb')
const fs = require('fs')

const app = express()
app.set('view engine', 'ejs');
const router = express.Router()
router.toString('view engine','ejs');
const mongoose = require('mongoose');
const mongoClient = mongodb.MongoClient
const binary = mongodb.Binary
const { requireAuth } = require('./middleware/authMiddleware');
const { Script } = require('vm');
const https = require('https');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');


app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());







  
const dburi="mongodb+srv://sabariallu:Angumani@1996@cluster0.jdiyf.mongodb.net/class_mate?retryWrites=true&w=majority";
mongoose.connect(dburi,{useNewUrlParser: true});
const conn=mongoose.connection;

conn.once('open', function() {
  console.log('connected to database');
});




router.get("/", (req, res) => {
    res.render('./home');
})
router.get('/', (req, res) => res.render('./home'));
router.get('/smoothies',requireAuth, (req, res) => res.render('./index'));


router.get("/download", (req, res) => {
    getFiles(res)
})

app.use(fileUpload())

router.post("/upload", (req, res) => {
    let file = { name: req.body.name, file: binary(req.files.uploadedFile.data) }
    
    console.log(buffer)
    insertFile(file, res)
   
})

function insertFile(file, res) {
    mongoClient.connect('mongodb+srv://sabariallu:Angumani@1996@cluster0.jdiyf.mongodb.net/class_mate?retryWrites=true&w=majority', { useNewUrlParser: true }, (err, client) => {
        if (err) {
            return err
        }
        else {
            let db = client.db('sabariallu')
            let collection = db.collection('class_mate')
            
            try {
                collection.insertOne(file)
                console.log('File Inserted')
            }
            catch (err) {
                console.log('Error while inserting:', err)
            }
           
            collection.find({}).toArray((err, doc) => {
                if (err) {
                    console.log('err in finding doc:', err)
                }
                else {
                   // let buffer = doc[0].file.buffer
                   if(doc.length>0){
                       console.log("jjjjjjjjjjj");
                   }
                    res.render("./list",{doc});
                }
            })
            client.close()
        }

    })
}

function getFiles(res) {
    mongoClient.connect('mongodb+srv://sabariallu:Angumani@1996@cluster0.jdiyf.mongodb.net/class_mate?retryWrites=true&w=majority', { useNewUrlParser: true }, (err, client) => {
        
        if (err) {
            return err
        }
        else {
            let db = client.db('sabariallu')
            let collection = db.collection('class_mate')
            collection.find({}).toArray((err, doc) => {
                if (err) {
                    console.log('err in finding doc:', err)
                }
                else {
                    let buffer = doc[0].file.buffer
                    fs.writeFileSync('uploadedImage.jpg', buffer)
                }
            })
            client.close()
            res.redirect('/')
        }

    })
}

app.use("/", router)
app.use(authRoutes);

app.listen(3000, () => console.log('Started on 3000 port'))