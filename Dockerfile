FROM node:argon

RUN mkdir -p /app
RUN mkdir -p /app/app

# Create app directory
WORKDIR /app

RUN npm install browserify -g

# Install app dependencies
COPY package.json /app/
RUN npm install


COPY app/package.json /app/app/package.json
WORKDIR /app/app

RUN npm install


COPY . /app/

RUN [ "./bin/build.sh" ]

WORKDIR /app

RUN ls -la

#RUN chown -R node /app
# RUN node_modules/grunt-cli/bin/grunt build
# COPY dataporten-resources/fonts bower_components/uninett-bootstrap-theme/fonts

EXPOSE 8080
CMD [ "npm", "start" ]
