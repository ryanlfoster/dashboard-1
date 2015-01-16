var async = require('async');
var colors = require('colors');
var express = require('express');
var glob = require('glob');
var merge = require('merge');
var path = require('path');
var sass = require('node-sass-middleware');

//////////////////////////////////////////////////////////////////////////////////////////////////
// Load configuration
//////////////////////////////////////////////////////////////////////////////////////////////////

global.config = require('./../config');

//////////////////////////////////////////////////////////////////////////////////////////////////
// Express application
//////////////////////////////////////////////////////////////////////////////////////////////////

var api = {};
var app = express();

app.use(require('x-frame-options')());
app.use(require('body-parser').json());

// custom middleware
app.use('/api', require('./middleware/param'));
app.use('/webhook', require('./middleware/param'));

async.series([

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Bootstrap certificates
    //////////////////////////////////////////////////////////////////////////////////////////////

    function(callback) {

        console.log('bootstrap certificates'.bold);

        var https = require('https'),
            fs = require('fs');

        if(config.server.https.certs) {
            glob(config.server.https.certs, function(err, file) {
                if (file && file.length) {
                    file.forEach(function(f) {
                        try {
                            https.globalAgent.options.ca = https.globalAgent.options.ca || [];
                            https.globalAgent.options.ca.push(fs.readFileSync(path.relative(process.cwd(), f)));
                            console.log('✓ '.bold.green + path.relative(process.cwd(), f));
                        } catch (ex) {
                            console.log('✖ '.bold.red + path.relative(process.cwd(), f));
                            console.log(ex.stack);
                        }
                    });
                }
                callback();
            });
        } else {
            callback();
        }

    },

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Bootstrap static
    //////////////////////////////////////////////////////////////////////////////////////////////

    function(callback) {

        console.log('bootstrap static files'.bold);

        var publish = function(p, path) {
            app.use(sass({
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
    },

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Bootstrap api
    //////////////////////////////////////////////////////////////////////////////////////////////

    function(callback) {

        console.log('bootstrap api'.bold);

        async.eachSeries(config.server.api, function(p, callback) {
            glob(p, function(err, file) {
                if (file && file.length) {
                    file.forEach(function(f) {
                        console.log('✓ '.bold.green + path.relative(process.cwd(), f));
                        api[path.basename(f, '.js')] = require(f);
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
// Handle api calls
//////////////////////////////////////////////////////////////////////////////////////////////////

app.all('/api/:obj/:fun', function(req, res) {
    res.set('Content-Type', 'application/json');
    api[req.params.obj][req.params.fun](req, function(err, obj) {
        if(err) {
            return res.status(500).send(err);
        }
        res.send(JSON.stringify(obj));
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////////
// Handle webhook calls
//////////////////////////////////////////////////////////////////////////////////////////////////

app.all('/webhook', function(req, res) {
    try {
        var event = req.headers['x-github-event'];
        var room = (req.args.repository.owner.login || req.args.repository.owner.name) + ':' + req.args.repository.name + ':' + event;
        io.emit(room, req.args);
    } catch(ex) {}

    res.end();
});

module.exports = app;
