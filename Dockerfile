FROM node:12

ENV EXP_API_ENV_DEPLOYMENT docker
ENV EXP_API_APP_DIR /usr/src/app
ENV EXP_API_PORT=3000
ENV EXP_API_MONGO_URI=mongodb://mongo:27017/
ENV EXP_API_MONGO_DB_NAME=EXPRESS_API
ENV EXP_API_LOGGING_LEVEL=info
ENV EXP_API_NODE_ENV_PRODUCTION=yes
ENV EXP_API_HTTPS=no
ENV EXP_API_APP_IP=localhost
ENV EXP_API_INDEX_ROUTE=/
ENV EXP_API_API_ROUTE=/api
ENV EXP_API_USER_ROUTE=/users
ENV EXP_API_API_VERSION=1.1.0
ENV EXP_API_CERT_PROVIDER=SELF_SIGNED
ENV EXP_API_KEY_STORE=/bin/keystore/
ENV EXP_API_APP_CERT=cert.pem
ENV EXP_API_APP_KEY=key.pem

# Create app directory
WORKDIR $EXP_API_APP_DIR

# Install app dependencies
# A wildcard is used to ensure both package.json.old AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
#RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE $PORT
CMD [ "npm", "start" ]
