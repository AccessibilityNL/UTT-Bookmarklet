define({
    'id': 'auto-wcag:SC2-4-2-title',
    'type': 'TestCriterion',
    'name': 'Page title',
    'isPartOf': 'wcag20:navigation-mechanisms-title',
    'mode': 'earl:semiAuto',
    'environment': 'auto-wcag:environment/dom',
    'subject_type': 'auto-wcag:webpages/single_web_page',
    'user_expertise': 'auto-wcag:expertise/none',
    'user_profile': ['auto-wcag:profile/none'],
    'selector': {
        'type':  'css',
        'value': 'html'
    },
    'steps': [{
        'start': true,
        'name': 'step 1',
        'type': 'automatic',
        // Check that there is a <title> element in the head section of the html document.
        'method': function checkTitle(variables) {
            if (document.title) {
                return {
                    type: 'changeStep',
                    value: 'step 2'
                };
            } else {
                return {
                    type: 'returnEarl',
                    value: 'earl:failed'
                };
            }
        }
    }, {
        'name': 'step 2',
        'type': 'userQuestion',
        'question': {
            'questiontext': 'Does the web page title describe the context and purpose of this web page?',
            'helptext': 'A web page title should describe the content or purpose of the web page, and uniquely identify it within the web site.',
            'answers': {
                'yes': {
                    type: 'returnEarl',
                    value: 'earl:passed'
                },
                'no': {
                    type: 'returnEarl',
                    value: 'earl:failed'
                }
            }
        }
    }]
});
