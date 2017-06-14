(function(params) {
        Cla.help_push({
            title: _('Run Maven Command'),
            path: 'rules/palette/job/run-remote'
        });
        var data = params.data || {};

        var serverCombo = Cla.ui.ciCombo({
            name: 'server',
            class: 'generic_server',
            fieldLabel: _('Server'),
            value: data.server || '',
            allowBlank: false,
            with_vars: 1
        });

        var goalsComboBox = Cla.ui.comboBox({
            name: 'goals',
            fieldLabel: _('Goals'),
            data: [
                ['clean', 'clean'],
                ['compile', 'compile'],
                ['deploy', 'deploy'],
                ['install', 'install'],
                ['package', 'package'],
                ['initialize', 'initialize'],
                ['validate', 'validate'],
                ['test', 'test'],
                ['verify', 'verify'],
                ['generate-sources', 'generate-sources'],
                ['process-sources', 'process-sources'],
                ['generate-resources', 'generate-resources'],
                ['process-resources', 'process-resources'],
                ['custom goals', 'custom goals']
            ],
            value: data.goals || [],
            singleMode: false
        });

        var customParams = Cla.ui.arrayGrid({
            fieldLabel: _('Custom Params'),
            name: 'custom',
            value: data.custom,
            description: 'custom',
            default_value: '.',
            hidden: (data.goals != 'custom goals')
        });

        goalsComboBox.on('addItem', function() {
            var v = goalsComboBox.getValue();
            console.log(goalsComboBox.getValue())
            if (v.indexOf('custom goals') > 0) {
                customParams.show();
            }
        });

        goalsComboBox.on('removeItem', function() {
            var v = goalsComboBox.getValue();
            if (v.indexOf('custom goals') < 0) {
                customParams.hide();
            }
        });

        var pathText = Cla.ui.textField({
            name: 'path',
            fieldLabel: _('Project Path'),
            value: data.path || '',
            allowBlank: false
        });

        var errors = Cla.ui.errorManagementBox({
                errorTypeName: 'errorType',
                errorTypeValue: params.data.errorType || 'fail',
                rcOkName: 'rcOk',
                rcOkValue: params.data.rcOk,
                rcWarnName: 'rcWarn',
                rcWarnValue: params.data.rcWarn,
                rcErrorName: 'rcError',
                rcErrorValue: params.data.rcError,
                errorTabsValue: params.data
        });

    return [
        serverCombo,
        goalsComboBox,
        customParams,
        pathText,
        errors
    ]
})