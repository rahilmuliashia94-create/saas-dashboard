document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const page = body.dataset.page || '';

  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(link => {
    const target = link.getAttribute('href') || '';
    if (target === current || (current === '' && target === 'index.html')) {
      link.classList.add('active');
    }
  });

  const toggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => mobileNav.classList.toggle('open'));
    mobileNav.querySelectorAll('a,button').forEach(el => {
      el.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }

  document.querySelectorAll('.faq button').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq');
      if (!item) return;
      item.classList.toggle('open');
    });
  });

  const tabs = [...document.querySelectorAll('[data-filter]')];
  const products = [...document.querySelectorAll('[data-product]')];
  const search = document.querySelector('[data-search]');
  const count = document.querySelector('[data-count]');

  function applyFilters() {
    const active = tabs.find(t => t.classList.contains('active'))?.dataset.filter || 'all';
    const q = (search?.value || '').trim().toLowerCase();
    let visible = 0;

    products.forEach(card => {
      const category = (card.dataset.category || '').toLowerCase();
      const title = (card.dataset.title || '').toLowerCase();
      const text = (card.dataset.text || '').toLowerCase();
      const matchesTab = active === 'all' || category === active;
      const matchesSearch = !q || title.includes(q) || text.includes(q) || category.includes(q);
      const show = matchesTab && matchesSearch;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    if (count) count.textContent = `${visible} item${visible === 1 ? '' : 's'}`;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      applyFilters();
    });
  });

  if (search) search.addEventListener('input', applyFilters);
  if (products.length) applyFilters();

  const modal = document.querySelector('[data-modal]');
  const modalImg = document.querySelector('[data-modal-img]');
  const modalTitle = document.querySelector('[data-modal-title]');
  const modalText = document.querySelector('[data-modal-text]');
  const modalMeta = document.querySelector('[data-modal-meta]');
  const modalClose = document.querySelector('[data-modal-close]');

  function openModal(card) {
    if (!modal || !modalImg || !modalTitle || !modalText || !modalMeta) return;
    modalImg.src = card.dataset.image || '';
    modalImg.alt = card.dataset.title || 'Product image';
    modalTitle.textContent = card.dataset.title || '';
    modalText.textContent = card.dataset.text || '';
    modalMeta.textContent = `${card.dataset.category || ''} • ${card.dataset.meta || ''}`;
    modal.classList.add('open');
  }

  function closeModal() {
    modal?.classList.remove('open');
  }

  document.querySelectorAll('[data-open-modal]').forEach(card => {
    card.addEventListener('click', () => openModal(card));
  });
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  const loginForm = document.querySelector('[data-login-form]');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const user = document.querySelector('#username')?.value.trim() || '';
      const pass = document.querySelector('#password')?.value.trim() || '';
      const error = document.querySelector('[data-login-error]');
      if (error) error.style.display = 'none';

      const submit = loginForm.querySelector('button[type="submit"]');
      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Signing in...';
      }

      setTimeout(() => {
        if (user === 'demo' && pass === 'demo123') {
          window.location.href = 'client.html';
        } else {
          if (error) {
            error.textContent = 'Invalid username or password. Try demo / demo123.';
            error.style.display = 'block';
          }
          if (submit) {
            submit.disabled = false;
            submit.textContent = 'Login';
          }
        }
      }, 900);
    });
  }
});
