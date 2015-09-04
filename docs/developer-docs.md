# UTT Bookmarklet
The UTT Bookmarklet is a React application build to create a modular bookmarklet. It comes with a set of modules designed for user guided accessibility testing. Each user of the UTT Bookmarklet is given a unique ID so they can be identified. The bookmarklet comes with a collection of tools to generate and store EARL data, as well as to create it based on the test cases designed by the Auto-WCAG Community Group.


## Architecture
The tool is build using the following structure:

    docs                (Documentation in markdown)
    node_modules        (NPM dependencies)
    build               (Where Grunt creates the build)
    source
      bookmarklet.js
      lib
        main.js
        autoWcag
        components
        earlTools
        locale
        modules
        utils
      bower_components  (Bower dependencies)
      launcher

## Task runner
### `grunt serve`
This task creates a local server for active development. For this
task .scss files are converted to css, and Babel is used to 
convert ES6 to ES5. React is used to convert .jsx to .js files.

The local server is set up with live reloading to that any changes
done to the .js or .css files will result in a reload.

### `grunt build`
This does the same conversions as `grunt serve`, but in addition
it minifies the files and moves them to the `build` directory.
This process does not involve a local server.

### `grunt test`
There are currently no tests for this project. This was decided
because at the time there were no straight forward tools 
available for testing React components that used requireJS.


## bookmarklet.js
This is the script that gets loaded by the bookmarklet. It's
purpose is to load requireJS if it's not yet on the page, and
to then configure it and load `lib/main.js` (UTT/main), from 
where the actual application is launched. This is the point
at which the `UTT/locale` is defined, which maps to one of
the locale folder under `lib/locale/[LANG]/`.

This script is separated from main.js as a future version of
this tool may be included through other means then a bookmarklet,
such as through a plugin or directly embedded into an html page.
and launched through an icon on the page.


## UTT App (`lib/main.js`)
`main.js` is where the application is constructed and launched.
It loads dependencies it needs to start the app. Main is 
configured using `lib/config.js`, which tells it what modules
to display from the home module.

To start, main loads the home module (`lib/modules/home.js`).
This module will receive a list of all other modules that are
included in the application, and will display a list of those
modules, with a button to launch them.

Lazy loading is used to include modules. This means that the app
will only load modules when they are started. This saves intial
load time.


## Controllers (`lib/modules`)
This folder contains three modules used in UTT: home, assessor
and reporter. Each module must return a function. That function
is called with a config object, i18n function and a render 
function.

The module is responsible for loading a react component, and
calling the render method it is passed when it is read to 
(re)render the component with all the required dependencies.

New modules can use the following boilerplate:

    define(['MyComponent'], function (MyCompo) {
        return function (config, i18n, render) {
            render(MyComp, {config, i18n});
        }
    });

### UTT Home controller (`lib/modules/home`)
This module displays the `Home` compontent with a
list of all modules as defined in the app config.

### UTT Assessor controller (`lib/modules/assessor`)
This module is designed to enable a user to assess the 
accessibility of the current web page. It uses the autoWcag
library to run through the different test steps.

Each step for which the autoWcag library requires user input, 
a method is called that is passed to it by the assessor. This 
method is given the details of the question to ask the user, 
and returns a Promise that will resolve with the answer 
provided by the user.

The assessor comes with a `saveResults` helper. This module is
responsible for connecting to the EARL API, and saving the
results that are found using the assessor. The module uses
the earlTools library for this task.

**WORK IN PROGRESS**: Currenlty the assessor uses the
`buildQuestions` and `questions` modules as a simplified version
for what the autoWcag library will be doing. Once the autoWcag
library is completed these modules should be replaced.

### UTT Reporter controller (`lib/modules/reporter`)
The reporter is a module designed to display EARL assertions.
It lists all results it knows about the web page it is on, and
lets the user go through the individual elements to review the
findings.

The reporter is build in such a way that it can take EARL results
from multiple sources. This can be the assertor module, but it
could also be a separate accessibility test tool.

**WORK IN PROGRESS**: This tool is still in the early stages
of design. It needs proper EARL results to work with before
it can start to be used.


## React Components (`lib/components`)
The components folder contains all .jsx components for the app.
These components are build using React and are included by the
modules of UTT. Components are designed with reuse in mind. In
addition to the components there is an assets folder, in which
css files and images are placed.

- *Panel:* Generic 'floating' panel with drag 'n drp functionality
- *UttBookmarklet:* Outer most component for UTT, loads a Panel and Header
- *Header:* Displays the branding info of the app
- *ModuleList:* Lists modules with a button to start them
- *HomePanel:* ModuleList and a button to view the Reporter
- *UttModule:* A generic module wrapper for within the UttBookmarklet
- *Assessor:* UttModule component with elements for the assessor
- *Reporter:* ModuleList for all modules with EARL results
- *ReportDetails:* Displays the result of an EARL assertion


## autoWcag Library (`lib/autoWcag`)
The autoWcag library is a set of modules for automated and
semi-automated accessibility testing, based on the test cases
as they are defined in the Auto-WCAG Community Group.

testCase is the main module of this library. It is used to
load and then run the different test cases. With testCaseBuilder
a testCase (as defined in the `testcases` directory) is
converted in a set of functions that, when chained together,
can be used to run that specific test case.


## earlTools (`lib/earlTools`)
This library is designed to create EARL linked data and to
save it to an EARL API. It has factory methods for creating
assertions, evaluations, webpages and pointers. As well as an
adaptor (earlApi) that uses Qwest to connect to the UTT-API.


## Localisation
For each language that can be used within the tool, a folder is
contained within to display `lib/locale`. The localisation for
each individual module are loaded into the `config.js` file,
as well as a 'common' vacabulary for terms shared within the app.

The UTT App will use the translator utility to create an i18n
method which is passed to the module. This method is passed a
string to translate, and optionally a set of variables to 
include in the translated string.


## Utilities (`lib/utils`)
This directory contains a number of helpers used throughout the
UTT app. This includes the following modules:

- *assertion*: Dummy assertion generator, will become obsolete
- *browser-polyfill*: Adds ES5 and ES6 functionality to older browsers
- *highlighter*: Select and put emphasis on an element that ought to be tested
- *rootNode*: create and animate the root node for the app to live in
- *strFormat*: Basic string formatter
- *translator*: Translator with i18n functionality


## Bookmarklet launcher
The launcher is a simple HTML page, that includes a script which
can generate the string to be used as the bookmarklet. Within
`launcher/scripts/main.js` the string is created. And the
`launcher/scripts/userkey.js` creates a unique 64 character
identifier for the bookmarklet so that each bookmarklet can be
identified.

