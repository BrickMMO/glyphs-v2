// handling mobile menu open/close
function toggleMobileMenu() {
    var mobileNav = document.getElementById("mobile-nav");
    if (mobileNav.classList.contains("mobile-menu-hidden")) {
        mobileNav.classList.remove("mobile-menu-hidden");
        mobileNav.classList.add("mobile-menu-show");
    } else {
        mobileNav.classList.remove("mobile-menu-show");
        mobileNav.classList.add("mobile-menu-hidden");
    }
}

// closing mobile menu when clicking outside
document.addEventListener('click', function(event) {
    var mobileNav = document.getElementById("mobile-nav");
    var hamburgerBtn = document.querySelector('.w3-hide-large.w3-hide-medium .w3-button');
    
    if (mobileNav 
        && !mobileNav.contains(event.target) 
        && (!hamburgerBtn || !hamburgerBtn.contains(event.target))) {
        if (mobileNav.classList.contains("mobile-menu-show")) {
            mobileNav.classList.remove("mobile-menu-show");
            mobileNav.classList.add("mobile-menu-hidden");
        }
    }
});

// toggling each FAQ item 
function toggleFAQ(faqId) {
    var faqContent = document.getElementById(faqId);
    var faqIcon = document.getElementById(faqId + '-icon');
    
    if (faqContent.classList.contains("w3-hide")) {
        faqContent.classList.remove("w3-hide");
        faqContent.classList.add("w3-show");
        faqIcon.className = "ph ph-minus faq-icon rotated";
    } else {
        faqContent.classList.remove("w3-show");
        faqContent.classList.add("w3-hide");
        faqIcon.className = "ph ph-plus faq-icon";
    }
}

// filtering icons 
function searchIcons() {
    var input = document.getElementById('iconSearch');
    var filter = input.value.toLowerCase();
    var iconItems = document.querySelectorAll('.icon-grid-item');
    var visibleCount = 0;
    
    iconItems.forEach(function(item) {
        var label = item.querySelector('.label');
        if (label) {
            var iconName = label.textContent || label.innerText;
            if (iconName.toLowerCase().indexOf(filter) > -1) {
                item.style.display = '';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        }
    });
    
    // showing a "no results" message
    var noResultsMsg = document.getElementById('no-results-message');
    if (visibleCount === 0 && filter.length > 0) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'no-results-message';
            noResultsMsg.className = 'w3-container w3-center w3-padding-32';
            noResultsMsg.innerHTML = '<p class="w3-large w3-text-grey">No icons found</p>';
            
            var iconsContainer = document.querySelector('.icons-grid-container');
            iconsContainer.appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    } else if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
}

// toggling docs sub-sections 
function toggleSection(sectionId) {
    const content = document.getElementById(sectionId);
    const icon = document.getElementById(sectionId + '-icon');
    
    if (content.classList.contains('w3-show')) {
        content.classList.remove('w3-show');
        content.classList.add('w3-hide');
        icon.classList.remove('rotated');
    } else {
        content.classList.remove('w3-hide');
        content.classList.add('w3-show');
        icon.classList.add('rotated');
    }
}

// toggling the left sidebar 
function toggleSidebarSection(sectionId) {
    const dropdown = document.getElementById(sectionId + '-dropdown');
    const arrow = document.getElementById(sectionId + '-arrow');

    if (!dropdown || !arrow) return; 

    if (dropdown.classList.contains('collapsed')) {
        dropdown.classList.remove('collapsed');
        arrow.classList.remove('rotated');
        arrow.innerHTML = '▼';
    } else {
        dropdown.classList.add('collapsed');
        arrow.classList.add('rotated');
        arrow.innerHTML = '▶';
    }
}

// highlighting the active link in the docs sidebar
document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.sidebar-link');
    if (links.length) {
        links.forEach(link => {
            link.addEventListener('click', function () {
                links.forEach(l => l.classList.remove('active-sidebar'));
                this.classList.add('active-sidebar');
            });
        });
    }
});

// Loading HTML partials (header/footer) into placeholders
function includePartials() {
  const includeTargets = document.querySelectorAll('[data-include]');
  includeTargets.forEach(async (el) => {
    const url = el.getAttribute('data-include');
    try {
      const res = await fetch(url);
      const html = await res.text();
      el.innerHTML = html;
      // After injecting, if we injected header, set active nav
      if (url.includes('header.html')) {
        highlightActiveNav();
      }
    } catch (e) {
      console.error('Failed to include', url, e);
    }
  });
}

// Highlighting active nav link based on current page
function highlightActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  const map = {
    'index.html': 'home',
    'icons.html': 'icons',
    'docs.html': 'docs',
    'docs-main.html': 'docs'
  };
  const key = map[path] || 'home';
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.getAttribute('data-nav') === key) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}

// running search on input (icons.html only, avoiding inline handlers)
function setupIconSearch() {
  const input = document.getElementById('iconSearch');
  if (!input) return;
  input.addEventListener('input', searchIcons);
}

document.addEventListener('DOMContentLoaded', setupIconSearch);

// Running partial includes once DOM is ready
document.addEventListener('DOMContentLoaded', includePartials);

// opening a W3 modal when clicking an icon (icons.html only)
function setupIconModal() {
  const gridContainer = document.querySelector('.icons-grid-container');
  const modal = document.getElementById('iconModal');
  const closeBtn = document.getElementById('iconModalClose');
  const copyBtn = document.getElementById('copySnippetBtn');
  const codeEl = document.getElementById('iconModalCode');
  const previewEl = document.getElementById('iconModalPreview');

  if (!gridContainer || !modal || !closeBtn || !copyBtn || !codeEl || !previewEl) {
    return; // not on icons page or modal markup missing
  }

  let currentSnippet = '';

  // delegating click on any <i class="icon ...">
  gridContainer.addEventListener('click', (e) => {
    const iconEl = e.target.closest('i.icon');
    if (!iconEl) return;

    const classes = Array.from(iconEl.classList).filter(c => c.startsWith('icon'));
    const snippet = `<i class="${classes.join(' ')}"></i>`;
    currentSnippet = snippet;

    // updating preview and code block
    previewEl.innerHTML = '';
    const clone = iconEl.cloneNode(true);
    clone.style.fontSize = '64px'; // making preview large enough
    previewEl.appendChild(clone);
    codeEl.textContent = snippet;

    // showing modal
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
  });

  // closing via X button
  function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }
  closeBtn.addEventListener('click', closeModal);
  closeBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      closeModal();
    }
  });

  // closing by clicking overlay
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // closing on Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });

  // copying the snippet to clipboard
  copyBtn.addEventListener('click', async () => {
    async function clipboardWrite(text) {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
      }
      return new Promise((resolve, reject) => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
          const ok = document.execCommand('copy');
          document.body.removeChild(ta);
          if (ok) resolve(); else reject(new Error('execCommand copy failed'));
        } catch (err) {
          document.body.removeChild(ta);
          reject(err);
        }
      });
    }

    try {
      await clipboardWrite(currentSnippet);
      const original = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = original), 1200);
    } catch (err) {
      console.error('Failed to copy snippet', err);
    }
  });
}

// wiring modal setup when DOM is ready
document.addEventListener('DOMContentLoaded', setupIconModal);


