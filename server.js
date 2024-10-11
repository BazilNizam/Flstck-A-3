//Basil Moyikkal - C0908488

const express = require("express"); // import express framework
const fs = require("fs"); // import file system module
const path = require("path"); // import path module
const app = express(); // create express application
const PORT = process.env.PORT || 3000; // set port to environment variable or default to 3000

// middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));

// serve static files from the public folder
app.use(express.static("public"));

// route: serve login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html")); // send login.html file to client
});

// route: handle login form submission
app.post("/login", (req, res) => {
  const { username, password } = req.body; // destructure username and password from request body

  // validate that fields are not empty
  if (!username || !password) {
    return res.redirect("/?error=fields"); // redirect with error if fields are empty
  }

  // read db.json file
  fs.readFile("./db.json", "utf8", (err, data) => {
    if (err) throw err; // throw error if file read fails

    const users = JSON.parse(data).users; // parse users from json data
    const user = users.find(
      (u) => u.username === username && u.password === password
    ); // find user by username and password

    if (user) {
      // redirect to welcome page if login is successful
      res.redirect(`/welcome?user=${encodeURIComponent(username)}`); // encode username for url
    } else {
      // redirect back to login page with error message
      res.redirect("/?error=invalid"); // invalid login credentials
    }
  });
});

// route: serve registration page
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public/register.html")); // send register.html file to client
});

// route: handle registration form submission
app.post("/register", (req, res) => {
  const { username, password } = req.body; // destructure username and password from request body

  // validate that fields are not empty
  if (!username || !password) {
    return res.redirect("/register?error=fields"); // redirect with error if fields are empty
  }

  // read db.json file
  fs.readFile("./db.json", "utf8", (err, data) => {
    if (err) throw err; // throw error if file read fails

    let users = JSON.parse(data).users; // parse users from json data

    // check if username already exists
    const userExists = users.find((u) => u.username === username); // find existing user by username
    if (userExists) {
      return res.redirect("/register?error=exists"); // redirect with error if username exists
    }

    // if user doesn't exist, register the new user
    users.push({ username, password }); // add new user to users array

    fs.writeFile("./db.json", JSON.stringify({ users }), (err) => {
      // write updated users to db.json
      if (err) throw err; // throw error if write fails
      // redirect to registration page with success message
      res.redirect("/register?success=true"); // indicate successful registration
    });
  });
});

// route: serve welcome page
app.get("/welcome", (req, res) => {
  res.sendFile(path.join(__dirname, "public/welcome.html")); // send welcome.html file to client
});

// start the server
app.listen(PORT, () => {
  console.log(`server running on port🚀🚀🚀 https://localhost/${PORT}`); // log the server url
});
