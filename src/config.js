/**
 * Configuration Module
 *
 * @title config
 * @overview Configuration Module
 */
module.exports = {

    terms: process.env.TERMS_URL,

    server: {
        github: process.env.GITHUB_URL || 'https://github.com',

        localport: process.env.PORT || 5000,

        always_recompile_sass: process.env.NODE_ENV === 'production' ? false : true,

        http: {
            protocol: process.env.PROTOCOL,
            host: process.env.HOST,
            port: process.env.HOST_PORT
        },

        url: process.env.PROTOCOL + '://' + process.env.HOST + (process.env.HOST_PORT ? ':' + process.env.HOST_PORT : ''),

        security: {
            sessionSecret: process.env.SESSION_SECRET || 'dashboard',
            cookieMaxAge: 60 * 60 * 1000
        },

        static: {
            lib: [__dirname + '/bower'],
            app: [__dirname + '/client']
        },

        webhooks: [
            __dirname + '/server/webhooks/*.js'
        ],

        controller: [
            __dirname + '/server/controller/!(default).js',
            __dirname + '/server/controller/default.js'
        ],

        middleware: [
            __dirname + '/server/middleware/*.js'
        ],

        passport: [
            __dirname + '/server/passports/*.js'
        ]
    }
};
