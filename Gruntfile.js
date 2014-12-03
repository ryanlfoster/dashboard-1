module.exports = function(grunt) {

    var config = {

        pkg: grunt.file.readJSON('package.json'),

        eslint: {
            app: {
                files: {
                    src: ['*.js', 'src']
                }
            }
        },

        scsslint: {
            allFiles: [
              'src/client/assets/styles/*.scss'
            ],
            options: {
              config: '.scss-lint.yml',
              colorizeOutput: true
            }
        }
    };

    // Initialize configuration
    grunt.initConfig(config);

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['eslint']);
    grunt.registerTask('lint', ['eslint', 'scsslint']);
};
