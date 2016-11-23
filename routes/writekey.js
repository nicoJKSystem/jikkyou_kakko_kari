var express = require('express');
var router = express.Router();

var dataStore = require('../datastore');

router.get('/', function(req, res, next) {
	var uniqKey = req.query.uniqkey;
	var writeKey = dataStore.errorWritekey;
	
	if(uniqKey !== void 0){
		let ins = dataStore.createFromUniqkey(uniqKey);
		ins.newWritekey(dataStore, ins).then(function onFulfilled(value){
		    res.json({ writeKey: value });
		}).catch(function onRejected(error){
		    console.error(error);
		});
	}else
		res.json({ writeKey: writeKey });
});

module.exports = router;
