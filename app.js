
'use strict';

const express = require('express');
const crypto = require('crypto');

const app = express();
app.enable('trust proxy');

const {Datastore} = require('@google-cloud/datastore');

// Instantiate a datastore client
const datastore = new Datastore();


const insertCust = visit => {
  return datastore.save({
    key: datastore.key('Customername'),
    data: visit,
  });
};


const getVisits = (id) => {
	id = id || ""
	const query = datastore.createQuery('Customername');
	const selectq = query.order('Id', {descending: true}).limit(10);
	if (id != ""){
		query.filter('Id', '=', id)
		}
  return datastore.runQuery(query);
};

app.get('/getCustomers', async (req, res, next) => {
  
  try {
    //await insertCust(cust);
	const id =req.query.id
    const [customer_data] = await getVisits(id);
    //const customers = customer_data.map(entity => customer_data[entity.customername] = customer_data[entity.Id]);
    res
      .status(200)
      .set('Content-Type', 'application/json')
      .json({customer_data})
      .end();
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
