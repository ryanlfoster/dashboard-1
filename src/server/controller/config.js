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

    request(config.server.github + '/' + user + '/' + repo + '/raw/master/.dashboard.yml', function(error, response, body) {
        var code = response.statusCode;

        if(!error && code === 200) {
            var config = null;

            try {
                config = yaml.safeLoad(body);
            } catch(err) {
                code = 500;
                config = {message: 'unable to parse .dashboard.yml bro'};
            }

            return res.status(code).send(JSON.stringify(config));
        }

        res.status(code).send(JSON.stringify({
            message: '.dashboard.yml not found bro'
        }));
    });
});

module.exports = router;
