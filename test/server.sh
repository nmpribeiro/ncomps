#!/usr/bin/python

import sys
import SimpleHTTPServer
import SocketServer

PORT = int(8000)
if len(sys.argv) > 1:
    PORT = int(sys.argv[1])

print 'PORT: ', PORT;

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
Handler.extensions_map.update({
    '.webapp': 'application/x-web-app-manifest+json',
});

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "Serving at port", PORT
httpd.serve_forever()
