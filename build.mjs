import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const publicFiles=['index.html','style.css','app.mjs','calc.mjs','models.mjs','workflows.mjs','infrastructure.mjs','favicon.svg'];
const mime={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',mjs:'text/javascript; charset=utf-8',svg:'image/svg+xml'};
const assets=Object.fromEntries(publicFiles.map(f=>['/'+f,{body:readFileSync('dist/'+f,'utf8'),type:mime[f.split('.').at(-1)]}]));
const modules=['dist/calc.mjs','dist/models.mjs','dist/workflows.mjs','dist/infrastructure.mjs','src/mcp.mjs','src/auth.mjs'].map(f=>readFileSync(f,'utf8').replace(/^import .*;\n/gm,'').replace(/export /g,''));
mkdirSync('dist/server',{recursive:true});
writeFileSync('dist/server/index.js',modules.join('\n')+'\nconst ASSETS='+JSON.stringify(assets)+';\nexport default {async fetch(request,env={}){const path=new URL(request.url).pathname;if(path==="/mcp")return handleMcp(request,{authenticated:await authenticate(request,env.AI_COST_LAB_MCP_TOKEN)});if(!["GET","HEAD"].includes(request.method))return new Response("Method not allowed",{status:405});const asset=ASSETS[path==="/"?"/index.html":path];if(!asset)return new Response("Not found",{status:404});return new Response(request.method==="HEAD"?null:asset.body,{headers:{"content-type":asset.type,"cache-control":"private, no-cache","x-content-type-options":"nosniff"}});}};\n');
