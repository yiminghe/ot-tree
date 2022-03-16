import sharedb from 'sharedb/lib/client';
import { type } from 'ot-tree';
import ReconnectingWebSocket from 'reconnecting-websocket';

sharedb.types.register(type as any);

// Open WebSocket connection to ShareDB server
var socket: any = new ReconnectingWebSocket(
  'ws://' + window.location.host.replace(':3000', ':8080'),
);
var connection = new sharedb.Connection(socket);

// Create local Doc instance mapped to 'examples' collection document with id 'counter'
export var doc = connection.get('examples', 'tree');
