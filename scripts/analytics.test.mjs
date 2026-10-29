import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { test } from 'node:test';

function browser(hostname = 'yihuanhuang.github.io') {
  let now = 0;
  const events = [];
  const handlers = {};
  const document = { visibilityState: 'visible', hasFocus: () => focused,
    addEventListener: (name, fn) => { handlers[name] = fn; } };
  let focused = true;
  let tick = () => {};
  const window = { location: { hostname, pathname: '/projects/late-swarm/' },
    umami: { track: (name, data) => { events.push({ name, ...data }); return Promise.resolve(); } },
    addEventListener: (name, fn) => { handlers[name] = fn; } };
  vm.runInNewContext(readFileSync(new URL('../public/analytics.js', import.meta.url), 'utf8'), {
    window, document, performance: { now: () => now },
    setInterval: fn => { tick = fn; },
  });
  return { events, advance: ms => { now += ms; tick(); },
    hide: () => { document.visibilityState = 'hidden'; handlers.visibilitychange?.(); },
    show: () => { document.visibilityState = 'visible'; handlers.visibilitychange?.(); },
    blur: () => { focused = false; handlers.blur?.(); },
    focus: () => { focused = true; handlers.focus?.(); },
    leave: () => handlers.pagehide?.(),
  };
}

test('counts foreground time without counting hidden or unfocused time twice', () => {
  const page = browser();
  page.advance(30_000);
  page.hide();
  page.advance(60_000);
  page.show();
  page.advance(10_000);
  page.blur();
  page.advance(60_000);
  page.focus();
  page.advance(5_000);
  page.hide();
  page.leave();
  assert.deepEqual(page.events.map(e => e.seconds), [30, 10, 5]);
  assert.ok(page.events.every(e => e.name === 'page-engagement' && e.path === '/projects/late-swarm/'));
});

test('local previews do not generate real analytics events', () => {
  const page = browser('localhost');
  page.advance(60_000);
  page.hide();
  assert.equal(page.events.length, 0);
});

test('a blocked tracker does not break the page', () => {
  const script = readFileSync(new URL('../public/analytics.js', import.meta.url), 'utf8');
  assert.doesNotThrow(() => vm.runInNewContext(script, {
    window: { location: { hostname: 'yihuanhuang.github.io' }, addEventListener: () => {} },
    document: { visibilityState: 'visible', hasFocus: () => true, addEventListener: () => {} },
    performance: { now: () => 0 }, setInterval: fn => fn(),
  }));
});
