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

    var userText = Cla.ui.textField({
        name: 'user',
        fieldLabel: _('User'),
        value: data.user
    });serverCombo

    var goalsComboBox = Cla.ui.comboBox({
        name: 'goals',
        fieldLabel: _('Goals'),
        data: [
            ['clean'],
            ['compile'],
            ['deploy'],
            ['install'],
            ['package'],
            ['initialize'],
            ['validate'],
            ['test'],
            ['verify'],
            ['generate-sources'],
            ['process-sources'],
            ['generate-resources'],
            ['process-resources'],
            ['custom goals']
        ],
        value: data.goals || [],
        singleMode: false 
    });

    var customParams = new Baseliner.ArrayGrid({
        fieldLabel: _('Custom Params'),
        name: 'custom',
        value: data.custom,
        description: 'custom',
        default_value: '.',
        hidden: ( data.goals != 'custom goals')
    });
    
    goalsComboBox.on('addItem', function() {
        var v = goalsComboBox.getValue();
        if( v.indexOf('custom goals') > 0 ){
            customParams.show();
        }
    });

    goalsComboBox.on('removeItem', function() {
        var v = goalsComboBox.getValue();
        if( v.indexOf('custom goals') <  0 ){
            customParams.hide();
        }
    });

    var pathText = Cla.ui.textField({
        name: 'path',
        fieldLabel: _('Project Path'),
        value: data.path || '',
        allowBlank: false
    });

    var errors = new Baseliner.ComboSingle({
        fieldLabel: _('Errors'),
        name: 'errors',
        value: data.errors || 'fail',
        data: [
            'fail',
            'warn',
            'custom',
            'silent'
        ]
    });

    var customError = new Ext.Panel({
        layout: 'column',
        fieldLabel: _('Return Codes'),
        frame: true,
        hidden: data.errors != 'custom',
        items: [{
            layout: 'form',
            columnWidth: .33,
            labelAlign: 'top',
            frame: true,
            items: {
                xtype: 'textfield',
                anchor: '100%',
                fieldLabel: _('Ok'),
                name: 'rcOk',
                value: params.data.rcOk
            }
        }, {
            layout: 'form',
            columnWidth: .33,
            labelAlign: 'top',
            frame: true,
            items: {
                xtype: 'textfield',
                anchor: '100%',
                fieldLabel: _('Warn'),
                name: 'rcWarn',
                value: params.data.rcWarn
            }
        }, {
            layout: 'form',
            columnWidth: .33,
            labelAlign: 'top',
            frame: true,
            items: {
                xtype: 'textfield',
                anchor: '100%',
                fieldLabel: _('Error'),
                name: 'rcError',
                value: params.data.rcError
            }
        }],
        show_hide: function() {
            errors.getValue() == 'custom' ? this.show() : this.hide();
            this.doLayout();
        }
    });

    errors.on('select', function() {
        customError.show_hide()
    });

    return [
        serverCombo,
        userText,
        goalsComboBox,
        customParams,
        pathText,
        errors,
        customError,
        new Baseliner.ErrorOutputTabs({
            data: data
        })
    ]
})
