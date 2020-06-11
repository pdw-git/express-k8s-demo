# express-k8s-demo

## express-k8s-demo

NOT PRODUCTION READY CODE

This is a simple API server built on Node.js and the Express framework. It has been created as an educational 
tool for use to explore development and deployment patterns. **_This is not production ready code_**. 

The application being deployed comes from the pdw-git/express-api repository. This project is expressed as the Docker
container boselane6633/expres-api-app on dockerhub.com.

The application has an API layer, a persistance layer and a messaging layer. The applicaiton has a basic configuration
which is maintained in the persistence layer. Any changes to the configuration are communicated to the API layer. There
could be multiple instances of the API deployed and a pub/sub mechanism has been employed to enable communication between 
the various API instances. This feature can be demonstrated to show that changing the configuraiton through one instance
of the API will alter the behaviour of all instances of the API. 

Environment variables that can be set in the k8s yaml deployment file for the application. 

A list of example environment variables is provided here. 

>>EXP_API_PORT=3000 : port to be exposed for the application 

>>EXP_API_MONGO_URI=mongodb://mongo:27017 : location of the Mongo db - used for persistance

>>EXP_API_MONGO_DB_NAME=EXPRESS_API : Name of the collections for this application

>>EXP_API_LOGGING_LEVEL=debug : the required logging level for this application [err, warn, info, verbose, debug, silly ]

>>EXP_API_NODE_ENV_PRODUCTION=no : can be yes or no

>>EXP_API_HTTPS=mo : can be yes or no

>>EXP_API_APP_IP=localhost : IP address of the applicaiton

>>EXP_API_INDEX_ROUTE=/ : route of served HTML pages

>>EXP_API_API_ROUTE=/api : route of the api

>>EXP_API_USER_ROUTE=/users : route for users

>>EXP_API_API_VERSION=1.0.0 : api version string

>>EXP_API_CERT_PROVIDER=SELF_SIGNED : encryption certificate provider

>>EXP_API_KEY_STORE=/bin/keystore/ : certificate key store

>>EXP_API_APP_CERT=cert.pem : certificate

>>EXP_API_APP_KEY=key.pem : encryption key

>>EXP_API_APP_EXTERNAL_ERROR : api address of applicaiton that will take a message in the form of 
>>{msg: string, row: 0 or 1, col: 0 or 1, scroll: true or false, delay: integer [number of ms to display the message]}

By default encryption is disabled. 


## Kubernetes

There is a yaml file to enable the deployment of the app and the supporting containers in Kubernetes.

Assuming there is a kubernetes environment the application can be deployed into a a new namespace using the following command
run from the directory that contains kube. 

>>kubectl apply -f kubernetes/express.yaml

The YAML file will create a name space called express create a replication set with:

>> a namespace called express

>> in that namespace

>>> a PersistantVolumeClaim for mongo

>>> a mongo service

>>> a mongo deployment

>>> a mqlight service accessible from outside the cluster

>>> an express-api-app service accessile from oustside the cluser with a replica set of 2

>>> an express-api-app deployment

NOTE: This yaml file sets up a application that has no encryption enabled and makes the mqlight http server available. 

To test there needs to be a kubernetes cluster. One that is easily attainable and simple to use is minikube:

>>minikube start --driver=virtualbox

>>kubectl apply -f kubernetes/express.yaml 

>>kubectl describe services -n express mqlight - gets information about the mqlight service

>>kubectl describe services -n express expres-api - gets inforamtion about the express-api service

Minikube will set up a proxy to the cluster and describe the IP address that can be used to access the applicaiton

>>minikube service -n express express-api

This command will try to start the application. This will fail for the defauly yaml settings becuase it uses http not https. 

## appTest.js

There is an application that will send a stream of client requests that can be pointed at the service proxy. 

node appTest.js [delay (ms)] [ip address] [API call] [ignore tests already running errors]

>e.g node appTest.js 0 127.0.0.1:3000 test true

This will continually run get http://127.0.0.1:3000/api/test without any delay between API calls. A simple report is 
logged to stdout. 

API Call can be one of:

>>info 

>>config

>>status

>>test

>>random

Using random will cause the application to randomly choose which of the API calls to send to the application.

When using GET test it can take between 700 and 1200 ms to complete. If running multiple appTest.js it is possible that 
API calls  will fail with a status code of 500 and a message stating that a test is already running. Due to the very 
high volumes of these messages it is possible to disable this particular response. Setting 
[ignore tests already running error] true these errors will not be logged to the console. 

The test will work with any of the GET calls to the API. It does not support POST/UPDATE/DELETE operations. api/test
exercises all the API calls available in the application.

## docker-compose

In case there is no access to a kubernetes cluster there is a docker-compose file that can be used to validate the application 
is working. The following mandatory environment varidable needs to be set. 

>>DKR_MQLIGHT_DIR=[directory of a shared volume for the mqlight service]

To run the applicaiton use:

>>docker-compose-up


