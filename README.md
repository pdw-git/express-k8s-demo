# express-api

## Express based API server

This is a simple API server built on Node.js and the Express framework. It has been created as an educational 
tool for use to explore development and deployment patterns. This is not production ready code. 

To install the application ensure you have npm and nodejs available on the target system. 

Run git clone against this repository to extract the code to a target directory.

## Running the application with npm

From within the target directory run:
 
npm install 

to pull all the necessary dependencies and start the application.

On success you will see the following on the console:

>> express-api@1.0.0 start _home directory_/WebstormProjects/express-api

>>node ./bin/www --debug

>>info: application logging level: debug {"timestamp":"2020-03-09T17:12:52.646Z"}

NOTE: by default the application starts in debug mode and has verbose tracing enabled

Pointing a browser at http://localhost:3000 will show a basic home page

The following RESTful APIs are provided for testing

>>GET api/info - returns information about the application

>>GET api/status - returns static status information

There is some basic logging and error handling but this code is not suitable for production use. 

Tests for the API are included and can be executed by typing; 

npm test

in the installed source directory

## Docker

A Dockerfile is provided to enable the creation of a container image for testing of docker and kubernetes 
deployment patterns
