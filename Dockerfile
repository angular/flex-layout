FROM node:latest

# Create app directory
RUN mkdir -p /usr/docker/apps/layout
WORKDIR /usr/docker/apps/layout

# Copy node package to working directory
COPY package.json /usr/docker/apps/layout

# Install Node dependencies
RUN npm install --loglevel warn

COPY . /usr/docker/apps/layout

# Build the demo app with webPack
RUN ./node_modules/.bin/npm run start

# Expose live-server port
EXPOSE 8080

#CMD ./node_modules/.bin/live-server dist/
