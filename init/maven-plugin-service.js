var reg = require('cla/reg');

reg.register('service.maven.command', {
    name: 'Run a maven command',
    icon: 'plugin/cla-maven-plugin/icon/maven.svg',
    form: '/plugin/cla-maven-plugin/form/maven-plugin-form.js',
    handler: function(ctx, params) {

        var reg = require('cla/reg');
        var fs = require('cla/fs');
        var log = require('cla/log');

        var buildMavenCommand = function(params, errorsType, executeCommand) {
            var output = reg.launch('service.scripting.remote', {
                name: 'Run a maven command',
                config: {
                    errors: errorsType,
                    server: params.server,
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

        function customGoal(option) {
            return option != "custom goals";
        }

        var errorsType = params.errorType || 'fail';
        var path = params.path;
        var mavenCommand = 'mvn ';
        var executeCommand = 'cd ' + path + ';';

        if (!fs.isDir(path)) {
            log.fatal('No such path ' + path + ' in  this server ' + params.server);
        }

        var command = '';
        var args = params.goals || [];
        var customOptions = params.custom || [];
        var customIndex = args.indexOf('custom goals');

        if (customIndex < 0) {
            if (args && args.length > 0) {
                if (typeof args == 'string') {
                    args = [args];
                }
                command += args.join(' ');
            }
        } else {
            args = args.filter(customGoal);
            if (args && args.length > 0) {
                if (typeof args == 'string') {
                    args = [args];
                }
                command += args.join(' ');
            }
            command += ' ' + customOptions.join(' ');
        }

        var launchCommand = mavenCommand + command;
        executeCommand += ' ' + launchCommand;

        if (launchCommand == 'mvn ') {
            log.fatal('You have not put any goals');
        }

        var response = buildMavenCommand(params, errorsType, executeCommand);

        return response.output;
    }
});