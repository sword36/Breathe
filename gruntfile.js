module.exports = function(grunt) {
    require('time-grunt')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        jshint: {
            files: ['gruntfile.js', 'src/js/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        uglify: {
            options: {},
            build: {
                files: [{
                    expand: true,
                    src: ['*.js'],
                    dest: 'build',
                    ext: '.min.js'
                }]
            }
        },

        browserify: {
            options: {
                browserifyOptions: {
                    debug: true
                }
            },
            dist: {
                files: {
                    'dist/js/main.js': ['src/js/*.js']
                }
            }
        },

        watch: {
            options: {
                spawn: false,
                livereload: 63342
            },
            scripts: {
                files: ['grunt.js', 'src/js/*.js'],
                tasks: ['check']
            }
        }
    });

    grunt.registerTask('check', ['jshint']);
    grunt.registerTask('default', ['check', 'browserify']);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');

};