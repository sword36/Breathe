module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-nw-builder');

    grunt.initConfig({
        nwjs: {
            options: {
                platforms: ['win'],
                buildDir: './webkitbuilds', // Where the build version of my NW.js app is saved
                winIco: 'breathe/img/breathe.ico'
            },
            src: ['./breathe/**/*']
        }
    });
};