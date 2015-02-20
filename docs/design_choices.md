# Technology Design Choices
Of key importance to the success of the UTT bookmarklet is it's extensibility. To ease the development of the UTT Bookmarklet and of future extensions the decision was made to build the UTT Bookmarklet using a number of powerful technologies.

## Grunt
Grunt is a build tool for Node. It allows developers of the UTT Bookmarklet and any future extensions of it to work with technologies that require a build step before they can be deployed to the browser. These build-to-browser technologies are designed to speed op the development process and to make projects more maintainable. In addition to this Grunt is used to simplify minification of the project, which is important to improve to speed up the final product. With Grunt, we're using Connect, Watch, Bower, Clean, Concat, Jshint, Copy, Cssmin and Ugilfy. These are all to ease the development and build process. 

The disadvantage to grunt is that it requires the developers to work with the command line and Node.js. Many developers are not yet familiar with this, though for a project such as Grunt is the most commonly used build tool at this time.

## Babel / 6to5
Babel (formerly known as 6to5) is a transpiler that takes ECMAscript 6 and turns it into ECMAscript 5. This enables the developers to use ES6 code in this project even though most browsers don't currently support this. The adoption of ES6 in web browsers seems inevitable, so using it today does not seem like much of a stretch. ES6 code is a little easier to read and write and has some significant improvements over ES5.

## React.js
The decision to work with React was the most difficult one. There are many libraries and frameworks out that that could be used to build the interface with. For this project a number of them were considered: Angular, Ember.js, jQuery, Riot.js Polymer and Backbone.js.

The need for some sort of abstraction layer is obvious. No modern web developer works directly with the DOM, simply because it there are too many browser differences to deal with and because it is an unweidly API. Important to this project would be that the library did not make too many assumptions about the environment it would be used in. The bookmarklet is no single page application and so it does not need any kind of routing. This puts Angular, Ember and Backbone at a disadvantage.

jQuery would be a great candidate because many sites the bookmarklet would be used on would already have it. But jQuery does not come with templating or any kind of component system, and it is generally not designed with an established way to do this in mind. So a unique architecture would have to be designed for the application. This makes it harder to pick up for new developers and would require much more extensive documentation.

This leaves Polymer, Riot and React as prime candidates. Riot is great for it's small size, but it does not have a big company behind it such as Polymer (Google) or React (Facebook). React is different from Polymer and Riot as it takes javascript and embeds HTML, where as Riot and Polymer instead take HTML and embed javascript. React has the advantage here as it is much easier to unit test and it works better in the setup of the project. Lastly what makes React stand out is that Facebook and Instagram use react in their flag ship products. This makes it more likely then any of the other technologies (with the possible exception of jQuery and Angular) that it will be actively maintained for the foreseeable future.

Though it's proponents do not acknowledge this disadvantage, injecting HTML into javascript does fly in the face of best practices that have been around for many years on the web. Using JSX resolves this partially as it makes React components at least reasonably useful to designers. The other disadvantage really has to be it's size. At 26k when minified and GZIPed, react is one of the smaller libraries that was considered, but it is still fairly large.

## RequireJS
RequireJS is a module loader by James Burke. It is used for client and server side dependency management. Important to a maintainable project is that dependencies are managed properly. Projects such as Angular come with their own dependency managers, but what it does not have is the capability to load these dependencies. For many projects this is not that important. Performance during development is not critical, and during the build step different resources can be concatenated into a single file, which ensures fast loading of dependencies.

For this bookmarklet things are a little different. Part of its requirements was that it would be modular and able to load plugins. This could in theory still be done through concatenation, but a bigger problem is that different pages may require different modules. This would mean concatenation would have to be done on each new request, and it would make caching impossible. Doing this would also mean that if in the future the need for dynamic module loading would be required, a module loader has to be implemented anyway.

RequireJS is well established as a module loader. It is flexible and has many features, including a server side version of it, which is useful to make the modules created for this project testable in Node directly, instead of using a web browser which would add an extra layer of complexity to the project.

## Compass/SCSS
Compass is a framework for writing CSS. It has a number of powerful features that help to keep CSS maintainable. It is fairly easy to learn for anyone familiar with CSS. Because the project already builds for development this is a quick win in terms of maintainability for the project

## Mocha / Should.js
To ensure longevity of the project unit testing is a definite must. Mocha is easy to learn and to use. It does not have much overhead and so it does not get in the way much. Should.js is the assertion library. There are many of its kind but what makes Should.js nice is that it is fairly easy to use and the syntax is easy to read.