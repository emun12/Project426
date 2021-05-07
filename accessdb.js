const sqlite3 = require('sqlite3').verbose();

function connect(){
    let db = new sqlite3.Database('./p10.db', (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Connected to the p10 database.');
      });
    return db
}

function close(db){
    db.close((err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Close the database connection.');
      });
}

function createLeaderBoardTable(){
    db = connect();
    db.run('CREATE TABLE IF NOT EXISTS leaderboard(Score INTEGER, Name TEXT )');
    close(db);
}
function createAccountsTable(){
  db = connect();
  db.run('CREATE TABLE IF NOT EXISTS accounts(Id INTEGER, Username TEXT, Password TEXT)');
  close(db);
}

async function selectAccounts(user,pass){
  
  db = connect();
  sql = 'SELECT * FROM accounts where Username = ? and Password = ?';

  return new Promise((resolve,reject)=>{
    let out = [];
      db.all(sql, [user,pass], function a(err, rows)  {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        out.push(row.Name);
      });
      resolve(out);
      close(db);
    });
  });
}

async function selectPlayers(){
  
  db = connect();
  sql = 'SELECT Name, Score FROM leaderboard order by Score desc';

  return new Promise((resolve,reject)=>{
    let out = [];
      db.all(sql, [], function a(err, rows)  {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        const leader = {
          score:row.Score,
          name:row.Name
        };  
        out.push(leader);
      });
      resolve(out);
      close(db);
    });
  });
}


function insertPlayer(score,name){
    db = connect();
    db.run('INSERT INTO leaderboard (Score,Name) VALUES (?,?)',[0,name],(err,row)=>{
        if(err){
          throw err;
        }
        else{
          console.log('Insert Success'+row);
        }
      });
    close(db);
}

function insertAccount(id,name,pass){
    db = connect();
    db.run('INSERT INTO accounts (Id,Username,Password) VALUES (?,?,?)',[id,name,pass],(err,row)=>{
        if(err){
          throw err;
        }
        else{
          console.log('Insert Success'+row);
        }
      });
    close(db);
}

async function getScore(name){
  
  db = connect();
  sql = 'SELECT Score FROM leaderboard where Name = ?';

  return new Promise((resolve,reject)=>{
      db.all(sql, [name], function a(err, rows)  {
      out = [];
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        out.push(row.Score);
      });
      console.log(out);
      resolve(out);
      close(db);
    });
  });
}
function updatePlayer(score,name){
  db = connect();
  db.run('UPDATE leaderboard SET Score=? where Name=?',[score,name],(err,row)=>{
      if(err){
        throw err;
      }
      else{
        console.log('Update Success'+row);
      }
    });
  close(db);
}


module.exports = {
    connect,
    close,
    createLeaderBoardTable,
    insertPlayer,
    selectPlayers,
    createAccountsTable,
    selectAccounts,
    insertAccount,
    updatePlayer,
    getScore

}