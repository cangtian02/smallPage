module.exports = function (grunt) {
    var transport = require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var text = transport.text.init(grunt);
    var script = transport.script.init(grunt);
	
    grunt.initConfig({
        pkg : grunt.file.readJSON("package.json"),

        transport : {
            options : {
                paths : ['.'],
                alias: '<%= pkg.spm.alias %>',
                parsers : {
                    '.js' : [script.jsParser],
                    '.css' : [style.css2jsParser],
                    '.html' : [text.html2jsParser]
                }
            },

            public_modules : {
                options : {
                    idleading : 'dist/public_modules/'
                },

                files : [
                    {
                        cwd : 'public_modules/',
                        src : '**/*',
                        filter : 'isFile',
                        dest : '.build/public_modules'
                    }
                ]
            },

            control : {
                options : {
                    idleading : 'dist/control/'
                },

                files : [
                    {
                        cwd : 'control',
                        src : '**/*',
                        filter : 'isFile',
                        dest : '.build/control'
                    }
                ]
            }
        },
        concat : {
            options : {
                paths : ['.'],
                include : 'relative'
            },
            public_modules : {
                files: [
                    {
                        expand: true,
                        cwd: '.build/',
                        src: ['public_modules/**/*.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            },
            control : {
                options : {
                    include : 'all'
                },
                files: [
                    {
                        expand: true,
                        cwd: '.build/',
                        src: ['control/**/*.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            }
        },

        uglify : {
            public_modules : {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['public_modules/**/*.js', '!public_modules/**/*-debug.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            },
            control : {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['control/**/*.js', '!control/**/*-debug.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            }
        },

        clean : {
            spm : ['.build']
        },
        
        replace: {
            dist: {
                options: {
                    patterns: [{
                        match: /config.js/g,
                        replacement: 'config.js?v=' + '<%= pkg.version %>'
                    }]
                },
                files: [{
                    expand: true,
                    cwd: 'view/',
                    src: ['**/*.html'],
                    dest: 'build/'
                }]
            }
        }               
        
    });

    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
   	grunt.loadNpmTasks('grunt-replace');
     
    grunt.registerTask('build-p', ['transport:public_modules', 'concat:public_modules', 'uglify:public_modules', 'clean']);//合并压缩公共模块
    grunt.registerTask('build-c', ['transport:control', 'concat:control', 'uglify:control', 'clean']);//合并压缩控制模块
    grunt.registerTask('build-r', ['replace']);//为config.js打版本号，解决缓存问题
    //第一步先执行grunt build-p，成功后再执行grunt build-c，最后执行build-r  
};