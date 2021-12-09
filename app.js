const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');

const authRoutes = require('./routes/authRoutes');
const campgroundRoutes = require('./routes/campgroundRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
    
// Connecting mongoose database
mongoose.connect('mongodb://localhost:27017/tent');

// Displaying mongoose success or error messages on the console
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

// Setting up the view engine to be ejs
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//All "app.use" content runs for every single request and response cycle.

// Used for parsing request bodies
app.use(express.urlencoded({extended: true}));
// Used for overriding methods and therefore generating several other method requests
app.use(methodOverride('_method'));
/**
 * We can't use external files in our project without having
 * instructed express to server the files. The following line
 * instructs express to serve all files within the public
 * directory.
 */
app.use(express.static(path.join(__dirname, 'public')));

// Configuring the session while using an expiry date and other default configs.
const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        express: Date.now() + (7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}
app.use(session(sessionConfig));

// Used for generating flash messages across the application
app.use(flash());

// Initializes passport to allow authentication procedures by passport.
app.use(passport.initialize());
/**
 * Allows passport to maintain persistent login sessions
 * so that the user does not have to log in every time. Must
 * be arranged such that this session runs below the acutal
 * session: "app.use(session(sessionConfig));".
 */
app.use(passport.session());
// Define the strategy to be used from the passport add-ons on the User model.
passport.use(new localStrategy(User.authenticate()));
// Define the session storage structure/format for authentication using the passport add-ons on the user model.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.get('/fakeUser', async (req, res) => {
//     // Creating a new user without any password
//     const user = new User({email: 'colt@gmail.com', username: 'colt'});
//     // Using the passport method to set the password for the new user.
//     const newUser = await User.register(user, 'chicken');
//     res.send(newUser);
// })

app.use('/', authRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

// Rendering default page
app.get('/', (req, res) => {
    res.render('home')
})

// 404 request handling when every other URL up top has not matched the request
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

// Error Handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "Something went wrong";
    res.status(statusCode).render('error', { err });
})

// Listeningi to the server using port 3000
app.listen(3000, () => {
    console.log('Serving on port 3000')
})