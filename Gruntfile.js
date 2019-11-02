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
          cwd: 'src2',
          src: ['**/*.js'],
          dest: 'out2',
          ext: '.js'
        }]
      }
    },
    browserify: {
      dist: {
        files: {
          'ehtml2.bundle.js': ['out2/**/*.js']
        }
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'ehtml2.bundle.min.js': ['ehtml2.bundle.js']
        }
      }
    }
  })

  // Default task(s).
  grunt.registerTask('default', ['babel', 'browserify', 'uglify'])

}
