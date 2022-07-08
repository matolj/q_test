require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const databaseConfig = require('./backend/helpers/database_config')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// api routes
app.use('/users', require('./backend/routes/users'));
app.use('/authors', require('./backend/routes/authors'));

// start server
app.listen(process.env.NODE_ENV === 'production' ? 80 : 4000, function () {
    console.log('Server listening! ');
});

databaseConfig.connectDatabase()


