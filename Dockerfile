FROM node:latest

# Create app directory
RUN mkdir -p /usr/docker/apps/angular/flex-layout
WORKDIR /usr/docker/apps/angular/flex-layout

# Copy node package to working directory
COPY package.json /usr/docker/apps/angular/flex-layout

# Install Node dependencies
RUN yarn install

COPY . /usr/docker/apps/angular/flex-layout

# Build the demo app with webPack
RUN ./node_modules/.bin/npm run start

# Expose live-server port
EXPOSE 8080

#CMD ./node_modules/.bin/live-server dist/
