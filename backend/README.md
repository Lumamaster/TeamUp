## Getting Started
- Install required dependencies by running ```npm install```
- Create a db_config.json file in the root directory using db_config.EXAMPLE.json as a template
- Run the development server using ```npm run dev```
  - Alternatively, a version without hot-reloading can be run using ```npm start```


### Using the authentication middleware
This app uses JSON Web Tokens to authenticate users. Verifying tokens can be done using the middleware located at `[project root]/backend/verifyjwt.js`.
To use the middleware, simply require the file in your router and before creating any routes insert the line `router.use(verify)`, replacing 'verify' with the name of the variable you assigned the middleware. Any routes you in your router will now only be accessible by users that are logged in. The middleware also creates a token field in the `req` object, which has the following format:

    {
      id: string; the user's database id
      username: string; the user's chosen display name
    }
Database queries should be based on the user's id, since usernames can be duplicates. MongoDB uses ObjectId objects to store ids, so the query should look something like: `db.collection('users').find({ _id: mongo.ObjectId(req.token.id) })`
