var express = require('express');
var request = require('request');
var yaml = require('js-yaml');

//////////////////////////////////////////////////////////////////////////////////////////////
// Config router
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();

router.use(require('body-parser').json());
router.use(require('../middleware/param'));

router.all('/config', function(req, res) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({
        url: config.server.url,
        github: config.server.github,
        webhook: config.server.url + '/webhook'
    }));
});

router.all('/settings', function(req, res) {
    res.set('Content-Type', 'application/json');

    var user = req.args.user;
    var repo = req.args.repo;

    request.get(config.server.github + '/' + user + '/' + repo + '/raw/master/.dashboard.yml', function(error, response, body) {
        var code = response ? response.statusCode : 500;
        if(!error && code === 200) {
            var settings = null;

            try {
                settings = yaml.safeLoad(body);
            } catch(err) {
                code = 500;
                settings = {message: 'unable to parse .dashboard.yml bro'};
            }

            return res.status(code).send(JSON.stringify(settings));
        }

        res.status(code).send(JSON.stringify({
            message: '.dashboard.yml not found bro'
        }));
    });
});

router.all('/status', function(req, res) {
    res.set('Content-Type', 'application/json');

    var user = req.args.user;
    var repo = req.args.repo;
    var ref = req.args.ref;

    request.get({
        url: 'https://api.github.com/repos/' + user + '/' + repo + '/statuses/' + ref,
        headers: {
            'User-Agent': 'review-ninja',
            'Authorization': 'token ' + config.token
        }
    }, function(error, response, body) {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(body);
    });
});

router.all('/stat', function(req, res) {
    res.set('Content-Type', 'application/json');

    request.get(req.args.url, function(error, response, body) {
        var code = response ? response.statusCode : 500;
        if(error || code !== 200) {
            code = 200;
            body = JSON.stringify({
                text: 'unable to retrieve this bro'
            });
        }
        return res.status(code).send(body);
    });
});

module.exports = router;
