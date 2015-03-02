'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
                files: ['<%= settings.source %>/launcher/styles/**/*.scss'],
                tasks: ['compass:server']
            },
            compass_components: {
                files: ['<%= settings.source %>/lib/components/assets/styles/**/*.scss'],
                tasks: ['compass:components']
            },
            babel: {
                files: ['<%= settings.source %>/**/*.js'],
                tasks: ['babel:server', 'concat:server']
            },
            react: {
                files: ['<%= settings.source %>/lib/components/**/*.jsx'],
                tasks: ['build-components']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= settings.source %>/**/*.html',
                    '.tmp/**/*.*',
                    '<%= settings.source %>/launcher/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
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
                    open: 'http://127.0.0.1:9000/launcher',
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
                sassDir: '<%= settings.source %>/launcher/styles',
                cssDir: '.tmp/launcher/styles',
                imagesDir: '<%= settings.source %>/images',
                javascriptsDir: '<%= settings.source %>/scripts',
                fontsDir: '<%= settings.source %>/launcher/fonts',
                importPath: '<%= settings.source %>/bower_components',
                httpImagesPath: '/images',
                httpFontsPath: '/launcher/fonts',
                relativeAssets: true,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            components: {
                options: {
                    sassDir: '<%= settings.source %>/lib/components/assets/styles',
                    cssDir: '.tmp/lib/components/assets/styles'
                }
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
                sourceMap: true,
            },
            server: {
                files: [{
                    '.tmp/bookmarklet.js': '<%= settings.source %>/bookmarklet.js'
                }, {
                    expand: true,
                    cwd: '<%= settings.source %>/lib',
                    dest: '.tmp/lib',
                    src: '**/*.js'
                }, {
                    expand: true,
                    cwd: '<%= settings.source %>/launcher/scripts',
                    dest: '.tmp/launcher/scripts',
                    src: '**/*.js'
                }]
            },
            components: {
                files: [{
                    expand: true,
                    cwd: '.tmp/lib/components/',
                    dest: '.tmp/lib/components/',
                    src: '**/*.js',
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

        concat: {
            server: {
                options: {
                    sourceMap: true
                },
                files: {
                    '.tmp/bookmarklet.concat.js': ['.tmp/bookmarklet.js', '.tmp/lib/**/*.js']
                },
            }
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
                        '/**/*.{html,js,css}',
                        'images/{,*/}*.{webp}',
                        'fonts/*'
                    ]
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= settings.source %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },

        mochaTest: {
            test: {
                src: ['test/**/*.js']
            }
        },

        react: {
            options: {
                extension: 'js',
                harmony: true
            },
            components: {
                files: [{
                    expand: true,
                    cwd: '<%= settings.source %>/lib/components/',
                    dest: '.tmp/lib/components/',
                    src: '**/*.jsx',
                    rename: function(dest, src) {
                        return dest + src.replace(/\.jsx$/, ".js");
                    }
                }]
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= settings.source %>/**/*.js',
                '!<%= settings.source %>/bower_components/**',
            ],
            test: {
                src: ['test/**/*.js']
            }
        }
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }
        grunt.task.run([
            'clean:server',
            'bowerInstall',
            'compass:server',
            'compass:components',
            'babel:server',
            'concat:server',
            'build-components',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'jshint:all:test',
        'clean:server',
        'babel:server',
        'build-components',
        'mochaTest'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'bowerInstall',
        'compass:components',
        'compass:dist',
        'babel:dist',
        'copy',
    ]);

    grunt.registerTask('build-components', [
        'react:components',
        'babel:components'
    ]);

    grunt.registerTask('build-bookmark', [
        'babel:server',
        'concat:server'
    ]);
/*
    grunt.registerTask('default', [
        'test',
        'build'
    ]);
*/
};