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
                ['clean', _('clean')],
                ['compile', _('compile')],
                ['deploy', _('deploy')],
                ['install', _('install')],
                ['package', _('package')],
                ['initialize', _('initialize')],
                ['validate', _('validate')],
                ['test', _('test')],
                ['verify', _('verify')],
                ['generate-sources', _('generate-sources')],
                ['process-sources', _('process-sources')],
                ['generate-resources', _('generate-resources')],
                ['process-resources', _('process-resources')],
                ['custom goals', _('custom goals')]
            ],
            value: data.goals || [],
            singleMode: false
        });

        var customParams = Cla.ui.arrayGrid({
            fieldLabel: _('Custom Params'),
            name: 'custom',
            value: data.custom,
            description: _('custom'),
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