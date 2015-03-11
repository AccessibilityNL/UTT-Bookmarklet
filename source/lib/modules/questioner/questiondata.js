define({
    // postUrl: '' // (optionsal) Path to which the data should be posted
    questions: {
        'auto-wcag:1.1.1-img-alt': {
            selector: { css:'img[alt]' },
            variables: ['alt'],
            text: 'Is "{0}" a good description for this image?',
            help: '',
            limit: 5,
            answers: [
                {value: 'passed',   'text': 'yes'},
                {value: 'failed',   'text': 'no'},
                {value: 'cantTell', 'text': 'Unclear'},
            ]
        }
    }
});