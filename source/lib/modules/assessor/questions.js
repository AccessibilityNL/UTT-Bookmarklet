define([], function () {

    let dummyQuestion = {
        selector: {css: 'h1, h2, h3, h4, h5, h6'},
        text: "Are you having fun?",
        variables: [],
        limit: 3,
        help: "Summer means happy times and good sunshine. It means going to the beach, " +
              "going to Disneyland, having fun.",
        answers: [
            {value: 'passed',   'text': 'yes'},
            {value: 'failed',   'text': 'no'},
            {value: 'cantTell', 'text': 'Unclear'},
        ]
    };

    let data = {
        // postUrl: '' // (optionsal) Path to which the data should be posted
        "images": {
            'auto-wcag:1.1.1-img-alt': {
                selector: { css:'img[alt]' },
                variables: ['alt'],
                text: 'Is "{0}" a good description for this image?',
                help: 'some text about images',
                limit: 10,
                answers: [
                    {value: 'passed',   'text': 'yes'},
                    {value: 'failed',   'text': 'no'},
                    {value: 'cantTell', 'text': 'Unclear'},
                ]
            }
        },

        "navigation": {
            'auto-wcag:2-4-2-title': {
                selector: { css:'title' },
                variables: ['text'],
                text: 'Is "{0}" a good description for this page?',
                help: 'some text about titles',
                limit: 1,
                answers: [
                    {value: 'passed',   'text': 'yes'},
                    {value: 'failed',   'text': 'no'},
                    {value: 'cantTell', 'text': 'Unclear'},
                ]
            }
        },

        "media":    { 'auto-wcag:having-fun': dummyQuestion },
        "language": { 'auto-wcag:having-fun': dummyQuestion },
        "keyboard": { 'auto-wcag:having-fun': dummyQuestion }
    };

    return data;

});