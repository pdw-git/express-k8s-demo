FROM node:12

ENV EXP_API_ENV_DEPLOYMENT docker-compose
ENV EXP_API_APP_DIR /usr/src/app
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
