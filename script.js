// script.js
// Theme toggle implementation: toggles .dark on <body>, persists choice to localStorage,
// and respects the user's prefers-color-scheme if no stored choice exists.

const THEME_KEY = 'theme-preference'; // 'light' or 'dark'

const ICON_SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.8 1.8-1.8zM1 13h3v-2H1v2zm10-9h2V1h-2v3zm7.03 1.05l1.79-1.8-1.79-1.79-1.8 1.79 1.8 1.8zM17.24 19.16l1.79 1.79 1.79-1.79-1.79-1.8-1.79 1.8zM20 11v2h3v-2h-3zM12 6a6 6 0 100 12 6 6 0 000-12zM6.76 19.16l1.8-1.8-1.8-1.79-1.79 1.79 1.79 1.8zM11 23h2v-3h-2v3z"/></svg>';
const ICON_MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';

function setTheme(theme, themeToggle){
  if(theme === 'dark'){
    document.body.classList.add('dark');
    if(themeToggle) themeToggle.innerHTML = ICON_MOON;
    if(themeToggle) themeToggle.setAttribute('aria-pressed','true');
  } else {
    document.body.classList.remove('dark');
    if(themeToggle) themeToggle.innerHTML = ICON_SUN;
    if(themeToggle) themeToggle.setAttribute('aria-pressed','false');
  }
}

function initTheme(themeToggle){
  const stored = localStorage.getItem(THEME_KEY);
  if(stored === 'dark' || stored === 'light'){
    setTheme(stored, themeToggle);
    return;
  }
  // No stored preference: use system preference
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark ? 'dark' : 'light', themeToggle);
}

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');

  // Load user-editable static text from config.json
  fetch('config.json')
    .then(r => {
      if(!r.ok) throw new Error('Failed to load config');
      return r.json();
    })
    .then(cfg => {
      // Populate text
      const sr = document.querySelector('.sr-only');
      if(sr) sr.textContent = cfg.name || '';

      const subtitlePrimary = document.getElementById('subtitle-primary');
      const subtitleStack = document.getElementById('subtitle-stack');
      const subtitleLocation = document.getElementById('subtitle-location');
      const bioEl = document.getElementById('bio');

      if(subtitlePrimary) subtitlePrimary.textContent = cfg.subtitle || '';
      // Render stack as badges with icons if array provided
      if(subtitleStack){
        subtitleStack.innerHTML = '';
        if(Array.isArray(cfg.stack)){
          const container = document.createElement('span');
          container.className = 'stack-badges';
          cfg.stack.forEach((item, i) => {
            const badge = document.createElement('span');
            badge.className = 'stack-badge';
            const logo = document.createElement('span');
            logo.className = 'logo';
            // support SVG file paths or inline SVG strings or emoji/text
            if(typeof item.icon === 'string'){
              const v = item.icon.trim();
              if(v.endsWith('.svg')){
                const img = document.createElement('img');
                img.src = v;
                img.alt = item.name + ' logo';
                img.className = 'logo';
                badge.appendChild(img);
              } else if(v.startsWith('<svg')){
                logo.innerHTML = v;
                badge.appendChild(logo);
              } else {
                logo.textContent = v;
                badge.appendChild(logo);
              }
            }
            const text = document.createElement('span');
            text.className = 'stack-name';
            text.textContent = item.name || '';
            badge.appendChild(text);
            container.appendChild(badge);
            // add separator visually if you prefer pipes (optional)
            if(i < cfg.stack.length - 1){
              const sep = document.createElement('span');
              sep.className = 'stack-sep';
              sep.textContent = '';
              // container.appendChild(sep);
            }
          });
          subtitleStack.appendChild(container);
        } else {
          subtitleStack.textContent = cfg.stack || '';
        }
      }
      if(subtitleLocation){
        subtitleLocation.innerHTML = '';
        const loc = document.createElement('span');
        loc.className = 'location';
        const pin = document.createElement('span');
        pin.className = 'pin';
        pin.textContent = '📍';
        const locText = document.createElement('span');
        locText.textContent = cfg.location || '';
        loc.appendChild(pin);
        loc.appendChild(locText);
        subtitleLocation.appendChild(loc);
      }
      if(bioEl) bioEl.textContent = cfg.bio || '';

      // Render social links (github, linkedin, email, blog) from config
      try{
        const navLinks = document.getElementById('nav-links');
        if(navLinks && cfg.socials){
          const icons = {
            github: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>',
            linkedin: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.966 0-1.75-.79-1.75-1.76 0-.97.784-1.76 1.75-1.76s1.75.79 1.75 1.76c0 .97-.784 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/></svg>',
            email: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z"/></svg>',
            blog: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/></svg>'
          };

          Object.keys(cfg.socials).forEach(key => {
            const val = cfg.socials[key];
            if(!val) return;
            const a = document.createElement('a');
            // email value may be plain email; support both mailto and plain
            if(key === 'email'){
              const href = val.startsWith('mailto:') ? val : `mailto:${val}`;
              a.href = href;
            } else {
              a.href = val;
            }
            a.setAttribute('aria-label', (cfg.socials && cfg.socials.labels && cfg.socials.labels[key]) || key.charAt(0).toUpperCase() + key.slice(1));
            if(/^https?:\/\//i.test(val)){
              a.target = '_blank';
              a.rel = 'noopener';
            }
            a.innerHTML = icons[key] || icons['blog'];
            navLinks.appendChild(a);
          });
        }
      }catch(e){
        console.error('Error rendering social links', e);
      }

      // Initialize theme and toggle
      initTheme(themeToggle);

      if(themeToggle){
        themeToggle.addEventListener('click', () => {
          const isDark = document.body.classList.contains('dark');
          const next = isDark ? 'light' : 'dark';
          setTheme(next, themeToggle);
          localStorage.setItem(THEME_KEY, next);
        });
      }

      // Typing effect for the name using config
      const typedEl = document.getElementById('typed-name');
      const fullName = cfg.name || 'Anoop Simon';
      const typingDelay = 80; // ms per character (base)
      const variance = 60; // random extra ms to feel natural

      if(typedEl){
        typedEl.textContent = '';
        let idx = 0;
        function typeNext(){
          if(idx <= fullName.length - 1){
            typedEl.textContent += fullName.charAt(idx);
            idx += 1;
            const nextDelay = typingDelay + Math.floor(Math.random() * variance);
            setTimeout(typeNext, nextDelay);
          }
        }
        // small initial delay so it feels purposeful
        setTimeout(typeNext, 300);
      }
    })
    .catch(err => {
      console.error('Failed to load config.json', err);
      // still initialize theme so UI isn't broken
      initTheme(themeToggle);
    });
});

