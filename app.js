// 상품 데이터
const products = [
  {
    id: 1,
    name: "클래식 린넨 셔츠",
    desc: "고급 린넨 소재의 편안한 일상 셔츠",
    price: 39000,
    originalPrice: 55000,
    badge: "BEST",
    emoji: "👔",
    color: "#fef3ec"
  },
  {
    id: 2,
    name: "슬림 치노 팬츠",
    desc: "세련된 실루엣의 올데이 치노 팬츠",
    price: 52000,
    originalPrice: null,
    badge: "NEW",
    emoji: "👖",
    color: "#edf4f0"
  },
  {
    id: 3,
    name: "캔버스 스니커즈",
    desc: "가볍고 튼튼한 데일리 캔버스 신발",
    price: 68000,
    originalPrice: 89000,
    badge: "SALE",
    emoji: "👟",
    color: "#f0ecf8"
  },
  {
    id: 4,
    name: "미니멀 크로스백",
    desc: "깔끔한 디자인의 데일리 크로스백",
    price: 45000,
    originalPrice: null,
    badge: "NEW",
    emoji: "👜",
    color: "#fef9ec"
  },
  {
    id: 5,
    name: "코튼 오버핏 후디",
    desc: "부드러운 코튼 소재의 편안한 후드티",
    price: 58000,
    originalPrice: 72000,
    badge: "BEST",
    emoji: "🧥",
    color: "#ecf4fe"
  },
  {
    id: 6,
    name: "와이드 데님 팬츠",
    desc: "트렌디한 와이드 핏 데님 청바지",
    price: 79000,
    originalPrice: null,
    badge: "NEW",
    emoji: "🩳",
    color: "#ecf0fe"
  },
  {
    id: 7,
    name: "울 블렌드 머플러",
    desc: "따뜻하고 부드러운 울 혼방 머플러",
    price: 29000,
    originalPrice: 42000,
    badge: "SALE",
    emoji: "🧣",
    color: "#feecec"
  },
  {
    id: 8,
    name: "레더 미니 지갑",
    desc: "슬림하고 실용적인 천연가죽 지갑",
    price: 35000,
    originalPrice: null,
    badge: "BEST",
    emoji: "👛",
    color: "#f4f0ec"
  }
];

// 장바구니 불러오기
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

// 장바구니 저장
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// 장바구니 아이콘 숫자 업데이트
function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = total;
}

// 가격 포맷 (12345 → 12,345원)
function formatPrice(price) {
  return price.toLocaleString('ko-KR') + '원';
}

// ── 메인 페이지: 상품 카드 렌더링 ──
function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="product-thumb" style="background:${p.color}">
        ${p.emoji}
      </div>
      <div class="product-info">
        <span class="product-badge">${p.badge}</span>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-price">
          ${p.originalPrice ? `<span class="product-original-price">${formatPrice(p.originalPrice)}</span>` : ''}
          ${formatPrice(p.price)}
        </div>
        <button class="btn-add-cart" onclick="addToCart(${p.id})">
          장바구니 담기
        </button>
      </div>
    </div>
  `).join('');
}

// 장바구니에 상품 추가
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, emoji: product.emoji, color: product.color, qty: 1 });
  }

  saveCart(cart);

  // 버튼 피드백
  const buttons = document.querySelectorAll('.btn-add-cart');
  buttons.forEach(btn => {
    if (btn.getAttribute('onclick') === `addToCart(${productId})`) {
      btn.textContent = '✓ 담겼습니다!';
      btn.style.background = '#4caf50';
      setTimeout(() => {
        btn.textContent = '장바구니 담기';
        btn.style.background = '';
      }, 1200);
    }
  });
}

// ── 장바구니 페이지: 렌더링 ──
function renderCart() {
  const cartItemsEl = document.getElementById('cart-items');
  const cartEmptyEl = document.getElementById('cart-empty');
  const cartSummaryEl = document.getElementById('cart-summary');
  if (!cartItemsEl) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartItemsEl.style.display = 'none';
    cartEmptyEl.style.display = 'block';
    cartSummaryEl.style.display = 'none';
    return;
  }

  cartItemsEl.style.display = 'flex';
  cartEmptyEl.style.display = 'none';
  cartSummaryEl.style.display = 'block';

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-thumb" style="background:${item.color}">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="btn-remove" onclick="removeItem(${item.id})">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `).join('');

  // 합계 계산
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById('subtotal').textContent = formatPrice(subtotal);
  document.getElementById('shipping').textContent = subtotal >= 50000 ? '무료' : '3,000원';
  const shippingCost = subtotal >= 50000 ? 0 : 3000;
  document.getElementById('total').textContent = formatPrice(subtotal + shippingCost);
}

// 수량 변경
function changeQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeItem(productId);
    return;
  }
  saveCart(cart);
  renderCart();
}

// 상품 삭제
function removeItem(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
  renderCart();
}

// 로그인 상태 체크
function checkAuth() {
  const logged = JSON.parse(localStorage.getItem('grace_logged_in') || 'null');
  const authButtons = document.getElementById('auth-buttons');
  const userInfo = document.getElementById('user-info');
  const userName = document.getElementById('user-name');

  if (logged) {
    if (authButtons) authButtons.style.display = 'none';
    if (userInfo) userInfo.style.display = 'flex';
    if (userName) userName.textContent = logged.name + '님';
  } else {
    if (authButtons) authButtons.style.display = 'flex';
    if (userInfo) userInfo.style.display = 'none';
  }
}

// 로그아웃
function logout() {
  localStorage.removeItem('grace_logged_in');
  window.location.href = 'index.html';
}

// 초기 실행
updateCartCount();
checkAuth();
renderProducts();
renderCart();
