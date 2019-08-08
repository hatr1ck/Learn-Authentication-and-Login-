let bcrypt = require('bcryptjs'); //putting bcrypt library into variable
let express = require('express'); //putting express library into variable
let app = express(); //executing express framework to create our app

app.use(express.json()); //enabling json body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

let DB = []

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

      DB.push({
        username:username,
        password:hash
      })
      res.send('Sign up successful!');
    });
});

app.post('/login', function (req, res) {
  let username = req.body.username;
  let password = req.body.password;

  let user = DB.find(user => user.username === username)
    if(user){

    bcrypt.compare(password, user.password, (error, same) => {
      if (error) return console.log(error);

      if(same){
      res.send('Log In successful!');
    }
    else{
      res.send('Incorrect password')
    }
    });
    }
    else{
      res.send('No such user')
    }
});

app.listen(8080, function () {
  console.log('Your app is listening on port 8080');
});