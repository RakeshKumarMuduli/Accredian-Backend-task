const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const db = mysql.createPool({
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT, // Adjust as needed
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    authPlugins: {
      mysql_native_password: process.env.MYSQL_AUTH_PLUGIN || 'mysql_native_password'
    }
  });

 
  
const app = express();
const port = process.env.PORT || 3500;

app.use(bodyParser.json()); // For act as a middleware
app.use(cors()); 

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('*', (req, res) => {
    res.status(404).send('404: NOT_FOUND FILE');
  });


app.post('/refferAccount', (req, res) => {
    const { referrerName, referrerEmail, refereeName, refereeEmail } = req.body;
    db.query(
      "INSERT INTO reffer (ReferrerName, ReferrerEmail, RefereeName, RefereeEmail) VALUES (?,?,?,?)",
      [referrerName, referrerEmail, refereeName, refereeEmail],
      (error, results) => {
        if (error) {
          console.error('Error inserting data:', error);
          return res.status(500).send('Error inserting data');
        }
        res.send('Successfully inserted');
      }
    );
  });
  
  app.get('/Alluser',async(req,res)=>{
      const data=await db.query("select * from reffer",(error, results) => {
          if (error) {
            console.error('Error querying database:', error);
            return;
          }
          console.log('All data from users:');
          res.send(results);
          results.forEach(row => {
            console.log(row); // Log each row object
           
          });
        });
    
  })
  
  
app.delete('/referAccount/:id', (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM reffer WHERE id = ?", [id], (error, results) => {
      if (error) {
        console.error('Error deleting data:', error);
        return res.status(500).send('Error deleting data');
      }
      if (results.affectedRows === 0) {
        return res.status(404).send("Record not found");
      }
      res.send("Successfully deleted");
    });
  });
  
  app.put('/referAccount/:id', (req, res) => {
    const { id } = req.params;
    const { referrerName, referrerEmail, refereeName, refereeEmail } = req.body;
    db.query(
      "UPDATE reffer SET ReferrerName = ?, ReferrerEmail = ?, RefereeName = ?, RefereeEmail = ? WHERE id = ?",
      [referrerName, referrerEmail, refereeName, refereeEmail, id],
      (error, results) => {
        if (error) {
          console.error('Error updating data:', error);
          return res.status(500).send('Error updating data');
        }
        if (results.affectedRows === 0) {
          return res.status(404).send("Record not found");
        }
        res.send("Successfully updated");
      }
    );
  });
  
  