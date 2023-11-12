let express = require('express');
let usersPublicRouter = require('./public/users-public');
// const rateLimit = require('express-rate-limit');
let usersAdminRouter = require('./admin/users-admin');
let expressFileuploadss = require('express-fileupload');
let authOS = require('./auth.js');
let cors = require('cors');
let bodyParser = require('body-parser');
let mysql = require('mysql');
const tokenRouter = require('./token');
let notificationPublicRouter = require('./public/notification');
let app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
// app.use(bodyParser.json());
let notificationAdminRouter = require('./admin/notification');
let authUser = require('./user/auth');
app.use(expressFileuploadss());
let authAdmin = require('./admin/auth');
const usersUserRouter = require('./user/users-user');
const ticketUserRouter = require('./user/tickets');
const ticketsRouterAdmins = require('./admin/tickets');
const productsRouterAdmin = require('./admin/products');
const productsRouterPublic = require('./public/products');
const blogRouterPublic = require('./public/blog');
const blogRouterAdmin = require('./admin/blog');
const blogRouterUser = require('./user/blog');
const noteRouterAdmin = require('./admin/notes.js');
app.use(cors({
    origin: 'http://localhost',
    credentials: true
}));

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     limit: 300, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
// })
// app.use(limiter);

let database = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

database.connect(err => {
    if (err) {
        console.log('Error');
    } else {
        console.log('Success');
    }
});

// app.use('/api', blogRouterArticle);
app.use('/api', authOS);
app.use('/api', tokenRouter);

// Public
app.use('/api', usersPublicRouter);
app.use('/api', notificationPublicRouter);
app.use('/api', productsRouterPublic);
app.use('/api', blogRouterPublic);

// user
app.use('/api', authUser, usersUserRouter);
app.use('/api', authUser, ticketUserRouter);
app.use('/api', authUser, blogRouterUser);

// admin
app.use('/api', authAdmin, productsRouterAdmin);
app.use('/api', authAdmin, usersAdminRouter);
app.use('/api', authAdmin, notificationAdminRouter);
app.use('/api', authAdmin, ticketsRouterAdmins);
app.use('/api', authAdmin, blogRouterAdmin);
app.use('/api', authAdmin, noteRouterAdmin);


app.listen(3000, () => {
    console.log('server runing port 3000');
});