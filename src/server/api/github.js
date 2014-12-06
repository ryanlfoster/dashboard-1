var request = require('request');

module.exports = {
    zen: function (req, done) {
        request.get({
            url: config.server.github_api + '/zen',
            headers: {
                'User-Agent': 'review-ninja',
                'Authorization': 'token ' + config.token
            }
        }, function(err, res, body) {
            body = (!err && res.statusCode === 200) ? body : 'Unable to achieve zen bro.';
            done(null, {text: '"' + body + '"'});
        });
    },

    stars: function(req, done) {
        var user = req.args.user;
        var repo = req.args.repo;

        request.get({
            url: config.server.github_api + '/repos/' + user + '/' + repo,
            headers: {
                'User-Agent': 'review-ninja',
                'Authorization': 'token ' + config.token
            }
        }, function(err, res, body) {
            var stars;
            try {
                body = JSON.parse(body);
                stars = body.stargazers_count;
            } catch(ex) {
                stars = 0;
            }

            done(null, {text: 'You have ' + stars + ' stars in GitHub!'});
        });
    },

    issues: function(req, done) {
        var user = req.args.user;
        var repo = req.args.repo;

        request.get({
            url: config.server.github_api + '/repos/' + user + '/' + repo,
            headers: {
                'User-Agent': 'review-ninja',
                'Authorization': 'token ' + config.token
            }
        }, function(err, res, body) {
            var issues;
            try {
                body = JSON.parse(body);
                issues = body.open_issues_count;
            } catch(ex) {
                issues = 0;
            }

            done(null, {text: 'You have ' + issues + ' open issues in GitHub!'});
        });
    },

    status: function(req, done) {
        var user = req.args.user;
        var repo = req.args.repo;
        var branch = req.args.branch;

        request.get({
            url: config.server.github_api + '/repos/' + user + '/' + repo + '/statuses/' + branch,
            headers: {
                'User-Agent': 'review-ninja',
                'Authorization': 'token ' + config.token
            }
        }, function(err, res, body) {
            var status = {};
            try {
                status = JSON.parse(body)[0];
                status.text = status.description;
            } catch(ex) {
                status = {};
                status.text = 'Unable to retrieve status bro.';
            }

            done(null, status);
        });
    }
};
