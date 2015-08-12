define([
    'UTT/locale/common',
    'UTT/locale/assessor/common',
    'UTT/locale/assessor/images',
    'UTT/locale/assessor/media',
    'UTT/locale/assessor/language',
    'UTT/locale/assessor/navigation',
    'UTT/locale/assessor/keyboard',
    'UTT/locale/reporter',
    'UTT/utils/browser-polyfill',
], function () {
    let localeAssessor = require('UTT/locale/assessor/common');

    const assessorNames = [
        'images',
        'media',
        'language',
        'navigation',
        'keyboard'
    ];

    const assessorTests = {
        images: ["autoWcag/testCases/SC1-1-1aria-describedby"],
        media: ["autoWcag/testCases/SC1-4-2audio-control-audio"],
        language: ["autoWcag/testCases/SC1-1-1aria-describedby"],
        navigation: ["autoWcag/testCases/SC1-1-1aria-describedby"],
        keyboard: ["autoWcag/testCases/SC1-1-1aria-describedby"]
    };

    let config = {
        apiUrl:  'http://utt-dev.huell.appnormal.com/v1',
        modules: assessorNames.map(assessorName => ({
                "controller": 'UTT/modules/assessor/assessor',
                "config": {
                    "category":       assessorName,
                    'icon':           `icon-${assessorName}.svg`,
                    'iconIncomplete': `icon-${assessorName}-report-0.svg`,
                    'iconComplete':   `icon-${assessorName}-report-1.svg`,
                    "questions":      assessorTests[assessorName]
                },
                locale: Object.assign(
                        require('UTT/locale/assessor/' + assessorName),
                        localeAssessor)
            })
        ),
        footerModule: {
            controller: 'UTT/modules/reporter/reporter',
            config: {
                categories: assessorNames
            },
            locale: require('UTT/locale/reporter')
        },
        locale: require('UTT/locale/common')
    };

    return config;
});