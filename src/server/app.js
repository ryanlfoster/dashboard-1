var async = require('async');
var colors = require('colors');
var express = require('express');
var glob = require('glob');
var merge = require('merge');
var passport = require('passport');
var path = require('path');
var sass = require('node-sass');

//////////////////////////////////////////////////////////////////////////////////////////////////
// Load configuration
//////////////////////////////////////////////////////////////////////////////////////////////////

global.config = require('./../config');

//////////////////////////////////////////////////////////////////////////////////////////////////
// Express application
//////////////////////////////////////////////////////////////////////////////////////////////////

var app = express();
var api = {};
var webhooks = {};

app.use(require('x-frame-options')());
app.use(require('body-parser').json());
app.use(require('cookie-parser')());
app.use(require('cookie-session')({
    secret: config.server.security.sessionSecret,
    cookie: {
        maxAge: config.server.security.cookieMaxAge
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// custom middleware
app.use('/github/webhook', require('./middleware/param'));

async.series([

    function(callback) {
        console.log('checking configs'.bold);

        if(config.server.http.protocol !== 'http' && config.server.http.protocol !== 'https') {
            throw new Error('PROTOCOL must be "http" or "https"');
        }

        if(config.server.github.protocol !== 'http' && config.server.github.protocol !== 'https') {
            throw new Error('GITHUB_PROTOCOL must be "http" or "https"');
        }

        console.log('✓ '.bold.green + 'configs seem ok');

        callback();
    },

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Bootstrap static
    //////////////////////////////////////////////////////////////////////////////////////////////

    function(callback) {

        console.log('bootstrap static files'.bold);

        var publish = function(p, path) {
            app.use(sass.middleware({
                src: p,
                dest: p,
                outputStyle: 'compressed',
                force: config.server.always_recompile_sass
            }));
            app.use(path, express.static(p));
        };

        config.server.static.app.forEach(function(p) {
            publish(p, '/');
        });
        config.server.static.lib.forEach(function(p) {
            publish(p, '/lib');
        });
        callback();
    },

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Bootstrap controller
    //////////////////////////////////////////////////////////////////////////////////////////////

    function(callback) {

        console.log('bootstrap controller'.bold);

        async.eachSeries(config.server.controller, function(p, callback) {
            glob(p, function(err, file) {
                if (file && file.length) {
                    file.forEach(function(f) {
                        try {
                            app.use('/', require(f));
                            console.log('✓ '.bold.green + path.relative(process.cwd(), f));
                        } catch (ex) {
                            console.log('✖ '.bold.red + path.relative(process.cwd(), f));
                            console.log(ex.stack);
                        }
                    });
                }
                callback();
            });
        }, callback);
    }

], function(err, res) {
    console.log('\n✓ '.bold.green + 'bootstrapped, '.bold + 'app listening on localhost:' + config.server.localport);
});

//////////////////////////////////////////////////////////////////////////////////////////////////
// Handle webhook calls
//////////////////////////////////////////////////////////////////////////////////////////////////

app.all('/github/webhook', function(req, res) {
    var event = req.headers['x-github-event'];
    var room = req.args.repository.owner.login + ':' + req.args.repository.name + ':' + event;
    io.emit(room, req.args);

    res.end();
});

module.exports = app;
