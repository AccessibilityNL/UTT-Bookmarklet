define(['React', 'UTT/components/HomePanel', 'UTT/utils/browser-polyfill'],
function (React, HomePanel) {

    return function home({modules, footerModule}, i18n, render) {
        modules = modules.map((mod) => {
            return {
                activate:    mod.activate,
                icon:        mod.config.icon,
                title:       mod.locale.CATG_TITLE,
                description: mod.locale.CATG_DESCR,
                completed:   mod.config.completed,
                config:      mod.config
            };
        });
        render(HomePanel, {modules, footerModule, i18n});
    };
});

