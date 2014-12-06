var yaml = require('js-yaml');
var request = require('request');

module.exports = {
    config: function(req, done) {
        done(null, {
            url: config.server.url,
            github: config.server.github,
            webhook: config.server.url + '/webhook'
        });
    },

    settings: function(req, done) {
        var user = req.args.user;
        var repo = req.args.repo;

        request.get(config.server.github + '/' + user + '/' + repo + '/raw/master/.dashboard.yml', function(err, res, body) {
            var settings;
            try {
                settings = yaml.safeLoad(body);
            } catch(ex) {
                err = 'Unable to parse .dashboard.yml bro.';
            }

            done(err, settings);
        });
    },

    statistic: function(req, done) {
        request.get(req.args.url, function(err, res, body) {
            var text;
            try {
                text = JSON.parse(body).text;
            } catch(ex) {
                text = 'Unable to retrieve this bro.';
            }

            done(null, {text: text});
        });
    }
};
