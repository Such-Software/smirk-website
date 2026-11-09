import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDesktopRelease, fetchDesktopRelease, OFFICIAL_RELEASES, LATEST_RELEASE_API, RELEASE_METADATA_MAX_BYTES } from '../src/lib/desktop-releases.ts';
import { suggestDesktopPlatform } from '../src/lib/desktop-platform.ts';

const names = ['Smirk-Wallet-0.3.1.dmg', 'Smirk.Wallet_0.3.1_amd64.AppImage', 'Smirk.Wallet_0.3.1_x64-setup.exe'];
function release() { return { draft: false, prerelease: false, tag_name: 'v0.3.1', html_url: `${OFFICIAL_RELEASES}/tag/v0.3.1`, published_at: '2026-01-01T00:00:00Z', assets: names.map(name => ({name, state:'uploaded', size:1234, browser_download_url:`${OFFICIAL_RELEASES}/download/v0.3.1/${name}`})) }; }
function response(value) { return new Response(JSON.stringify(value), {headers:{'content-type':'application/json'}}); }

test('published official installers retain exact URLs and never invent a newer version', () => {
  const result = parseDesktopRelease(release());
  assert.equal(result.version, '0.3.1');
  assert.equal(result.downloads.macos, release().assets[0].browser_download_url);
  assert.equal(result.downloads.linux, release().assets[1].browser_download_url);
  assert.equal(result.downloads.windows, release().assets[2].browser_download_url);
});
test('draft, prerelease, foreign repository, malformed tags and missing publication refuse', () => {
  for (const patch of [{draft:true},{prerelease:true},{tag_name:'v0.3.2-rc1'},{html_url:'https://github.com/foreign/repo/releases/tag/v0.3.1'},{published_at:null}]) assert.equal(parseDesktopRelease({...release(),...patch}), null);
});
test('missing and ambiguous assets fall back per platform; unsigned archives are never installers', () => {
  const value=release(); value.assets.push({...value.assets[0]});
  assert.equal(parseDesktopRelease(value).downloads.macos, null);
  assert.ok(parseDesktopRelease(value).downloads.windows);
  value.assets = [{name:'Smirk-Wallet-0.3.1-unsigned.dmg',state:'uploaded',size:1234,browser_download_url:`${OFFICIAL_RELEASES}/download/v0.3.1/Smirk-Wallet-0.3.1-unsigned.dmg`}, {name:'macos.zip',state:'uploaded',size:1234,browser_download_url:`${OFFICIAL_RELEASES}/download/v0.3.1/macos.zip`}];
  assert.deepEqual(parseDesktopRelease(value).downloads, {macos:null,windows:null,linux:null});
});
test('asset redirects, queries, other versions, foreign hosts, missing upload and invalid sizes refuse', () => {
  for(const patch of [{browser_download_url:'https://example.com/download.dmg'},{browser_download_url:release().assets[0].browser_download_url+'?token=x'},{browser_download_url:release().assets[0].browser_download_url.replace('/v0.3.1/','/v0.3.2/')},{state:'new'},{size:0},{size:1.2}]) {
    const value=release();Object.assign(value.assets[0],patch);assert.equal(parseDesktopRelease(value).downloads.macos,null);
  }
});
test('metadata request is fixed, unauthenticated, bounded and does not forward visitor fields', async () => {
  const result=await fetchDesktopRelease(async (url,options) => {
    assert.equal(url,LATEST_RELEASE_API); assert.equal(options.method,'GET');assert.equal(options.redirect,'error');assert.equal(options.cache,'no-store');assert.ok(options.signal instanceof AbortSignal);
    assert.equal(options.headers.Authorization,undefined);assert.equal(options.headers.Cookie,undefined);assert.equal(options.headers['User-Agent'],'Smirk-Website-Downloads');
    return response(release());
  });assert.equal(result.version,'0.3.1');
});
test('network, rate limit, malformed JSON and oversized declared bodies return unavailable', async () => {
  for (const fetcher of [async()=>{throw Error('offline')},async()=>new Response('',{status:429}),async()=>new Response('{',{headers:{'content-type':'application/json'}}),async()=>new Response('{}',{headers:{'content-type':'application/json','content-length':String(RELEASE_METADATA_MAX_BYTES+1)}})]) assert.equal(await fetchDesktopRelease(fetcher),null);
});
test('streaming size ceiling cancels an oversized body without trusting Content-Length', async () => {
  let canceled=false;
  const body=new ReadableStream({pull(controller){controller.enqueue(new Uint8Array(64*1024));},cancel(){canceled=true;}});
  assert.equal(await fetchDesktopRelease(async()=>new Response(body,{headers:{'content-type':'application/json'}})),null);
  assert.equal(canceled,true);
});
test('OS suggestion is local and mobile or unknown never assumes a desktop platform', () => {
  assert.equal(suggestDesktopPlatform('MacIntel','desktop'), 'macos');assert.equal(suggestDesktopPlatform('Win32','desktop'),'windows');assert.equal(suggestDesktopPlatform('Linux x86_64','desktop'),'linux');
  assert.equal(suggestDesktopPlatform('Linux arm','Android'),'mobile');assert.equal(suggestDesktopPlatform('MacIntel','iPad',5),'mobile');assert.equal(suggestDesktopPlatform('MacIntel','Safari',5),'mobile');assert.equal(suggestDesktopPlatform('unknown','unknown'),null);
});
