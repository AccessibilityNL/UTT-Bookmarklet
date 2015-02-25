define({
    questions: {
        '1.1.1-img-alt': {
            selector: { css:'img[alt]' },
            variables: ['alt'],
            question: 'Is "{0}" a good description for this image?',
            help: '',
            answers: {
                'passed': 'yes',
                'failed': 'no',
                'cantTell': 'Unclear'
            }
    }}
});