/*** EventButton Z-Way HA module *******************************************

Version: 1.00
(c) Maroš Kollár, 2015
-----------------------------------------------------------------------------
Author: Maroš Kollár <maros@k-1.com>
Description:
    Emitt events on push of a button

******************************************************************************/

function EventButton (id, controller) {
    // Call superconstructor first (AutomationModule)
    EventButton.super_.call(this, id, controller);
}

inherits(EventButton, BaseModule);

_module = EventButton;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

EventButton.prototype.init = function (config) {
    EventButton.super_.prototype.init.call(this, config);

    var self = this;

    // Create vdev
    this.vDev = this.controller.devices.create({
        deviceId: "EventButton_" + this.id,
        defaults: {
            metrics: {
                probeTitle: 'title',
                title: self.langFile.m_title,
                level: 'off',
                icon: self.imagePath+'/icon.png'
            }
        },
        overlay: {
            probeType: 'type',
            deviceType: 'toggleButton'
        },
        handler: function(command,args) {
            if (command === 'on') {
                self.vDev.set('updateTime',new Date().getTime() / 1000);
                _.each(self.config.events,function(event) {
                    self.log('Emitting event '+event);
                    self.controller.emit(event);
                });
            }
        },
        moduleId: this.id
    });
};

EventButton.prototype.stop = function () {
    var self = this;

    if (self.vDev) {
        self.controller.devices.remove(self.vDev.id);
        self.vDev = undefined;
    }

    EventButton.super_.prototype.stop.call(this);
};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------