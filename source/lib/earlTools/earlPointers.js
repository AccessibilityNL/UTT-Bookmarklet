define([],
function() {

    /**
     * Helper function to filter items from a list that pass the comparator
     * test.
     *
     * @param {Array} list
     * @param {function} comparator
     *   A function that return a boolean. True means the list item will be
     *   discarded from the list.
     * @return array
     *   A list of items the excludes items that passed the comparator test.
     */
    function reject(list, comparator) {
        var keepers = [];
        for (var i = 0, il = list.length; i < il; i++) {
            if (!comparator.call(null, list[i])) {
                keepers.push(list[i]);
            }
        }
        return keepers;
    }

    let classSplit = /[\s~!@$%^&*()+=,./';:"?><\[\]\\{}|`#]+/;
    let earlPointers = {

        /**
         * Format:
         * {
         *      "@type": "charSnippet",
         *      "startPointer": {
         *          "@type": "lineCharPointer",
         *          "lineNumber": 15,
         *          "charNumber": 15,
         *      },
         *      "chars": "<img src=\"http://www.norge.no/sites/norgeno3/files/slett_kontaktinformasjon_3041265.jpg\" alt=\"\" style=\"width:100%\" />"
         *  }
         * @param  {[type]} domElm [description]
         * @return {[type]}        [description]
         */
        createPointer(domElm) {
            let css = earlPointers.createCssSelector(domElm);
            console.log(css);
            return {
                "@type": "ptr:CSSSelectorPointer",
                "expression":css,
            };
        },


        /**
         * Creates a unique selector using id, classes and attributes.
         *
         * It is possible that the selector will not be unique if there is no
         * unique description using only ids, classes and attributes of an
         * element that exist on the page already. If uniqueness cannot be
         * determined and is required, you will need to add a unique identifier
         * to the element through theming development.
         *
         * Original by Jesse Beach, QuailJS
         *
         * @param {HTMLElement} element
         * @return {string}   A unique selector for the element.
         */
        createCssSelector(domElm) {
            var selector = '';
            var scopeSelector = '';
            var pseudoUnique = false;
            var firstPass = true;

            do {
                scopeSelector = '';

                // Try to apply an ID.
                scopeSelector = earlPointers.applyID(domElm);
                if (scopeSelector.length > 0) {
                    selector = scopeSelector + ' ' + selector;
                    // Assume that a selector with an ID in the string is unique.
                    break;
                }

                // Try to apply classes.
                scopeSelector = earlPointers.applyClasses(domElm);
                if (!pseudoUnique && scopeSelector.length > 0) {
                    // If the classes don't create a unique path, tack them on and
                    // continue.
                    selector = scopeSelector + ' ' + selector;
                    // If the classes do create a unique path, mark this selector as
                    // pseudo unique. We will keep attempting to find an ID to really
                    // guarantee uniqueness.
                    if (earlPointers.isUniquePath(selector)) {
                        pseudoUnique = true;
                    }
                }

                // Process the original element.
                if (firstPass) {
                    // Try to add attributes.
                    scopeSelector = earlPointers.applyAttributes(domElm);
                    if (scopeSelector.length > 0) {
                        // Do not include a space because the attributes qualify the
                        // element. Append classes if they exist.
                        selector = scopeSelector + selector;
                    }

                    // Add the element nodeName.
                    selector = domElm.nodeName.toLowerCase() + selector;

                    // The original element has been processed.
                    firstPass = false;
                }

                // Try the parent element to apply some scope.
                domElm = domElm.parentNode;

            } while (domElm && domElm.nodeType === 1 &&
                     domElm.nodeName !== 'BODY' &&
                     domElm.nodeName !== 'HTML');

            return selector.trim();
        },


        /**
         * Creates a selector from the element's id attribute.
         *
         * Temporary IDs created by the module that contain "visitorActions" are excluded.
         *
         * @param {HTMLElement} element
         * @return {string}     An id selector or an empty string.
         */
        applyID(element) {
            var selector = '';
            var id = element.id || '';
            if (id.length > 0) {
                selector = '#' + id;
            }
            return selector;
        },


        /**
         * Creates a selector from classes on the element.
         *
         * Classes with known functional components like the word 'active' are
         * excluded because these often denote state, not identity.
         *
         * @param {HTMLElement} element
         * @return {string}     A selector of classes or an empty string.
         */
        applyClasses(element) {
            var selector = '';
            // Try to make a selector from the element's classes.
            var classes = (element.className.trim() || '')
                          .split(classSplit)
                          .filter((s) => s !== '');

            if (classes.length > 0) {
                // Filter out classes that might represent state.
                classes = reject(classes, (cl) => {
                    return (/utt-highlight|active|enabled|disabled|first|last|only|collapsed|open|clearfix|processed/).test(cl);
                });
                if (classes.length > 0) {
                    return '.' + classes.join('.');
                }
            }
            return selector;
        },


       /**
        * Indicates whether the selector string represents a unique DOM element.
        *
        * @param {string} selector   A string selector that can be used to query a DOM element.
        * @return Boolean   Whether or not the selector string represents a unique DOM element.
        */
        isUniquePath (selector) {
            return document.querySelector(selector).length === 1;
        },


        /**
         * Finds attributes on the element and creates a selector from them.
         *
         * @param {HTMLElement} element
         *
         * @return {string}
         *   A selector of attributes or an empty string.
         */
        applyAttributes (element) {
            var selector = '';
            var attributes = ['href', 'type'];
            var value;
            if (typeof element === 'undefined' ||
                typeof element.attributes === 'undefined' ||
                element.attributes === null) {
                return selector;
            }
            // Try to make a selector from the element's classes.
            for (var i = 0, len = attributes.length; i < len; i++) {
                value = element.attributes[attributes[i]] && element.attributes[attributes[i]].value;
                if (value) {
                    selector += '[' + attributes[i] + '="' + value + '"]';
                }
            }
            return selector;
        }

    };

    return earlPointers;

});
