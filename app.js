'use strict';
const express = require('express');
const crypto = require('crypto');
const app = express();
app.enable('trust proxy');
const {
    Datastore
} = require('@google-cloud/datastore');
const datastore = new Datastore();
const getCustomers = (id) => {
    id = id || ""
    const query = datastore.createQuery('Customername');
    const selectq = query.order('Id', {
        descending: true
    }).limit(10);
    if (id != "") {
        query.filter('Id', '=', id)
    }
    return datastore.runQuery(query);
};

app.get('/getCustomers', async (req, res, next) => {
    try {
        const [customer_data] = await getCustomers("");
        res.json(customer_data)
    } catch (error) {
        next(error);
    }
});

app.get('/getCustomer', async (req, res, next) => {
    try {
        const id = req.query.id
        const [customer_data] = await getCustomers(id);
        res.json(customer_data[0])
    } catch (error) {
        next(error);
    }
});

const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

module.exports = app;
