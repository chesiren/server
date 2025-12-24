import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
console.log("Websocket opened on port 8080")

var connections = {};

wss.on('connection', function connection(ws, req)
{
    console.log('Client connected');
    console.log(req.headers);

    ws.id = req.headers['sec-websocket-key'];
    ws.io = req.headers['cc-io'];
    ws.key = req.headers['cc-key'];

    connections[ws.id] = ws;

    ws.on('message', function incoming(message)
    {
        if (ws.io == "input")
        {
            console.log(ws.id + ' : Received microphone data:', message);
 
            for (let id in connections)
            {
                if (connections[id] && connections[id].io == "output" && connections[id].key == ws.key)
                {
                    connections[id].send(message);
                }
            }
        }
    });

    ws.on('close', function close()
    {
        console.log('Client disconnected');
        //connections[ws.id] = null;
        delete connections[ws.id];
    });
});
