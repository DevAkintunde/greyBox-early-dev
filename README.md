# greyBox Library (Early Dev)
Early implementation of the greyBox; a private library used in developing full stack app, powered with Vite (React) and KoaJS as backend server.

- Frontend Vite ReactJS
- backend KoaJS
- Develeopment: Vite development server using vite's createServer module
- Libraries are available in package.json in root document.
- Entry point for the app is server.js, available package script as 'dev': RUN "npm run  dev"
- Configs are mostly import from environment variable. sample is available in .env.sample.
- tailwindCss is used in styling.
- server configurations in .env.sample is used for image (media) uploads. Make sure the paths are available if testing/using the mediaUpload implementation. Rename .env.sample to .env to use.
- there is also a custom embedded library named: jsStyler. It basically is a custom implementation of JavaScript power CSS manipulations/animations. A variable of this is used in a few other of my repo. Still in early development though, but hopefully I can make that public once in a good place.
- remoteAppIDs is simply used to control app access to the database. This has since been refined
- Worthy mention, Postgresql has been used in 90% of my project. This is no exception. Make sure to setup a postres database and set database profile as appropriate in .env
- Visit https://vitejs.dev/ if not familiar with Vite
- Visit https://koajs.com/ if not familiar with KoaJS

This version has since been archived and development continues in a private repos.
