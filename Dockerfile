FROM node:latest

# Create app directory
RUN  mkdir -p /ng2/flex-layout /home/nodejs && \
     groupadd -r nodejs && \
     useradd -r -g nodejs -d /home/nodejs -s /sbin/nologin nodejs && \
     chown -R nodejs:nodejs /home/nodejs

WORKDIR /ng2/flex-layout

# Copy node package to working directory
COPY package.json /ng2/flex-layout

# Install Node dependencies
RUN npm install -g yarn
RUN npm install -g live-server
RUN yarn

COPY . /ng2/flex-layout
RUN chown -R nodejs:nodejs /ng2/flex-layout
USER nodejs

# Build the demo app with webPack
CMD gulp build:components
CMD npm run deploy

# Expose live-server port
EXPOSE 8080

CMD live-server
