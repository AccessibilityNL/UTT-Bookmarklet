= Modules, Components, Utilities =

The UTT Bookmarklet is made up of three components,
the bookmarklet launcher, the bookmarklet, and the 
UTT main module:

- Bookmaerklet launcher: `bookmarklet/*`
- Bookmarklet: `bookmarklet.js`
- UTT Main module: `lib/main.js`

The UTT Main module uses three types of scripts:
- Modules: These are given a tab within the UTT panel.
  These are part of the `lib/modules` folder and function
  as the controllers for the application.
- Components: These React components and are the views of
  the application.
- utilities: These are helper functions and stores for communicaiotn
