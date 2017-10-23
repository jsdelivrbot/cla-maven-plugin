var reg = require('cla/reg');

reg.register('service.maven.command', {
    name: _('Run a maven command'),
    icon: '/plugin/cla-maven-plugin/icon/maven.svg',
    form: '/plugin/cla-maven-plugin/form/maven-plugin-form.js',
    rulebook: {
        moniker: 'maven_task',
        description: _('Executes maven commands'),
        required: ['server', 'goals', 'path'],
        allow: ['server', 'goals', 'path', 'custom', 'user', 'errorType'],
        examples: [{
            maven_task: {
                server: 'maven_server',
                user: 'clarive_user',
                goals: ['custom goals'],
                path: "/projects/maven_project/",
                options_task: ['-v'],
                errorType: "fail"
            }
        }]
    },
    handler: function(ctx, params) {

        var reg = require('cla/reg');
        var fs = require('cla/fs');
        var log = require('cla/log');

        var buildMavenCommand = function(params, errorsType, executeCommand) {
            var output = reg.launch('service.scripting.remote', {
                name: _('Run a maven command'),
                config: {
                    errors: errorsType,
                    user: params.user,
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
        var path = params.path || "";
        var mavenCommand = 'mvn ';
        var executeCommand = 'cd ' + path + ' && ';

        if (!fs.isDir(path)) {
            log.fatal(_('No such path ') + path + _(' in  this server ') + params.server);
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

            if (args && args.length > 1) {
                args = [args]
                args = args.filter(customGoal);
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
            log.fatal(_('You have not put any goals'));
        }

        var response = buildMavenCommand(params, errorsType, executeCommand);

        return response.output;
    }
});