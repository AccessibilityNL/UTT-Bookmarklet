'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        settings: {
            source: 'source',
            build: 'build'
        },

        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['bowerInstall']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            compass: {
                files: ['<%= settings.source %>/styles/**/*.{scss,sass}'],
                tasks: ['compass:server']
            },
            babel: {
                files: ['<%= settings.source %>/scripts/**/*.js'],
                tasks: ['babel:server']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= settings.source %>/**/*.html',
                    '.tmp/**/*.*',
                    '<%= settings.source %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: ['.tmp', '<%= settings.source %>']
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: ['.tmp', 'test','<%= settings.source %>']
                }
            },
            dist: {
                options: {
                    base: '<%= settings.build %>'
                }
            }
        },

        // Automatically inject Bower components into the app
        bowerInstall: {
            app: {
                src: ['<%= settings.source %>/index.html'],
                ignorePath: '<%= settings.source %>/'
            },
            sass: {
                src: ['<%= settings.source %>/styles/{,*/}*.{scss,sass}'],
                ignorePath: '<%= settings.source %>/bower_components/'
            }
        },

        compass: {
            options: {
                sassDir: '<%= settings.source %>/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= settings.source %>/images',
                javascriptsDir: '<%= settings.source %>/scripts',
                fontsDir: '<%= settings.source %>/styles/bootstrap',
                importPath: '<%= settings.source %>/bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/fonts',
                relativeAssets: true,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= settings.build %>/images/generated'
                }
            },
            server: {
                options: {
                  debugInfo: false
                }
            }
        },

        babel: {
            options: {
                sourceMap: true
            },
            server: {
                files: [{
                    expand: true,
                    cwd: '<%= settings.source %>/scripts',
                    dest: '.tmp/scripts',
                    src: '**/*.js'
                }]
            }
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= settings.build %>/*',
                        '!<%= settings.build %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= settings.source %>',
                    dest: '<%= settings.build %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        '*.html',
                        'scripts/**/*.js',
                        'styles/**/*.css',
                        'images/{,*/}*.{webp}',
                        'fonts/*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= settings.build %>/images',
                    src: ['generated/*']
                }, {
                    expand: true,
                    flatten: true,
                    cwd: '<%= settings.source %>',
                    dest: '<%= settings.build %>/styles/bootstrap',
                    src: ['styles/bootstrap/*.*']
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= settings.source %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= settings.build %>/scripts/*.js',
                        '<%= settings.build %>/styles/main.css',
                    ]
                }
            }
        },
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }
        grunt.task.run([
            'clean:server',
            'bowerInstall',
            'compass:server',
            'babel:server',
            'connect:livereload',
            'watch'
        ]);
    });

/*
    grunt.registerTask('test', [
        'clean:server',
        'connect:test',
        'karma'
    ]);
*/
    grunt.registerTask('build', [
        'clean:dist',
        'bowerInstall',
        'compass:dist',
        'babel:dist',
        'copy',
    ]);
/*
    grunt.registerTask('default', [
        'test',
        'build'
    ]);
*/
};