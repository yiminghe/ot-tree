import http from 'http';
import express from 'express';
import ShareDB from 'sharedb';
import WS from 'ws';
// @ts-ignore
import WebSocketJSONStream from '@teamwork/websocket-json-stream';
import * as tree from 'ot-tree';

ShareDB.types.register(tree.type as any);
const backend = new ShareDB();
createDoc(startServer);

// Create initial document then fire callback
function createDoc(callback: any) {
  const connection = backend.connect();
  const doc = connection.get('examples', 'tree');
  doc.fetch(function (err: any) {
    if (err) throw err;
    if (doc.type === null) {
      doc.create(
        [
          {
            data: { name: 'root' },
            children: [],
          },
        ],
        'tree' as any,
        callback,
      );
      return;
    }
    callback();
  });
}

function startServer() {
  // Create a web server to serve files and listen to WebSocket connections
  const app = express();
  const server = http.createServer(app);

  // Connect any incoming WebSocket connection to ShareDB
  const wss = new WS.Server({ server: server });
  wss.on('connection', function (ws) {
    const stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  server.listen(8080);
  console.log('Listening on http://localhost:8080');
}

export {};
