const path = require('path');
const express = require('express');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const exphbs = require('express-handlebars');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({helpers});

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'nothing',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize,
    })
};
app.use(session(sess));


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(routes);


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
    sequelize.sync({ force: false });
});