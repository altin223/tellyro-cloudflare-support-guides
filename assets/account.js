/* "View & Copy Account Details": opened from the button in a Tellyro account email.
   The link carries a secret token after "#", which the browser never sends to any server in the address. This page
   posts it to the backend's account-details function, which answers only for a valid, unexpired link and only with
   the accounts that email was about. Nothing is stored in the browser. */
(() => {
  'use strict';
  const C = window.TELLYRO_CONFIG || {};
  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const box = $('#box'), status = $('#status');
  const safeUrl = (u) => { try { const x = new URL(u); return x.protocol === 'https:' ? x.href : null; } catch { return null; } };
  for (const [id, url] of [['#wa', C.whatsapp], ['#tg', C.telegram]]) { const u = safeUrl(url); if (u) $(id).href = u; }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmt = (iso) => { const d = new Date(iso); if (Number.isNaN(d.getTime())) return ''; const p = (n) => String(n).padStart(2, '0');
    return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${p(d.getUTCHours())}:${p(d.getUTCMinutes())} UTC`; };

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise((ok, no) => { const t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;opacity:0;top:0';
      document.body.append(t); t.select(); try { document.execCommand('copy') ? ok() : no(); } catch (e) { no(e); } t.remove(); });
  }
  function copyButton(label, value, what) {
    const b = el('button', 'btn copy', 'Copy'); b.type = 'button'; b.setAttribute('aria-label', `Copy ${what}`);
    b.addEventListener('click', () => copyText(value).then(() => {
      b.textContent = 'Copied'; b.classList.add('done'); status.textContent = `${label} copied.`;
      setTimeout(() => { b.textContent = 'Copy'; b.classList.remove('done'); }, 2000);
    }, () => { status.textContent = 'Could not copy automatically. Tap and hold the value, then choose Copy.'; }));
    return b;
  }
  const xtream = (a) => [`Server URL: ${a.server}`, `Username: ${a.username}`, `Password: ${a.password ?? ''}`].join('\n');
  const allText = (a) => [a.name || (a.kind === 'trial' ? 'Trial account' : 'Premium account'), xtream(a), ...(a.m3u ? [`M3U link: ${a.m3u}`] : []), `${a.active ? 'Expires' : 'Expired'}: ${fmt(a.expires_at)}`].join('\n');

  function accountCard(a, i, n) {
    const card = el('section', 'card'); card.setAttribute('aria-label', `Account ${i + 1}`);
    const h = el('h2', null, a.name || (a.kind === 'trial' ? 'Trial account' : 'Premium account'));
    const tag = el('span', `tag ${a.active ? 'ok' : 'off'}`, a.active ? 'Active' : 'Expired'); h.append(tag);
    card.append(h, el('p', 'sub', `${n > 1 ? `Account ${i + 1} of ${n} · ` : ''}${a.active ? 'Expires' : 'Expired'} ${fmt(a.expires_at)}`));
    const row = (label, value, small) => {
      const r = el('div', 'row'); const v = el('div', `v${small ? ' small' : ''}`, value);
      r.append(el('div', 'k', label), v, copyButton(label, value, label.toLowerCase())); return r;
    };
    card.append(row('Username', a.username));
    if (a.password != null) card.append(row('Password', a.password));
    if (a.server) card.append(row('Server URL', a.server));
    if (a.m3u) card.append(row('M3U link', a.m3u, true));
    const acts = el('div', 'acts');
    const xb = el('button', 'btn primary', 'Copy complete Xtream details'); xb.type = 'button';
    xb.addEventListener('click', () => copyText(xtream(a)).then(() => { status.textContent = 'Xtream details copied (server URL, username and password).'; }, () => { status.textContent = 'Could not copy automatically.'; }));
    acts.append(xb); card.append(acts);
    return card;
  }

  function showError(title, text) {
    const m = el('div', 'msg err'); m.append(el('h2', null, title), el('p', null, text)); box.replaceChildren(m);
    $('#lead').textContent = 'Our team can send you your details again on WhatsApp or Telegram.';
  }

  async function load() {
    const token = (new URLSearchParams(location.hash.slice(1)).get('t') || '').trim();
    if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return showError('This link is not complete', 'Please open the “View & Copy Account Details” button in your Tellyro email again.');
    if (!C.supabaseUrl || !C.supabaseAnonKey) return showError('Not available right now', 'Please message us on WhatsApp or Telegram.');
    let r, j = {};
    try {
      r = await fetch(C.supabaseUrl.replace(/\/$/, '') + '/functions/v1/account-details', {
        method: 'POST', cache: 'no-store', referrerPolicy: 'no-referrer',
        headers: { 'content-type': 'application/json', apikey: C.supabaseAnonKey }, body: JSON.stringify({ token }),
      });
      j = await r.json().catch(() => ({}));
    } catch { return showError('Could not connect', 'Check your internet connection and reload this page.'); }
    if (!r.ok || !j.ok) {
      const t = j.code === 'link_expired' ? 'This link has expired' : r.status === 429 ? 'Please wait a moment' : 'This link is not available';
      return showError(t, j.error || 'Please message us on WhatsApp or Telegram.');
    }
    const list = j.accounts || [];
    if (j.first_name) $('#title').replaceChildren(document.createTextNode(`Hi ${j.first_name}, here are your `), Object.assign(el('em', null, list.length > 1 ? 'account details' : 'account details')));
    const parts = list.map((a, i) => accountCard(a, i, list.length));
    if (list.length > 1) {
      const all = el('button', 'btn', `Copy all ${list.length} accounts`); all.type = 'button'; all.id = 'copy-all';
      all.addEventListener('click', () => copyText(list.map(allText).join('\n\n')).then(() => { status.textContent = `All ${list.length} accounts copied.`; }, () => { status.textContent = 'Could not copy automatically.'; }));
      const wrap = el('div', 'acts'); wrap.append(all); parts.push(wrap);
    }
    if (j.link_expires_at) parts.push(el('p', 'note', `This secure link works until ${fmt(j.link_expires_at)}.`));
    box.replaceChildren(...parts);
  }
  load();
  // another link opened in the same tab only changes the part after "#": load that one instead
  addEventListener('hashchange', () => location.reload());
})();
