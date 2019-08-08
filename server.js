let bcrypt = require('bcryptjs'); 
let express = require('express'); 
let app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

let DB = [] //faking DataBase

app.post('/register', function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  let password2  = req.body.password2;

  if (!username || !password || !password2) {
    return res.send('Please fill in all fields.');
  }

  if (password !== password2) {
    return res.send('Passwords do not match.');
  }

    bcrypt.hash(password, 10, (error, hash) => {
      if (error) return console.log(error);

      DB.push({ //simulating new model creation in our DB
        username:username,
        password:hash
      })

      res.send("You're signed in. <br /> username: " + username + "<br /> password: " + password + "<br /> hashed password: "+hash);
    });
});

app.post('/login', function (req, res) {
  let username = req.body.username;
  let password = req.body.password;

  let user = DB.find(user => user.username === username) //searching for user in our DataBase by username property
    if(user){ //if user is in our db then we want to compare sended password to the password stored in our DB
    bcrypt.compare(password, user.password, (err, same) => { //storing true or false in the "same" variable

      if (err) return console.log(err); //error handling

      if(same){ // if same is true then login password and password that was stored in DB are match
      res.send("You're logged in. <br /> username: " + username + "<br /> password: " + password + "<br /> hashed password: "+user.password);
    }
      else{ // if value of same is false then provided password dosen't match with the one that stored in Db
      res.send('Incorrect password')
    }
    });
    }
    else{ // this part of code gets executed if there is no such user in our DB
      res.send('No such user')
    }
});

app.listen(8080, ()=> {
  console.log('Your app is listening on port 8080');
});