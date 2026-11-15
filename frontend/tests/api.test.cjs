const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function api(fetch) {
 const js=ts.transpileModule(fs.readFileSync('lib/api.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 const box={Error,exports:{},process:{env:{}},fetch,AbortController,setTimeout,clearTimeout};vm.createContext(box);vm.runInContext(js,box);return box.exports;
}
test('network failures never become invented results', async()=> {
 const a=api(async()=>{throw Error('offline');});
 for (const call of [()=>a.fetchCandidates(),()=>a.fetchAnalogs(),()=>a.matchAnalogsForSite('x'),()=>a.runMCDA({}),()=>a.runMissionSimulation({}),()=>a.fetchAIExplanation('x')]) await assert.rejects(call,/offline/);
});
test('HTTP validation errors propagate',async()=> {
 const a=api(async()=>({ok:false,status:422,json:async()=>({detail:[]})}));
 await assert.rejects(()=>a.runMissionSimulation({}),/422/);
});
test('server results are returned unchanged and parameters sent exactly',async()=> {
 let sent;
 const result={mission_viability_score:34,status:'CRITICAL'};
 const a=api(async(url,options)=>{sent={url,options};return {ok:true,json:async()=>result};});
 assert.equal(await a.runMissionSimulation({site_id:'test',crew_size:4}),result);
 assert.equal(sent.url,'/api/backend/simulator/run');
 assert.equal(JSON.parse(sent.options.body).crew_size,4);
});
test('identifiers are encoded and body filter preserved',async()=> {
 const urls=[];const a=api(async(url)=>{urls.push(url);return {ok:true,json:async()=>[]};});
 await a.matchAnalogsForSite('a/b?x');await a.fetchCandidates('Mars');
 assert.equal(urls[0],'/api/backend/analogs/match/a%2Fb%3Fx');assert.equal(urls[1],'/api/backend/candidates?body=Mars');
});
test('a successful request cannot hide a prior calculation failure',async()=> {
 let fail=true;const a=api(async()=>{if(fail)throw Error('offline');return {ok:true,json:async()=>[]};});
 await assert.rejects(()=>a.fetchCandidates());fail=false;await a.fetchCandidates();
 assert.equal(a.lastApiError,'offline');a.clearApiError();assert.equal(a.lastApiError,'');
});
