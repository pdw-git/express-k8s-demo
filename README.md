# express-api

## Express based API server

NOT PRODUCTION READY CODE

This is a simple API server built on Node.js and the Express framework. It has been created as an educational 
tool for use to explore development and deployment patterns. This is not production ready code. 

To install the application ensure you have npm and nodejs available on the target system. 

Run git clone against this repository to extract the code to a target directory.

There is a default configuration that is described in the file app_config/config.json.

Elements of this configuration can be over ridden by setting environment variable. The following lists those elements 
that can be altered:

MANDATORY VARIABLES TO BE SET IN THE SHELL BEFORE TRYING TO DEPLOY OR IN THE DOCKER FILE BEFORE BUILDING

>>APP_DIR = root directory for the application

>>NODE_ENV_DEPLOYMENT = can be either npm, docker or docker-compose and determines the environment variable file that will
used.

ENVIRONMENT VARIABLES TO BE SET IN THE /environment/deployment/.env file where deployment is one of npm or docker-compose

A list of example environment variables is provided here. 

PORT=3443 : port to be exposed for the application 

MONGO_URI=mongodb://mongo: : location of the Mongo db - used for persistance

MONGO_PORT=27017 : port of the Mongo db

MONGO_DB_NAME=EXPRESS_API : Name of the collections for this application

LOGGING_LEVEL=debug : the required logging level for this application [err, warn, info, verbose, debug, silly ]

NODE_ENV_PRODUCTION=no : can be yes or no

HTTPS=yes : can be yes or no

APP_IP=localhost : IP address of the applicaiton

INDEX_ROUTE=/ : route of served HTML pages

API_ROUTE=/api : route of the api

USER_ROUTE=/users : route for users

API_VERSION=1.0.0 : api version string

CERT_PROVIDER=SELF_SIGNED : encryption certificate provider

KEY_STORE=/bin/keystore/ : certificate key store

APP_CERT=cert.pem : certificate

APP_KEY=key.pem : encryption key

Environment variables should be set in  a .env file.

By default encryption is NOT enabled. 

A keystore is defined in the configuration file and the a cert.pem and key.pem file need to be added there for the
application to work. 

For testing purposes a self signed cert and Key can be created using the following commands on a linux system. 

>openssl genrsa -out key.pem

>openssl req -new -key key.pem -out csr.pem

>openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem

>rm csr.pem

The default configuration is to no use https with self signed certificates. If slef signed certificates are used
this will mean that any browser or API testing tools need to disable certificate verification. Most tools will block 
access because the signing request was self created. 

## Running the application with npm

The default is to deploy this application with Docker compose but to run this with nodejs locally do the following. 

This application requires a mongo db, to enable the application to run successfully install Mongo locally:

login to docker-hub

docker pull mongo

docker run -d -p 27017: 27017 mongo 

From within the target directory run clone the git repository

Update the .env file with the appropriate environment variables

export APP_DIR=/folder/containing/application/source
export NODE_ENV_DEPLOYMENT=npm

Change MONGO_URI to mongo://ipa-ddress: as required for your system. 
Change MONGO_PORT as required for your system

npm install 

to pull all the necessary dependencies and start the application.

run:

npm start

On success you will see the following on the console:

>>/usr/local/bin/node /usr/local/lib/node_modules/npm/bin/npm-cli.js start

>> express-api@1.0.0 start /Users/whitep/Node/WebstormProjects/express-api
>> node ./bin/www --debug

>>info: application logging level: info {"timestamp":"2020-04-17T19:35:06.879Z"}

>>info: /Users/whitep/Node/WebstormProjects/express-api/app_api/models/db.js-connectToMongo : Connecting to: mongodb://localhost:27017/EXPRESS_API {"timestamp":"2020-04-17T19:35:06.904Z"}

>>info: /Users/whitep/Node/WebstormProjects/express-api/bin/www-main : Application port: 3000 Encrpytion: no {"timestamp":"2020-04-17T19:35:07.076Z"}

>>info: /Users/whitep/Node/WebstormProjects/express-api/app_api/models/db.js-mongoose.connection.on.connected : Create initial config in db {"timestamp":"2020-04-17T19:35:13.156Z"}

>>info: /Users/whitep/Node/WebstormProjects/express-api/app_api/models/mongoActions.js-createModel : Created Mongoose model: configuration {"timestamp":"2020-04-17T19:35:13.166Z"}

>>info: /Users/whitep/Node/WebstormProjects/express-api/app_api/models/db.js-connectToMongo : Connected to: mongodb://localhost:27017/EXPRESS_API {"timestamp":"2020-04-17T19:35:13.179Z"}



NOTE: by default the application starts in debug mode and has verbose tracing enabled

Pointing a browser at https://localhost:3443 will show a basic home page. 

If you are not using encryption then point a browser at http://localhost:3000. 

The following RESTful APIs are provided for testing

>>GET api/info - returns information about the application

>>GET api/status - returns the status of the data base connection

>>GET api/version - returns version information for the api

>>GET api/test - runs tests on the server and reports a result summary

>>GET /api/config - displays the configuration data that has been stored in the persistence lay

>>DELETE /api/config/:configid - deletes the config data in the persistence layer

>>POST /api/config - placeholder for updating the configuration information

There is some basic logging and error handling but this code is not suitable for production use. 

Tests for the API are included and can be executed by typing; 

npm test

in the installed source directory.


## Docker Compose

To make the dependency of installing and running Mongo easier there is a docker compose file that will build the required
images so they can be run using docker-compose

The composition is defined in docker-compose.yml

Ensure that docker-compose is installed and then run

docker-compose build

docker-compose up


## Kubernetes

There are yaml files to enable the deployment of the app and the supporting database in Kubernetes.

Assuming there is a kubernetes environment these two applications can be deployed into the default namespace using

>>kubectl apply -f kube

From the directory that contains kube. 

