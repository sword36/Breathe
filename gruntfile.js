module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-nw-builder');

    grunt.initConfig({
        nwjs: {
            options: {
                platforms: ['win32'],
                buildDir: './webkitbuilds', // Where the build version of my NW.js app is saved
                winIco: 'breathe/img/breathe.ico',
                version: '0.12.3'
            },
            src: ['./breathe/**/*']
        }
    });
};