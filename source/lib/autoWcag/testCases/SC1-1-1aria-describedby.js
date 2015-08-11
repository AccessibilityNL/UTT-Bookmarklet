define({
	'id':            'auto-wcag:SC1-1-1-aria-describedby',
	'type':          'TestCriterion',
	'name':           'Proper use of aria-describedby',
	'isPartOf': 	  'wcag20:text-equiv-all',
	'mode': 	      'earl:semiAuto',
	'environment':    'auto-wcag:environment/rendered',
	'subject_type':   'auto-wcag:webpages/page_state',
	'user_expertise': 'auto-wcag:expertise/none',
	'user_profile':   ['auto-wcag:profile/sight'],
	'selector': {
		'type':  'css',
		'value': 'img[aria-describedby],' +
				 'input[type=image][aria-describedby], '+
				 '*[role=image][aria-describedby], '
	},
	// of:
	// 'selector': function (root) {
	// 	elms = root.doedingen();
	// 	// magie!
	// 	return elms;
	// }
	'steps': [{
		'start': true,
		'name': 'step 1',
		'type': 'userQuestion',
		'question': {
			'questiontext': '',
			'helptext': '',
			'answers': {
				'no': {type: 'changeStep', value: 'step 2'},
				'yes': {type: 'returnEarl', value: 'earl:failed'}
			}
		}
	}, {
		'name': 'step 2',
		'type': 'automatic',
		call: function (variables) {
			if (variables.selected.nodeName === 'IMG') {
				return {type: 'changeStep', value: 'step 3'};
			} else {
				return {type: 'returnEarl', value: 'earl:failed'};
			}
		}
	}]
});



// {
// 	selector: function() { return elms; },
// 	testSteps: function (elm) { return earl }
// }


