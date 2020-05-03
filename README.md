# express-api

## Express based API server V1.0

NOT PRODUCTION READY CODE

This is a simple API server built on Node.js and the Express framework. It has been created as an educational 
tool for use to explore development and deployment patterns. **_This is not production ready code_**. 

To install the application ensure you have npm and nodejs available on the target system. 

Run git clone against this repository to extract the code to a target directory.

There is a default configuration that is described in the file environment/npm/.env.

Elements of this configuration can be over-ridden by the setting environment variables. The following lists those elements 
that can be altered:

MANDATORY VARIABLES TO BE SET IN THE SHELL BEFORE TRYING TO DEPLOY OR IN THE DOCKER FILE BEFORE BUILDING A DOCKER CONTAINER
OR IN THE KUBERNETES YAML FILE BEFORE DEPLOYING. 

The application has a api layer, a persistance layer and a messaging layer. The applicaiton has a basic configuration 
which is maintained in the persistence layer. Any changes to the configuration and communicated to the API layer. There
could be multiple instances of the API deployed and a pub/sub mechanism has been employed to enable communication between 
the various API instances. This feature can be demonstrated to show that changing the configuraiton through one instance
of the API will alter the behaviour of all instances of the API. 

>>EXP_API_APP_DIR = root directory for the application

>>EXP_API_ENV_DEPLOYMENT = can be either npm, docker or docker-compose and determines the environment variable file that will
used.

ENVIRONMENT VARIABLES TO BE SET IN THE /environment/deployment/.env file where deployment is one of npm, docker, or docker-compose

A list of example environment variables is provided here. 

EXP_API_PORT=3000 : port to be exposed for the application 

EXP_API_MONGO_URI=mongodb://mongo:27017 : location of the Mongo db - used for persistance

EXP_API_MONGO_DB_NAME=EXPRESS_API : Name of the collections for this application

EXP_API_LOGGING_LEVEL=debug : the required logging level for this application [err, warn, info, verbose, debug, silly ]

EXP_API_NODE_ENV_PRODUCTION=no : can be yes or no

EXP_API_HTTPS=yes : can be yes or no

EXP_API_APP_IP=localhost : IP address of the applicaiton

EXP_API_INDEX_ROUTE=/ : route of served HTML pages

EXP_API_API_ROUTE=/api : route of the api

EXP_API_USER_ROUTE=/users : route for users

EXP_API_API_VERSION=1.0.0 : api version string

EXP_API_CERT_PROVIDER=SELF_SIGNED : encryption certificate provider

EXP_API_KEY_STORE=/bin/keystore/ : certificate key store

EXP_API_APP_CERT=cert.pem : certificate

EXP_API_APP_KEY=key.pem : encryption key

Environment variables should be set in  a .env file, the docker file or in the docker-compose file or the kubernetes
yaml deployment file. 

By default encryption is NOT enabled. 

A keystore is defined in the configuration file and the a cert.pem and key.pem file need to be added there for the
application to work. 

For testing purposes a self signed cert and Key can be created using the following commands on a linux system. 

>openssl genrsa -out key.pem

>openssl req -new -key key.pem -out csr.pem

>openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem

>rm csr.pem

The default configuration is not to use encryption. However self signed certificates can be used to explore deployment
and use of apps secured by keys and certificates. If slef signed certificates are used
this will mean that any browser or API testing tools need to disable certificate verification. Most tools will block 
access because the signing request was self created. 

## Running the application with npm

The default is to deploy this application with docker-compose but to run this with nodejs locally do the following. 

This application requires a mongo db, and an amqp message bus to enable the application to run successfully install 
Mongo and ibmcom/mqlight locally:

login to docker-hub

docker pull mongo
docker pull ibmcom/mqlight

docker run -d -p 27017: 27017 mongo 
 docker run --env LICENSE=accept -p 5672:5672 -p 9180:9180 ibmcom/mqlight

From within the target directory run clone the git repository

Update the .env file with the appropriate environment variables

export EXP_API_APP_DIR=/folder/containing/application/source
export EXP_API_ENV_DEPLOYMENT=npm

Change EXP_API_MONGO_URI to mongo://ip-address:port as required for your system. 
Change EXP_API_AMQP_URI to ampq://ip-address:port

npm install 

to pull all the necessary dependencies and start the application.

run:

npm start

On success you will see the following on the console:

> express-api@1.0.0 start /Users/whitep/Node/WebstormProjects/express-ap

> node ./bin/www


>info: /Users/whitep/Node/WebstormProjects/express-api/app_api/models/db.js-connectToMongo : Connecting to: mongodb://localhost:27017/EXPRESS_API 

