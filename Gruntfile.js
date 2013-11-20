module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //
    // JSHINT
    //
    jshint: {
      all: [
        'Gruntfile.js',
        'src/js/*.js'
      ],
      options: {
        force: true,
        // Bad line breaking before '?'.
        '-W014': true,
        // Expected a conditional expression and instead saw an assignment.
        '-W084': true,
        // Is better written in dot notation.
        '-W069': true
      }
    },

    //
    // CLEAN GFX
    //
    clean: [
      'dist/gfx',
      'dist/css',
      'dist/js'
    ],

    //
    // COPY IMAGES, GFX, & FONTS
    //
    copy: {
      main: {
        files: [
          { expand: true, src: ['**'], cwd: 'src/gfx/', dest: 'dist/gfx' },
          { expand: true, src: ['**'], cwd: 'src/css/', dest: 'dist/css' },
          { expand: true, src: ['**'], cwd: 'src/js/libs', dest: 'dist/js/libs' }
        ]
      }
    },

    //
    // MINIFY CSS
    //
    cssmin: {
      styles: {
        src: ['dist/css/styles.css'],
        dest: 'dist/css/styles.min.css',
      },
      theme: {
        src: ['dist/css/theme.css'],
        dest: 'dist/css/theme.min.css',
      }
    },

    //
    // REQUIRE.JS
    //
    requirejs: {
      compile: {
        options: {
          name: 'mobilecard',
          baseUrl: "src/js",
          paths: {
            'formatter': 'libs/formatter/lib/formatter',
            'jquery': 'libs/jquery/jquery'
          },
          out: 'dist/js/mobilecard.js',
          exclude: ['jquery', 'formatter'],
          optimize: 'none',
          onBuildWrite: function(name, path, contents ) {
            return require('amdclean').clean(contents);
          },
          wrap: {
              startFile: ['src/js/tmpls/intro.js'],
              endFile: ['src/js/tmpls/outro.js']
          }
        }
      }
    },

    //
    // MINIFY JS
    //
    uglify: {
      all: {
        src: 'dist/js/mobilecard.js',
        dest: 'dist/js/mobilecard.min.js'
      }
    }

  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Tasks    
  grunt.registerTask('default', ['jshint', 'clean', 'copy', 'cssmin', 'requirejs', 'uglify']);
};