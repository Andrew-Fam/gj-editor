module.exports = function(grunt) {

  "use strict";
  
  require("matchdep").filter("grunt-*").forEach(grunt.loadNpmTasks);

  var www = './bin';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: 8000,
          hostname: '*',
          base: www,
          keepalive: true
        }
      }
    },
    folder_list: {
      sprite: {
        options: {
          files: true,
          folders: false
        },
        files: {
          './bin/sprites.json': ['./bin/sprites/**']
        },
      }
    },
    watch: {
      spritesDirectory: {
        files: ['./bin/sprites/*.*'],
        tasks: ['folder_list'],
        options: {
          nospawn: false,
          livereload: false
        }
      }
    },
    concurrent: {
      all: {
        tasks: ['connect:server', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['folder_list','concurrent:all']);

};