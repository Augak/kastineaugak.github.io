// Run with: node --test tests/test_author_portrait.js
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '..', 'blog-feed.js'), 'utf8')
  .replace(/let db=null;import\([^\n]+/, 'let db=null;'); // The optional network client is irrelevant to rendering.
const base = 'https://example.test/site/blog.html';
const sample = {status:'published', slug:'example', title:'Example', content:'Text', date:'2026-01-01', author:'A & B', tags:[]};

async function render(post) {
  const elements = {};
  function element() { return {children:[], events:{}, appendChild(x){this.children.push(x)}, addEventListener(n,fn,capture){this.events[n]={fn,capture}}, setAttribute(){}, querySelectorAll(){return []}}; }
  for (const id of ['blog-posts','blog-status','blog-categories','blog-empty']) elements[id] = element();
  const document = {baseURI:base, getElementById(id){return elements[id] || null}, createElement:element};
  const context = {document, location:{href:base, search:''}, URL, URLSearchParams, Intl, Date, Math, localStorage:{getItem(){return 'test'}}, fetch:async()=>({ok:true,json:async()=>({posts:[post]})})};
  vm.runInNewContext(source, context);
  await new Promise(resolve => setImmediate(resolve));
  return {html:elements['blog-posts'].children[0].innerHTML, root:elements['blog-posts']};
}

test('missing and blank portrait preserve the existing byline markup', async()=>{
  const a = await render(sample), b = await render({...sample,authorPortrait:'  '});
  assert.equal(a.html,b.html);
  assert.match(a.html, /<time datetime="2026-01-01">.*?<\/time><span>·<\/span><span>A &amp; B<\/span>/);
  assert.doesNotMatch(a.html, /author-portrait/);
});
test('relative and HTTPS portraits are decorative and safely escaped', async()=>{
  const a = await render({...sample,authorPortrait:'assets/person.jpg?x=1&y=2'});
  assert.match(a.html, /src="https:\/\/example\.test\/site\/assets\/person\.jpg\?x=1&amp;y=2" alt="" width="32" height="32" loading="lazy"/);
  assert.match(a.html, /<span>A &amp; B<\/span>/);
  const b = await render({...sample,authorPortrait:'https://images.example/test.jpg'});
  assert.match(b.html, /src="https:\/\/images\.example\/test\.jpg"/);
  const c = await render({...sample,authorPortrait:'https://images.example/p.jpg?x=" onerror="alert(1)'});
  assert.doesNotMatch(c.html, /" onerror="/);
});
test('unsafe, malformed and missing-author values never produce an image', async()=>{
  for (const value of ['javascript:alert(1)', 'data:image/svg+xml,x', 'file:///tmp/x', 'http://[', '', null, {}, '  ']) {
    const r = await render({...sample,authorPortrait:value});
    assert.doesNotMatch(r.html, /author-portrait/, String(value));
  }
  const r = await render({...sample, author:'', authorPortrait:'https://example.test/p.jpg'});
  assert.doesNotMatch(r.html, /author-portrait/);
  assert.match(r.html, /<span>Kastine Augak<\/span>/);
});
test('failed portrait is removed without affecting other image errors', async()=>{
  const {root} = await render({...sample,authorPortrait:'assets/person.jpg'});
  assert.equal(root.events.error.capture,true);
  let removed = false;
  root.events.error.fn({target:{classList:{contains:c=>c==='author-portrait'},remove(){removed=true}}});
  assert.equal(removed,true);
  removed = false;
  root.events.error.fn({target:{classList:{contains:()=>false},remove(){removed=true}}});
  assert.equal(removed,false);
});
