//using import instead of request because it's the modern way 
import express from 'express';
import fs from 'fs';
import path from 'path';
import {open} from 'sqlite'; 
import sqlite3 from 'sqlite3';
import cookieParser from 'cookie-parser'; 
import { fileURLToPath } from 'url';
import { URL } from 'url'; 
import { dirname } from 'path';
import multer from 'multer'; 
import bodyParser from 'body-parser'; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cookieParser()); 

//default Path for the server
app.use(express.static(path.join(__dirname, 'GIS_Projekt')));
const dbFilePath = "Datenbanken.db";
let customerNumber = 0; 

app.use(bodyParser.urlencoded({ extended: true }));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'img/Produktfotos'); // Pfad zum Speichern der Bilder
    },
    filename: function (req, file, cb) { 
        cb(null,file.originalname);
    }
  });
const upload = multer({ storage: storage });

async function getDataSpices() {
    const db = await open({
        filename: dbFilePath,
        driver: sqlite3.Database,
    });

    const jsonDataAmount = JSON.stringify(await db.all('SELECT COUNT(*) AS amount FROM spices')); //how many spices are there
    const jsonDataSpices = JSON.stringify(await db.all('SELECT * FROM spices')); //all info of every spice
    customerNumber = await db.get('SELECT MAX(customer_number) AS maxCustomerNumber FROM customers');
    customerNumber =customerNumber.maxCustomerNumber; 
    const jsonDataFinal = '{ "arrayAmount":'+jsonDataAmount+',"arraySpices":'+jsonDataSpices+'}';
    fs.writeFile("spices.json", jsonDataFinal, (err) => {
        if (err) {
            console.error('Fehler beim Schreiben der Datei:', err);
            return;
        }
        console.log('Daten erfolgreich in die JSON-Datei geschrieben.');
    });
    await db.close();
}
getDataSpices();


// all the different .???? I need
const extToContentType = {
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.mov': 'video/quicktime',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.db': 'application/octet-stream',
    '.html': 'text/html',
};



//management login&reg
app.use(express.urlencoded({extended:true}));
app.post('*',upload.single('picture'), async (req, res) => {
    const rb=req.body; 
    switch (req.body.formType) {
        case "formLogin":
            await checkUser(rb.mail, rb.password, res);
            break;
        case "formReg":
            await newUser(rb.anrede, rb.first_name, rb.last_name, customerNumber, rb.street, rb.house_number, rb.plz, rb.city, rb.email, rb.password);
            break;
        case "hostedit":
            await editSpice(rb.name,rb.origin,rb.price_per_100g,rb.rating,rb.num_ratings,rb.available,rb.oldname); 
            break;
        case "hostdel":
            await deleteSpice(rb.name); 
            break;
        case "hostadd":  
            await addSpice(rb.name,rb.origin,rb.price_per_100g,rb.rating,rb.num_ratings,rb.available)
            break;
    }

    //get the URL out of the header and use the last part to get to the same page as we come from
    const referer = req.header('referer');
    const refererURL = new URL(referer);
    const refererPath = refererURL.pathname; 
    if (referer) {
        res.sendFile(path.resolve(__dirname+refererPath)); 
    } else {
        res.sendFile(path.resolve("/")); 
    }
});

async function newUser(salutation, firstName, lastName, customerNumber, street, houseNumber, postalCode, city, email, password) {
    const db = await open({
        filename: dbFilePath,
        driver: sqlite3.Database,
    });
    await db.all("INSERT INTO customers (salutation, first_name, last_name, customer_number, street, house_number, postal_code, city, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",[salutation, firstName, lastName, customerNumber + 1, street, houseNumber, postalCode, city, email, password]);
    await db.close();
}
async function checkUser(email, password,res){
    const db = await open({
        filename: dbFilePath,
        driver: sqlite3.Database,
    });

    //write database inforamtion that I go from the email and password
    const person = await db.all('SELECT salutation, first_name, last_name, customer_number, street, house_number, postal_code, city, email FROM customers WHERE email = ? AND password = ?', [email, password]); 
    if(person.length>0)
        res.cookie("user", person);
    await db.close();    
}
async function deleteSpice(name){
    const db = await open({
        filename: dbFilePath,
        driver: sqlite3.Database,
    });

    //delete spice from database
    await db.run('DELETE FROM spices WHERE name = ?',[name]); 
    await db.close();    
    await getDataSpices();
}
async function editSpice(name,origin,price100g,rating,num_ratings,availability,oldname){
    const db = await open({
        filename: dbFilePath,
        driver: sqlite3.Database,
    });

    let tabelName =["name","origin","price_per_100g","rating","num_ratings","available"]; 
    let dataForm = [name,origin,price100g,rating,num_ratings,availability]; 
 
    for(let i=0; i<(dataForm.length); i++){
        if(dataForm[i]!=null && dataForm[i]!=undefined && dataForm[i]!=""){
            await db.all('UPDATE spices SET '+tabelName[i]+'= ? WHERE name= ? ',[dataForm[i],oldname ]); 
        }           
    }
    //delete spice from database
    await db.close();    
    getDataSpices();
}
async function addSpice(name,origin,price100g,rating,num_ratings,availability){
    const db = await open({
        filename: dbFilePath,
        driver: sqlite3.Database,
    });

    //delete spice from database
    await db.all('INSERT INTO spices (name,origin,price_per_100g,rating,num_ratings,available) VALUES (?,?,?,?,?,?)',[name,origin,price100g,rating,num_ratings,availability]); 
    await db.close();    
    await getDataSpices();
}

//server structure onload/navigation
app.use((req, res) => {
    //if I just type localhost:3000 I dont enter server error, I will open the index.html, if I want special page I can do this 
    let filePath = '.'+req.url; 
    if(filePath==="./")
        filePath="./index.html"; 
    else
        filePath = './'+req.url; 

    //witch .??? do I have/use 
    const extname = path.extname(filePath);
    const contentType = extToContentType[extname] || 'text/html';


    //AI-generated
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // page not found
                fs.readFile(path.join(__dirname, 'GIS_Projekt', '404.html'), (err, content) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                });
            } else {
                // server error
                res.writeHead(500);
                res.end('Sorry, ein interner Serverfehler ist aufgetreten.');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

//start the Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
