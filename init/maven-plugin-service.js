var reg = require('cla/reg');

reg.register('service.maven.command', {
    name: 'Run a maven command',
    icon: 'plugin/cla-maven-plugin/icon/maven.svg',
    form: '/plugin/cla-maven-plugin/form/maven-plugin-form.js',

    handler: function(ctx, params) {

        var reg = require('cla/reg');
        var fs = require('cla/fs');
        var log = require('cla/log');
        var proc = require('cla/process');

        var errorsType = params.errors || 'fail';
	    var path = params.path;
        var mavenCommand = 'mvn';
        var executeCommand = 'cd ' + path + ';';
        var output = '';

        if (!fs.isDir(path)) {
            log.fatal('No such path ' + path + ' in  this server ' + params.server);
        }

        var buildMavenCommand = function(params) {
            var command = '';
            var args = params.args || [];
            var paramsDefaults = params.paramsDefaults || [];

            if (args != 'custom goal') {
                if (args && args.length > 0) {
                    if (typeof args == 'string') {
                        args = [args];
                    }
                    command += args.join(' ') + ' ';
                }
            }
            paramsDefaults.forEach(function(element) {
                command += ' ' + element;
            });

            return command;
        }

        mavenCommand = buildMavenCommand(params);
        if (mavenCommand == 'mvn') {
            log.fatal('You have not put any goals');
        }

        executeCommand += ' ' + mavenCommand;

        output = reg.launch('service.scripting.remote', {
            name: 'Run a maven command',
            config: {
                errors: errorsType,
                server: params.server,
                user: params.user,
                path: path,
                path: executeCommand,
                output_error: params.output_error,
                output_warn: params.output_warn,
                output_capture: params.output_capture,
                output_ok: params.output_ok,
                meta: params.meta,
                rc_ok: params.rcOk,
                rc_error: params.rcError,
                rc_warn: params.rcWarn
            }
        });
        return output;
    }
});
