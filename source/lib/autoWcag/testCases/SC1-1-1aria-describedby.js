define({
	'@id':            'auto-wcag:SC1-1-1-aria-describedby',
	'type':           'TestCriterion',
	'name':           'Proper use of aria-describedby',
	'isPartOf': 	  'wcag20:text-equiv-all',
	'mode': 	      'earl:semiAuto',
	'environment':    'auto-wcag:environment/rendered',
	'subject_type':   'auto-wcag:webpages/page_state',
	'user_expertise': 'auto-wcag:expertise/none',
	'user_profile':   ['auto-wcag:profile/sight'],
	'selector': {
		'method': 'css',
		'args':   'img[aria-describedby],' +
				  'input[type=image][aria-describedby], '+
				  '*[role=image][aria-describedby], '
	},
	'steps': [
		function (elm, complete) {
			complete({
			});
		}
	]
});
