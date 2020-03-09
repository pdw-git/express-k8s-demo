# express-api
Express based API server

This is a simple API server built on Node.js and the Express framework. It has been created as an educational tool for use to explore development and deployment patterns. 

To install the application ensure you have npm and nodejs available on the target system. Execute a git clone this repository to your own target directory. From within the target director run npm install to pull all the necessary dependencies. 

Once the code is installed run npm start which will initiate the application. On success you will see the following on the console:

>> express-api@1.0.0 start /home/whitep/WebstormProjects/express-api

>>node ./bin/www --debug

>>info: application logging level: debug {"timestamp":"2020-03-09T17:12:52.646Z"}

NOTE: by default the applciation starts in debug mode and has verbose tracing enbaled

Pointing a browser at http://<localhost>:3000 will show a basic home page

The following RESTful APIs are provided for testing

>>GET api/info - returns infomation about the application

>>GET api/status - returns static status information

There is some baisc logging and error handling but this code is not suitable for production use. 
