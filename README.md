# express-api

## Express based API server

This is a simple API server built on Node.js and the Express framework. It has been created as an educational 
tool for use to explore development and deployment patterns. This is not production ready code. 

To install the application ensure you have npm and nodejs available on the target system. 

Run git clone against this repository to extract the code to a target directory.

There is a default configuration that is described in the file app_config/config.json.

Elements of this configuration can be over ridden by setting environment variable. The following lists those elements 
that can be altered:

>>PORT - the required ip port to use on the target server

>>NODE_ENV - can be either development or production and determines the levels of logging that will be delivered

>>LOGGING_LEVEL - can be error, warn, info, verbose, debug, silly

>>HTTPS = can be either true or false. If set to true then a key and certificate needs to be defined in the config.json file. 

Environment variables can be set in a .env file or directly by the user. What is in the .env file will over ride any
variables set directly by the user in the shell. Either use the .env file or set environment variables direction in the
shell. It is not recommended to use both mechanism. 

By default encryption is enabled through the configuration JSON file. The HTTPS environment
variable can be use to toggle between http and https. By default a private key and certificate will need to be provided. 

A keystore is defined in the configuration file and the a cert.pem and key.pem file need to be added there for the
application to work. 

For testing purposes a self signed cert and Key can be created using the following commands on a linux system. 

>openssl genrsa -out key.pem

>openssl req -new -key key.pem -out csr.pem

>openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem

>rm csr.pem

The default configuration is to use https with self signed certificates. This means that any browser or API testing tools 
need to disable certificate verification. Most tools will block access because the signing request was self created. This
is another reason why this code is not production ready. 

## Running the application with npm

From within the target directory run:
 
npm install 

to pull all the necessary dependencies and start the application.

run:

npm start

On success you will see the following on the console:

>>express-api@1.0.0 start _home directory_/WebstormProjects/express-api

>>node ./bin/www --debug

>>info: application logging level: debug {"timestamp":"2020-03-26T11:23:43.567Z"}

>>info: /home/whitep/WebstormProjects/express-api/bin/www-main : Application port: 3443 {"timestamp":"2020-03-26T11:23:43.718Z"}

>>info: /home/whitep/WebstormProjects/express-api/bin/www-undefined : Certificate provider: SELF SIGNED {"timestamp":"2020-03-26T11:23:43.730Z"}


NOTE: by default the application starts in debug mode and has verbose tracing enabled

Pointing a browser at https://localhost:3443 will show a basic home page. 

If you are not using encryption then point a browser at http://localhost:3000. 

The following RESTful APIs are provided for testing

>>GET api/info - returns information about the application

>>GET api/status - returns static status information

>>GET api/version - returns version information for the api

>>GET api/test - runs tests on the server and reports a result summary

There is some basic logging and error handling but this code is not suitable for production use. 

Tests for the API are included and can be executed by typing; 

npm test

in the installed source directory.

## Docker

A Dockerfile is provided to enable the creation of a container image for testing of docker and kubernetes 
deployment patterns.

docker build -t <user>/<image name> .

docker run -p 3443:3443 -d <user>/<image name> .
