/**
 * Configuration Module
 *
 * @title config
 * @overview Configuration Module
 */
module.exports = {

    terms: process.env.TERMS_URL,

    server: {
        github: {
            protocol: process.env.GITHUB_PROTOCOL || 'https',
            host: process.env.GITHUB_HOST || 'github.com',
            api: process.env.GITHUB_API_HOST || 'api.github.com',
            version: process.env.GITHUB_VERSION || '3.0.0',

            user: process.env.GITHUB_USER,
            pass: process.env.GITHUB_PASS
        },

        localport: process.env.PORT || 5000,

        always_recompile_sass: process.env.NODE_ENV === 'production' ? false : true,

        http: {
            protocol: process.env.PROTOCOL || 'https',
            host: process.env.HOST,
            port: process.env.HOST_PORT
        },

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
