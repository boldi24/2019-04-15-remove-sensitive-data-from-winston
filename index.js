const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/register', (req, res) => {
    const { body } = req;
    logger.info('User registered', body);
    res.status(200).send('Successful registration');
})

app.get('/orders', (req, res) => {
    const { headers } = req;
    const authHeader = req.get('Authorization');
    if (!authHeader) return res.status(401).end();
    const token = authHeader.replace('Bearer ', '');
    logger.info(headers);
    if (token === 'bigsecret') res.send([{id: 1, name: 'Order1'}, {id: 2, name: 'Order2'}]);
    else res.status(401).end();
})

app.use((err, req, res, next) => {
	logger.error(err);
	res.status(500).send('Internal server error');
})

const port = 4000;

app.listen(port, () => {
	logger.info(`Server listening on ${port}...`);
})