import test from 'node:test';
import assert from 'node:assert/strict';
import {passwordHash,passwordMatches,signSession,verifySession} from '../lib/admin-security.mjs';
const hash=passwordHash('test-only-password');
const secret='test-only-session-secret-at-least-32-characters';
test('password verification rejects incorrect and malformed input',()=>{
 assert.equal(passwordMatches('test-only-password',hash),true);
 for(const input of ['wrong',null,{},'x'.repeat(257)])assert.equal(passwordMatches(input,hash),false);
 assert.equal(passwordMatches('test-only-password','malformed'),false);
});
test('signed sessions expire and reject tampering or credential rotation',()=>{
 const now=Date.now(),token=signSession(secret,hash,now);
 assert.equal(verifySession(token,secret,hash,now),true);
 assert.equal(verifySession(token,secret,hash,now+8*60*60*1000),false);
 assert.equal(verifySession(token+'x',secret,hash,now),false);
 assert.equal(verifySession(token,secret+'changed',hash,now),false);
 assert.equal(verifySession(token,secret,passwordHash('replacement'),now),false);
 for(const input of [undefined,'x','a.b.c','x'.repeat(1001)])assert.equal(verifySession(input,secret,hash,now),false);
});
