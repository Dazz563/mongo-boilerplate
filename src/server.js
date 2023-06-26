const http = require('http');

require('dotenv').config();

const app = require('./app');
const {mongoConnect} = require('./database/mongo');

// const {loadPlanetsData} = require('./models/planets.model');
// const {loadLaunchesData} = require('./models/launches.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

// awaits the planets data that is stream from a csv file before starting the server
(async () => {
	try {
		await mongoConnect();
		//start server
		server.listen(PORT, () => {
			console.log(`Listening on port: ${PORT}...`);
		});
	} catch (error) {
		console.log('error parsing csv', error);
	}
})();
