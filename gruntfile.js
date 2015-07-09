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
            files: {
                '../src/js/*.js': '../dist/js/main.js'
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
    grunt.registerTask('default', ['html', 'js', 'css']);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');

};