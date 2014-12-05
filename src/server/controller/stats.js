var express = require('express');
var request = require('request');

//////////////////////////////////////////////////////////////////////////////////////////////
// Config router
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();

router.use(require('body-parser').json());
router.use(require('../middleware/param'));

router.all('/zen', function(req, res) {
    res.set('Content-Type', 'application/json');
    request.get({
        url: 'https://api.github.com/zen',
        headers: {
            'User-Agent': 'review-ninja',
            'Authorization': 'token ' + config.token
        }
    }, function(error, response, body) {
        body = (!error && response.statusCode === 200) ? body : 'Unable to achieve zen bro.';
        res.send(JSON.stringify({
            text: '"' + body + '"'
        }));
    });
});

router.all('/stars', function(req, res) {
    res.set('Content-Type', 'application/json');
    request.get({
        url: 'https://api.github.com/repos/reviewninja/dashboard',
        headers: {
            'User-Agent': 'review-ninja',
            'Authorization': 'token ' + config.token
        }
    }, function(error, response, body) {
        var stars;

        try {
            body = JSON.parse(body);
            stars = body.stargazers_count;
        } catch(err) {
            stars = 0;
        }

        res.send(JSON.stringify({
            text: 'You have ' + stars + ' stars in GitHub!'
        }));
    });
});

router.all('/issues', function(req, res) {
    res.set('Content-Type', 'application/json');
    request.get({
        url: 'https://api.github.com/repos/reviewninja/dashboard',
        headers: {
            'User-Agent': 'review-ninja',
            'Authorization': 'token ' + config.token
        }
    }, function(error, response, body) {
        var issues;

        try {
            body = JSON.parse(body);
            issues = body.open_issues_count;
        } catch(err) {
            issues = 0;
        }

        res.send(JSON.stringify({
            text: 'You have ' + issues + ' open issues in GitHub!'
        }));
    });
});

module.exports = router;
