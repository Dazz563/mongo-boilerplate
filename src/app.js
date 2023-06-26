const path = require('path');

const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');

const planetRoutes = require('./routes/planet.routes');
const launchRoutes = require('./routes/launch.routes');

// Setting cors
app.use(
	cors({
		// origin: ['http://localhost:4200'],
		origin: '*',
	})
);

/**
 * Logging with Morgan & rotating file stream
 */
const accessLogStream = rfs.createStream('access.log', {
	path: path.join(__dirname, 'logs'),
	interval: '7d', // rotate weekly
	compress: 'gzip', // compress rotated files
	size: '10M', // rotate every 10 MegaBytes written
});
morgan.token('host', function (req, res) {
	// morgan token
	return req.hostname;
});
app.use(morgan('combined', {stream: accessLogStream}));

/**
 * Parsing JSON & formUrlEncoded
 */
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.use('/api/planet', planetRoutes);
app.use('/api/launch', launchRoutes);

module.exports = app;

/**
 * Static files / templating engine
 */
// app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, '..', 'views'));
// app.use('/site', express.static(path.join(__dirname, '..', 'public')));
// app.get('/', (req, res) => {
//     res.render('index', {
//         title: 'Home',
//         caption: 'Welcome to our site',
//     });
// });
// app.get('/messages', (req, res) => {
//     res.render('messages', {
//         title: 'Messages to my friends',
//         friend: 'Elon Musk',
//     });
// });
