(() => {
  const header = document.querySelector('.site-header');
  const nav = header?.querySelector('.top-nav');
  if (nav) {
    nav.id = 'primary-navigation';
    const toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-controls', nav.id);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '選單 ＋';
    header.insertBefore(toggle, nav);
    const close = () => { toggle.setAttribute('aria-expanded', 'false'); header.classList.remove('menu-open'); toggle.textContent = '選單 ＋'; };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      header.classList.toggle('menu-open', open);
      toggle.textContent = open ? '關閉 ×' : '選單 ＋';
    });
    nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
    header.addEventListener('keydown', e => { if (e.key === 'Escape') { close(); toggle.focus(); } });
    matchMedia('(min-width: 961px)').addEventListener('change', close);
    document.body.classList.add('nav-ready');
  }

  // All contact entry points use one configuration; no share links posing as inquiries.
  const contact = document.createElement('dialog');
  contact.className = 'contact-dialog';
  contact.setAttribute('aria-labelledby', 'contact-title');
  contact.innerHTML = '<button class="dialog-close" type="button" aria-label="關閉">×</button><p class="eyebrow">LET’S GET MOVING</p><h2 id="contact-title">聯絡方式準備中</h2><p>官方 LINE 即將提供，目前尚無法送出課程洽詢。歡迎先瀏覽課程與老師介紹。</p><button type="button" class="button contact-return">繼續瀏覽</button>';
  document.body.append(contact);
  let opener;
  contact.querySelectorAll('button').forEach(button => button.addEventListener('click', () => contact.close()));
  contact.addEventListener('close', () => opener?.focus());
  window.openCourseContact = (trigger) => {
    const url = window.siteConfig?.lineUrl;
    if (url && /^https:\/\//.test(url)) window.open(url, '_blank', 'noopener,noreferrer');
    else { opener = trigger || document.activeElement; contact.showModal(); }
  };
  document.addEventListener('click', e => {
    const link = e.target.closest('[data-contact]');
    if (link) { e.preventDefault(); window.openCourseContact(link); }
  });
  document.querySelectorAll('[data-contact]').forEach(link => {
    if (window.siteConfig?.lineUrl) link.href = window.siteConfig.lineUrl;
    else { link.setAttribute('aria-haspopup', 'dialog'); link.title = '官方 LINE 準備中'; }
  });
  if (window.siteConfig?.lineUrl) {
    document.querySelectorAll('.contact-status').forEach(status => {
      status.textContent = '課程時間、地點與費用，請透過官方 LINE 洽詢確認。';
    });
  }

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const select = tab => {
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(index + tabs.length - 1) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); select(next); next.focus(); }
    });
  });
  if (tabs.length) select(tabs[0]);
})();
