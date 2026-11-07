import test from 'node:test';
import assert from 'node:assert/strict';
import { startFreshDemo, demoSessionKeys } from './freshDemoReset';
import { CONNECTED_KEY, connectedView, freshConnected, freshPresentation, saveConnected, validConnected, commandConnected } from './connectedDemo';
import { freshSharedDemo } from './sharedDemo';

function memory(values: [string,string][] = []) {
 const data=new Map(values);
 return {data,getItem:(key:string)=>data.get(key)??null,setItem:(key:string,value:string)=>{data.set(key,value);},removeItem:(key:string)=>{data.delete(key);}};
}

test('clean presentation retains all roles and courses but no learner activity; old baselines still replay',()=>{
 const state=freshPresentation(),view=connectedView(state);
 assert.equal(validConnected(state),true);assert.equal(view.people.length,5);assert.equal(view.courses.length,8);
 assert.deepEqual(view.people.map(p=>p.role),['learner','learner','facilitator','facilitator','admin']);
 for(const key of ['enrolments','assignments','threads','requests','notices','referrals','events'] as const)assert.equal(view[key].length,0,key);
 assert.equal(connectedView(freshConnected()).enrolments.length,2);
 assert.equal(validConnected({...state,cleanStart:false}),false);
 assert.equal(validConnected({...state,legacy:freshSharedDemo()}),false);
 const result=commandConnected(state,{id:'new-learning',expectedVersion:0,actorId:'ada',type:'enrol',payload:{courseId:'digital-essentials'}});
 assert.equal(result.error,undefined);assert.equal(validConnected(JSON.parse(JSON.stringify(result.state))),true);assert.equal(connectedView(result.state).enrolments.length,1);
});

test('fresh start clears only named project stores and writes a verified clean baseline',()=>{
 const local=memory([[CONNECTED_KEY,JSON.stringify(freshConnected())],['unrelated-app','keep local']]);
 const session=memory([...demoSessionKeys.map(key=>[key,'old demo data'] as [string,string]),['unrelated-app','keep session']]);
 assert.deepEqual(startFreshDemo(local,session),{});
 const clean=JSON.parse(local.getItem(CONNECTED_KEY)!);assert.equal(validConnected(clean),true);assert.equal(clean.cleanStart,true);
 for(const key of demoSessionKeys)assert.equal(session.getItem(key),null);
 assert.equal(local.getItem('unrelated-app'),'keep local');assert.equal(session.getItem('unrelated-app'),'keep session');
});

test('failed reset rolls back the original connected store and all earlier records',()=>{
 const local=memory([[CONNECTED_KEY,'original connected bytes']]);
 const session=memory(demoSessionKeys.map(key=>[key,`original ${key}`]));
 const expectedLocal=[...local.data],expectedSession=[...session.data];
 const originalRemove=session.removeItem;let fail=true;
 session.removeItem=(key:string)=>{if(fail){fail=false;throw new Error('Transient storage failure');}originalRemove(key);};
 assert.match(startFreshDemo(local,session).error!,/Existing records are unchanged/);
 assert.deepEqual([...local.data],expectedLocal);assert.deepEqual([...session.data],expectedSession);
});

test('read denial prevents all mutations and incomplete recovery reports uncertainty',()=>{
 const local=memory([[CONNECTED_KEY,'keep']]),session=memory();
 assert.ok(startFreshDemo(local,{...session,getItem:()=>{throw new Error('Read blocked');}}).error);
 assert.equal(local.getItem(CONNECTED_KEY),'keep');
 local.setItem=()=>{throw new Error('Writes blocked');};
 assert.match(startFreshDemo(local,session).error!,/Some demo records may have changed/);
});

test('ordinary saves cannot silently change a stored seeded baseline into a clean one',()=>{
 const descriptor=Object.getOwnPropertyDescriptor(globalThis,'localStorage');
 const local=memory([[CONNECTED_KEY,JSON.stringify(freshConnected())]]);
 Object.defineProperty(globalThis,'localStorage',{configurable:true,value:local});
 try {assert.equal(saveConnected(freshPresentation()),false);assert.equal(JSON.parse(local.getItem(CONNECTED_KEY)!).cleanStart,undefined);}
 finally {if(descriptor)Object.defineProperty(globalThis,'localStorage',descriptor);else Reflect.deleteProperty(globalThis,'localStorage');}
});
