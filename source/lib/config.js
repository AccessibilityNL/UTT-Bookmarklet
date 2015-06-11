define(function () {
    let localeAssessor = {
        "NO_QUESTION": "No questions"
    };

    let config = {
        modules: [{
            'title':       'Images',
            'description': 'Test explination text 1 line.',
            'image': 'icon.images',
            "controller": "UTT/modules/assessor",
            "config": {
                "questions": "UTT/modules/assessor/questions",
                "category": "images"
            },
            locale: localeAssessor
        }, {
            'title': 'Multimedia',
            'description': 'Test explination text 2 line.',
            "controller": "UTT/modules/assessor",
            'image': 'icon.media',
            config: {
                "questions": "UTT/modules/assessor/questions",
                "category": "media"
            },
            locale: localeAssessor
        }, {
            'title': 'Language change',
            'description': 'Test explination text 3 line.',
            "controller": "UTT/modules/assessor",
            'image': 'icon.language',
            config: {
                "questions": "UTT/modules/assessor/questions",
                "category": "language"
            },
            locale: localeAssessor
        }, {
            'title': 'Navigation',
            'description': 'Test explination text 4 line.',
            "controller": "UTT/modules/assessor",
            'image': 'icon.navigation',
            config: {
                "questions": "UTT/modules/assessor/questions",
                "category": "navigation"
            },
            locale: localeAssessor
        }, {
            'title': 'Keyboard',
            'description': 'Test explination text 5 line.',
            "controller": "UTT/modules/assessor",
            'image': 'icon.keyboard',
            config: {
                "questions": "UTT/modules/assessor/questions",
                "category": "keyboard"
            },
            locale: localeAssessor
        }],
        locale: {}
    };

    return config;
});