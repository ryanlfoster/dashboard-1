/**
 * Configuration Module
 *
 * @title config
 * @overview Configuration Module
 */

module.exports = {

    terms: process.env.TERMS_URL,

    token: process.env.TOKEN,

    server: {
        github: process.env.GITHUB_URL || 'https://github.com',

        github_api: process.env.GITHUB_API_URL || 'https://api.github.com',

        localport: process.env.PORT || 5000,

        always_recompile_sass: process.env.NODE_ENV === 'production' ? false : true,

        http: {
            protocol: process.env.PROTOCOL,
            host: process.env.HOST,
            port: process.env.HOST_PORT
        },

        url: process.env.PROTOCOL + '://' + process.env.HOST + (process.env.HOST_PORT ? ':' + process.env.HOST_PORT : ''),

        https: {
            certs: process.env.CERT
        },

        security: {
            sessionSecret: process.env.SESSION_SECRET || 'dashboard',
            cookieMaxAge: 60 * 60 * 1000
        },

        static: {
            lib: [__dirname + '/bower'],
            app: [__dirname + '/client']
        },

        api: [
            __dirname + '/server/api/*.js'
        ],

        controller: [
            __dirname + '/server/controller/!(default).js',
            __dirname + '/server/controller/default.js'
        ],

        middleware: [
            __dirname + '/server/middleware/*.js'
        ]
    }
};
