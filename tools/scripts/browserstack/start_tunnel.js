'use strict';
/**
 * Start the BrowserStack tunnel. Once its started it creates a file so the callee can wait
 * for the tunnel to be started.
 */

var fs = require('fs');
var http = require('http');
var BrowserStackTunnel = require('browserstacktunnel-wrapper');

var HOSTNAME = 'localhost';
var PORTS = [9876, 9877];
var ACCESS_KEY = process.env.BROWSER_STACK_ACCESS_KEY;
var READY_FILE = process.env.BROWSER_PROVIDER_READY_FILE;
var TUNNEL_IDENTIFIER = process.env.TRAVIS_JOB_ID;

// We need to start fake servers, otherwise the tunnel does not start.
var fakeServers = [];
var hosts = [];

PORTS.forEach(function(port) {
  fakeServers.push(http.createServer(function() {}).listen(port));
  hosts.push({
    name: HOSTNAME,
    port: port,
    sslFlag: 0
  });
});

var tunnel = new BrowserStackTunnel({
  key: ACCESS_KEY,
  localIdentifier: TUNNEL_IDENTIFIER,
  hosts: hosts
});

console.log('Starting tunnel on ports', PORTS.join(', '));

// Emit a `newer_available` event to force an update of the Browserstack binaries (necessary due to Travis caching)
// This also starts a new tunnel after the latest binaries are available.
tunnel.emit('newer_available');

tunnel.once('started', function(error) {
  if (error) {
    console.error('Can not establish the tunnel', error);
  } else {
    console.log('Tunnel established.');
    fakeServers.forEach(function(server) {
      server.close();
    });

    if (READY_FILE) {
      fs.writeFile(READY_FILE, process.pid);
    }
  }
});

tunnel.on('error', function(error) {
  console.error(error);
});
