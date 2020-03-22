FROM node:12

ENV PORT 3000
ENV NODE_ENV developemnt
ENV LOGGING_LEVEL debug

# Create app directory
WORKDIR /usr/src/app

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
