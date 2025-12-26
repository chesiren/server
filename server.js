import { WebSocketServer } from 'ws';
import crypto from 'crypto';


const wss = new WebSocketServer({ port: 8080 });
console.log("Websocket opened on port 8080")

var connections = {};
var inputs = {};

wss.on('connection', function connection(ws, req)
{
    ws.id = crypto.randomUUID();
    ws.io = req.headers['cc-io'];
    ws.key = req.headers['cc-key'];

    connections[ws.id] = ws;

    console.log('Client connected:', ws.io, ws.key);

    if (ws.io === "input")
    {
        inputs[ws.key] = ws;
    }

    ws.on('message', function incoming(message)
    {
        if (ws.io === "input")
        {
            for (let id in connections)
            {
                const c = connections[id];
                if (c && c.io === "output" && c.key === ws.key)
                {
                    c.send(message);
                }
            }
        }
    });

    ws.on('close', function ()
    {
        console.log('Client disconnected:', ws.io, ws.key);

        delete connections[ws.id];

        if (inputs[ws.key] === ws)
        {
            delete inputs[ws.key];
        }
    });
});
