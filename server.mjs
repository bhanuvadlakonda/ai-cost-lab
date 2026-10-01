import {createServer} from 'node:http';
import {Readable} from 'node:stream';
import worker from './dist/server/index.js';
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
// Website is public; MCP calls require AI_COST_LAB_MCP_TOKEN even on localhost.
// Do not log headers, bodies, tokens or numeric assumptions.
createServer(async (incoming, outgoing) => {
  try {
    const request = new Request(new URL(incoming.url, 'http://localhost'), {
      method: incoming.method, headers: incoming.headers,
      ...(!['GET','HEAD'].includes(incoming.method) ? {body:Readable.toWeb(incoming),duplex:'half'} : {})
    });
    const response = await worker.fetch(request, {AI_COST_LAB_MCP_TOKEN:process.env.AI_COST_LAB_MCP_TOKEN});
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    if (response.body) Readable.fromWeb(response.body).pipe(outgoing); else outgoing.end();
  } catch { outgoing.writeHead(500); outgoing.end('Internal server error'); }
}).listen(port, host, () => console.log(`AI Cost Lab listening on ${host}:${port}`));