>info: /Users/whitep/Node/WebstormProjects/express-api/app.js-undefined : Deployment method: npm 

>info: /Users/whitep/Node/WebstormProjects/express-api/bin/www.js-main : Application port: 3000 Encrpytion: no

>info: /Users/whitep/Node/WebstormProjects/express-api/app_api/models/db.js-mongoose.connection.on.connected : Create initial config in db 

>info: /Users/whitep/Node/WebstormProjects/express-api/app_api/models/mongoActions.js-createModel : Created Mongoose model: configuration
 
> info: /Users/whitep/Node/WebstormProjects/express-api/app_api/models/db.js-connectToMongo : Connected to: mongodb://localhost:27017/EXPRESS_API 

> info: /Users/whitep/Node/WebstormProjects/express-api/app_utilities/messaging/messageQ.js-createClient : mqlight sendClient created
 
> info: /Users/whitep/Node/WebstormProjects/express-api/app_api/models/configDB/configDB_Actions.js-createConfig : configuration 5eadb0e946d9a8eb4a4ffd72 

> info: /Users/whitep/Node/WebstormProjects/express-api/app_utilities/messaging/messageQ.js-createClient : mqlight recvClient created 

> info: /Users/whitep/Node/WebstormProjects/express-api/app_utilities/messaging/messageQ.js-sendClient.send : mqlight: sent: mqlight started to topic: config/change 

> info: /Users/whitep/Node/WebstormProjects/express-api/app_utilities/messaging/messageQ.js-recvClient.subscribe : mqlight: subscribed to: config/change 

> info: /Users/whitep/Node/WebstormProjects/express-api/app_api/controllers/configApi.js-recvClient.on.message : emitting changed event: mqlight: recieved:  - mqlight started - 
 
> info: /Users/whitep/Node/WebstormProjects/express-api/app_utilities/messaging/messageQ.js-recvClient.on.message : mqlight: recieved: - mqlight started - 

> info: /Users/whitep/Node/WebstormProjects/express-api/app_api/controllers/configApi.js-getConfig : HTTP response sent with status: 200 

NOTE: by default the application starts with loggingLevel set to info mode;

If the applicaiton is not installed with a database it will wait for up to 50 minutes before terminating. If a database
is found during that time it will be connected and a configuration object will be created or updated as necessary.
While there is no database the following API calls will work. 

>>GET api/version
>
>>GET api/info
>
>>GET api/status
>
None of these API calls rely on there being a database. Any API call that requires access to the configuration 
database object will fail with a message stating that the database is not connected. The applciation also presents
two web pages, a basic index page and a basic about page. Pointing a browser at:

>>http//host-ip-address:port 

Will provide access to the applications home page. The about page can be accessed from there. This gives another
indication that the application is working. All logs can be found in the conbined.log file in the home directory of
the application. Errors can be found in the error.log of the application.  

If you are using encryption then use a port such as 3443. 

The following RESTful APIs are provided for testing

>>GET api/info - returns information about the application

>>GET api/status - returns the status of the data base connection

>>GET api/version - returns version information for the api

>>GET api/test - runs tests on the server and reports a result summary

>>GET /api/config - displays the configuration data that has been stored in the persistence lay

>>DELETE /api/config/:configid - deletes the configDB_Actions data in the persistence layer

>>POST /api/config/:configid - updates the configuration data with the updates sent as a JSON object in the request body

There is some basic logging and error handling but this code is not suitable for production use. 

Tests for the API are included and can be executed by typing; 

npm test

in the installed source directory.


## Docker Compose

To make the dependency of installing and running Mongo easier there is a docker-compose.yml file that will build the required
images so they can be run using docker-compose

Ensure that docker-compose is installed and then run

docker-compose build

docker-compose up


## Kubernetes

There are yaml files to enable the deployment of the app and the supporting database in Kubernetes.

Assuming there is a kubernetes environment these two applications can be deployed into the default namespace using

>>kubectl apply -f kube

From the directory that contains kube. The YAML file will create a name space called express create a replication set 
with 2 instances of the application, a service so that the application can be accessed and an instance of mongo in 
a persistant volume. 

## appTest.js

There is an application that will send a stream of client requests to the API server. 

node appTest.js <delay (ms)> <ip address> <API call>

e.g node appTest.js 0 127.0.0.1:3000 test

This will continually run get http://127.0.0.1:3000/api/test without any delay between API calls. A simple report is 
logged to stdout. 

The test will work with any of the GET calls to the API. It does not support POST/UPDATE/DELETE operations. api/test
exercises all the API calls available in the application. 


