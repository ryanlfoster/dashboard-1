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

app.use(require('x-frame-options')());
app.use(require('body-parser').json());

// custom middleware
app.use('/webhook', require('./middleware/param'));

async.series([

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

app.all('/webhook', function(req, res) {

    try {
        var event = req.headers['x-github-event'];
        var room = (req.args.repository.owner.login || req.args.repository.owner.name) + ':' + req.args.repository.name + ':' + event;
        io.emit(room, req.args);
    } catch(err) {}

    res.end();
});

module.exports = app;
