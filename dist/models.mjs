export const checked='2026-10-01';
export const models=[
{id:'gpt-6-luna',name:'GPT-6 Luna',provider:'OpenAI',input:.10,output:.50,cached:.01,url:'https://developers.openai.com/api/docs/models/gpt-6-luna',note:'Base tier ≤272k input tokens. Cache writes $0.125/M excluded.'},
{id:'gpt-6.1-sol',name:'GPT-6.1 Sol',provider:'OpenAI',input:2,output:10,cached:.10,url:'https://developers.openai.com/api/docs/models/gpt-6.1-sol',note:'Base tier ≤272k input tokens. Cache writes $2.50/M excluded.'},
{id:'claude-haiku-4-5-20251001',name:'Claude Haiku 4.5',provider:'Anthropic',input:1,output:5,cached:.10,url:'https://platform.claude.com/docs/en/models/haiku-4-5/overview',note:'200k context. Cache writes $1.25/M (5min) or $2/M (1hr) excluded.'},
{id:'claude-sonnet-5-5',name:'Claude Sonnet 5.5',provider:'Anthropic',input:2,output:10,cached:.20,url:'https://platform.claude.com/docs/en/models/sonnet-5-5/overview',note:'1M context. Cache writes $2.50/M (5min) or $4/M (1hr) excluded.'},
{id:'gemini-3.5-flash-lite',name:'Gemini 3.5 Flash-Lite',provider:'Google',input:.30,output:2.50,cached:.03,url:'https://ai.google.dev/gemini-api/docs/pricing',note:'Explicit-cache storage $1/M tokens/hour excluded.'},
{id:'gemini-3.8-flash',name:'Gemini 3.8 Flash',provider:'Google',input:.75,output:3.75,cached:.075,url:'https://ai.google.dev/gemini-api/docs/pricing',note:'Promotional prices through Dec 31, 2026. From Jan 1, 2027: $1.50 input / $7.50 output / $0.15 cache read. Explicit-cache storage excluded.'}
];
