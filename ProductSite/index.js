const express = require("express");

const path = require("path");
const uuid = require("uuid");
const cookieParser = require("cookie-parser");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

const app = express();

let users = [];
const getUser = (id) => users.find((user) => user.id == id);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", function (req, res) {
  let userid = req.cookies.userid;

  if (userid == undefined) {
    res.redirect("/register");
  } else {
    const user = getUser(userid);
    if (user == undefined) res.redirect("/register");
    else
      res.render("index", {
        user,
        products: [{
          name: "Laptop",
          price: 100,
          image: '/images/laptop.jpeg',
          description: "A laptop, laptop computer, or notebook computer is a small, portable personal computer (PC) with a screen and alphanumeric keyboard. "
        },
        {
          name: "Android",
          price: 50,
          image: '/images/phone.png',
          description: "Laptops combine all the input/output components and capabilities of a desktop computer, including the display screen, small speakers, a keyboard, "
        },
        {
          name: "USB",
          price: 10,
          image: '/images/usb.jpg',
          description: "A laptop, laptop computer, or notebook computer is a small, portable personal computer (PC) with a screen and alphanumeric keyboard. These typica..."
        }]
      });
  }
});

app.get("/register", function (req, res) {
  return res.render("register");
});

app.post("/register", function (req, res) {
  let id = uuid.v4();

  let newUser = {
    id: id,
    name: req.body.name,
    phone: req.body.phone,
  };

  users.push(newUser);

  // set Cookie and redirect to home page
  res.cookie("userid", id, { maxAge: 900000, httpOnly: false });
  res.cookie("name", newUser.name, { maxAge: 900000, httpOnly: false });
  res.cookie("phone", newUser.phone, { maxAge: 900000, httpOnly: false });

  return res.redirect("/");
});

app.listen(5000, () => console.log("Listening to product site on port 5000"));
