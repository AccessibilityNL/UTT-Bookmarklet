define({
  'id': 'auto-wcag:SC1-4-2-audio-control-audio',
  'type': 'TestCriterion',
  'name': 'Audio control',
  'isPartOf': 'wcag20:visual-audio-contrast-dis-audio',
  'mode': 'earl:semiAuto',
  'environment': 'auto-wcag:environment/dom',
  'subject_type': 'auto-wcag:webpages/single_web_page',
  'user_expertise': 'auto-wcag:expertise/none',
  'user_profile': ['auto-wcag:profile/hearing'],
  'selector': {
    'type':  'html',
    'value': 'audio', +
                 'video' // Formaat van selector?
  },
  'steps': [
    {
      'start': true,
      'name': 'step 1',
      'type': 'automatic' 
      // check paused property (audio|video.paused).
      function(selector) {
        var item = 'selector';  // Hoe selecteren we de selector?
        if (item.paused = true) {
          return {type: 'returnEarl', value: 'earl:passed'};
        } else {
          return {type: 'changeStep', value: 'step 2'};
        }
      }
    }
    {
      'name': 'step 2',
      'type': 'automatic',
      // Check muted property (audio|video.muted).
      function() {
        var item = 'selector';
        if (item.muted = true) {
          return {type: 'returnEarl', value: 'earl:passed'};
        } else {
          return {type: 'changeStep', value: 'step 3'};
        }
      }
    }
    {
      'name': 'step 3',
      'type': 'automatic',
      // Check duration property is no longer than 3 seconds (audio|video.duration).
      if (selector.duration < 3) {
        return {type: 'returnEarl', value: 'earl:passed'};
      } else {
        return {type: 'changeStep', value: 'step 4'};
      }
    }
    {
      'name': 'step 4',
      'type': 'automatic',
      // Check loop property (audio|video.loop).
      if (selector.loop = true) {
        return {type: 'returnEarl', value: 'earl:passed'};
      } else {
        return {type: 'changeStep', value: 'step 5'};
      }
    }
    {
      'name': 'step 5',
      'type': 'userQuestion',
      'question': {
        'questiontext': 'Is there audio playing on the web page?',
        'helptext': 'There should not be audio playing automatically on the web page loads.',
        'answers': {
          'yes': {type: 'changeStep', value: 'step 6'}
          'no': {type: 'returnEarl', value: 'earl:passed'}
        }
      }
    }
    {
      'name': 'step 6',
      'type': 'userQuestion',
      'question': {
        'questiontext': 'Does the web page provide a mechanism to control the sound as one of the first five links or buttons?',
        'helptext': 'A mechanism to pause or stop the video or audio, or control the volume or mute the audio must be available on the web page. The mechanism must be located as one of the first five links or buttons of the web page. This way people (with screen readers) can turn off the sound before reading the web page. To inspect this, use the tab key to navigate through the web page.',
        'answers': {
          'yes': {type: 'returnEarl', value: 'earl:passed'}
          'no': {type: 'returnEarl', value: 'earl:failed'}
        }
      }
    }
  ]
});