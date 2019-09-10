
'use strict';

const express = require('express');
const crypto = require('crypto');

const app = express();
app.enable('trust proxy');

const {Datastore} = require('@google-cloud/datastore');

// Instantiate a datastore client
const datastore = new Datastore();


const insertVisit = visit => {
  return datastore.save({
    key: datastore.key('Customername'),
    data: visit,
  });
};


const getVisits = (idd) => {
	idd = idd || ""
  const query = datastore
    .createQuery('Customername')
    .order('customername', {descending: true})
    .limit(10);
	if (idd != ""){
	query.filter('customername', '=', idd)
	}
  return datastore.runQuery(query);
};

app.get('/getCustomers', async (req, res, next) => {
  const visit = {
    timestamp: new Date(),
    userIp: crypto
      .createHash('sha256')
      .update(req.ip)
      .digest('hex')
      .substr(0, 7),
	customername: "Chris"
  };

  try {
	const idd =req.query.idd
    const [entities] = await getVisits(idd);
    const visits = entities.map(
      entity => `Customername: ${entity.customername}`
    );
    res
      .status(200)
      .set('Content-Type', 'text/plain')
      .send(`${visits.join('\n')}`)
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
