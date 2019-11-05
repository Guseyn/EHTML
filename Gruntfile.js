module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt)
  require('grunt-browserify')(grunt)
  require('grunt-contrib-uglify-es')(grunt)

  // Project configuration.
  grunt.initConfig({
    babel: {
      options: {
        sourceMap: false,
        presets: ['@babel/preset-env']
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['**/*.js'],
          dest: 'out',
          ext: '.js'
        }]
      }
    },
    browserify: {
      dist: {
        files: {
          'ehtml.bundle.js': ['out/**/*.js']
        }
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'ehtml.bundle.min.js': ['ehtml.bundle.js']
        }
      }
    }
  })

  // Default task(s).
  grunt.registerTask('default', ['babel', 'browserify', 'uglify'])

}
