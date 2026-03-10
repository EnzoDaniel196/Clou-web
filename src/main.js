/* ════════════════════════════════════════
   CLOU PERFUMES — Main Application
   ════════════════════════════════════════ */

// ─── Config ───
// Reemplaza este número con tu WhatsApp real (con código de país)
const WHATSAPP_NUMBER = '5493434569762';
const INSTAGRAM_URL = 'https://instagram.com/clou_perfumes';

// ─── State ───
let products = [];

// ─── DOM References ───
const catalogGrid = document.getElementById('catalog-grid');
const detailOverlay = document.getElementById('product-detail');
const detailImage = document.getElementById('detail-image');
const detailName = document.getElementById('detail-name');
const detailDescription = document.getElementById('detail-description');
const detailWhatsapp = document.getElementById('detail-whatsapp');
const detailInstagram = document.getElementById('detail-instagram');
const detailStock = document.getElementById('detail-stock');
const detailBack = document.getElementById('detail-back');
const contactWhatsapp = document.getElementById('contact-whatsapp');

// ─── Init ───
document.addEventListener('DOMContentLoaded', init);

async function init() {
  try {
    const res = await fetch('/data/products.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    products = await res.json();
    renderCatalog(products);
    setupContactWhatsApp();
    setupDetailEvents();
  } catch (err) {
    console.error('Error loading products:', err);
    catalogGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-secondary);">
        <p>No se pudieron cargar los productos.</p>
      </div>
    `;
  }
}


// ─── Catalog Rendering ───

function renderCatalog(items) {
  catalogGrid.innerHTML = '';

  if (items.length === 0) {
    catalogGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-secondary);">
        <p>No hay productos disponibles en este momento.</p>
      </div>
    `;
    return;
  }

  items.forEach((product, index) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.style.animationDelay = `${0.1 + index * 0.1}s`;
    card.dataset.productId = product.id;

    card.innerHTML = `
      <div class="card-image-wrapper">
        <img
          class="card-image"
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.style.display='none'"
        />
      </div>
      <div class="card-body">
        <h3 class="card-name">${product.name}</h3>
        <p class="card-description">${product.shortDescription}</p>
        <p class="card-price">${product.price}</p>
        <span class="card-cta">IR AL PRODUCTO</span>
      </div>
    `;

    card.addEventListener('click', () => openDetail(product));
    catalogGrid.appendChild(card);
  });
}


// ─── Product Detail ───

function openDetail(product) {
  // Populate
  detailImage.src = product.image;
  detailImage.alt = product.name;
  detailName.textContent = product.name;

  // Build description with bold notes
  let desc = product.longDescription;
  if (product.notes && product.notes.length > 0) {
    product.notes.forEach(note => {
      desc = desc.replace(
        new RegExp(`(${escapeRegex(note)})`, 'gi'),
        '<strong>$1</strong>'
      );
    });
  }
  detailDescription.innerHTML = `"${desc}"`;

  // WhatsApp link
  const message = encodeURIComponent(`Hola, me interesa el perfume: ${product.name}`);
  detailWhatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  // Instagram link
  detailInstagram.href = INSTAGRAM_URL;

  // Stock status
  if (product.inStock) {
    detailStock.className = 'detail-stock';
    detailStock.innerHTML = '<span class="stock-dot"></span> EN STOCK';
  } else {
    detailStock.className = 'detail-stock out-of-stock';
    detailStock.innerHTML = '<span class="stock-dot"></span> SIN STOCK';
  }

  // Show overlay
  detailOverlay.classList.add('active');
  detailOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('detail-open');

  // Scroll overlay to top
  detailOverlay.scrollTop = 0;
}

function closeDetail() {
  detailOverlay.classList.remove('active');
  detailOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('detail-open');
}

function setupDetailEvents() {
  detailBack.addEventListener('click', closeDetail);

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && detailOverlay.classList.contains('active')) {
      closeDetail();
    }
  });
}


// ─── Contact WhatsApp ───

function setupContactWhatsApp() {
  const message = encodeURIComponent('Hola, me gustaría consultar sobre sus perfumes.');
  contactWhatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}


// ─── Utilities ───

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
