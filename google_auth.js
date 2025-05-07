require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mysql = require('mysql2');
const app = express();

// MySQL connection using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'google'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Passport configuration
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) return done(err);
        done(null, results[0]);
    });
});

// Google strategy with environment variables
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
    // Check if user already exists in the database
    db.query('SELECT * FROM users WHERE google_id = ?', [profile.id], (err, results) => {
        if (err) return done(err);
        
        if (results.length > 0) {
            // User exists - update profile if needed
            const updateQuery = 'UPDATE users SET name = ?, email = ? WHERE google_id = ?';
            db.query(updateQuery, 
                [profile.displayName, profile.emails[0].value, profile.id],
                (err) => {
                    if (err) return done(err);
                    return done(null, results[0]);
                });
        } else {
            // Create new user
            const newUser = {
                name: profile.displayName,
                email: profile.emails[0].value,
                google_id: profile.id
            };
            db.query('INSERT INTO users SET ?', newUser, (err, result) => {
                if (err) return done(err);
                newUser.id = result.insertId;
                return done(null, newUser);
            });
        }
    });
}));

// Routes
app.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account' // Forces account selection
}));

app.get('/auth/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: '/login-failed',
        successRedirect: '/dashboard'
    })
);

app.get('/dashboard', (req, res) => {
    if (!req.user) {
        return res.redirect('/');
    }
    res.render('dashboard', { 
        user: req.user,
        title: 'Dashboard'
    });
});

app.get('/login-failed', (req, res) => {
    res.render('login-failed', { message: 'Google login failed. Please try again.' });
});

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.redirect('/');
        }
        req.session.destroy();
        res.redirect('/');
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: err });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});