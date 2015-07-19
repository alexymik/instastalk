var express = require('express');
var router = express.Router();
var geoip = require('geoip-lite');
var https = require('https');

/* GET home page. */
router.get('/', function(req, res, next) {
    // switch when behind proxy server
    //var ip = req.headers['x-forwarded-for'];
    var ip = req.connection.remoteAddress;
    var geo;

    if (ip.substring(0, 7) == '::ffff:') {
	geo = geoip.lookup(ip.substring(7));
    } else {
	geo = geoip.lookup(ip);
    }

    iplat = geo['ll'][0];
    iplng = geo['ll'][1];

    res.render('index', {
	'iplat': iplat,
	'iplng': iplng
    });
});

/* POST */
router.post('/', function(req, res, next) {
    var data = req.body;
    var key = process.env.INSTAGRAM_KEY;

    var options = {
	'host': "api.instagram.com",
	'port': 443,
	'method': "GET",
	'path': '/v1/media/search?lat=' + data["lat"]
	    + '&lng=' + data["lng"]
	    + '&distance=' + data["radius"]
	    + '&client_id=' + key
    };

    apiCall = function(r) {
	// container for instagram data
	var body = '';

	// put returned data into holder object
	r.on('data', function(d) {
	    body += d;
	});

	r.on('end', function() {
	    body = JSON.parse(body);

	    // if instagram call returns an error
	    if (body['meta'].code == '400') {
		res.json({'error': body['meta'].error_message});
		return;
	    }

	    // if there are no posts in the query
	    if (body['meta'].code == '200' && body['data'] == '') {
		res.json({'error': 'Sorry, no results.'});
		return;
	    }

	    res.json(body);
	});
    };

    https.request(options, apiCall).end();
});

module.exports = router;
