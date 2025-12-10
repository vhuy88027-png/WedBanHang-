console.log("Garage Bác Sĩ Xe - Website Loaded");

// Toggle Customer Type (Retail/Wholesale)
const customerBtns = document.querySelectorAll('.customer-toggle .btn');

customerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        customerBtns.forEach(b => b.classList.remove('active'));
        // Add active to clicked
        btn.classList.add('active');

        const type = btn.getAttribute('data-type');
        console.log("Switched to customer type:", type);

        // Mock notification
        if (type === 'wholesale') {
            alert("Bạn đang xem chế độ Nhà Buôn / Đại Lý. Giá hiển thị là giá sỉ.");
        }
    });
});

// Smooth Scrolling for Anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Product Filtering Logic (Advanced)
const products = document.querySelectorAll('.product-card');
const engineRadios = document.querySelectorAll('input[name="engine"]');
const priceMinInput = document.getElementById('price-min');
const priceMaxInput = document.getElementById('price-max');
const priceValueLabel = document.getElementById('price-value');

function formatCurrency(val) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
}

function filterProducts() {
    // 1. Engine
    let selectedEngine = 'gas';
    engineRadios.forEach(radio => {
        if (radio.checked) selectedEngine = radio.value;
    });

    // 2. Price Range (Dual Slider)
    // Ensure min <= max visually (logic below just grabs values)
    const minVal = parseInt(priceMinInput.value);
    const maxVal = parseInt(priceMaxInput.value);

    // Update Label
    priceValueLabel.textContent = `${formatCurrency(Math.min(minVal, maxVal))} - ${formatCurrency(Math.max(minVal, maxVal))}`;

    const realMin = Math.min(minVal, maxVal);
    const realMax = Math.max(minVal, maxVal);

    let hasProducts = false;

    products.forEach(product => {
        const productEngine = product.getAttribute('data-engine');
        const productPrice = parseInt(product.getAttribute('data-price'));

        let engineMatch = (productEngine === selectedEngine);
        let priceMatch = (productPrice >= realMin && productPrice <= realMax);

        if (engineMatch && priceMatch) {
            product.style.display = 'block';
            product.style.animation = 'fadeIn 0.5s ease';
            hasProducts = true;
        } else {
            product.style.display = 'none';
        }
    });

    // (Optional) Empty State handling could go here
    // if(!hasProducts) showNoProductsMessage();
}

// Slider Events
if (priceMinInput && priceMaxInput) {
    [priceMinInput, priceMaxInput].forEach(input => {
        input.addEventListener('input', filterProducts);
    });
}
engineRadios.forEach(radio => radio.addEventListener('change', filterProducts));

// Hamburger Menu
const hamburgerBtn = document.querySelector('.hamburger-btn');
const mainNav = document.querySelector('.main-nav');

if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        // Change icon?
        const icon = hamburgerBtn.querySelector('i');
        if (mainNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
}

// Close nav when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (mainNav && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            if (hamburgerBtn) {
                hamburgerBtn.querySelector('i').classList.remove('fa-xmark');
                hamburgerBtn.querySelector('i').classList.add('fa-bars');
            }
        }
    });
});

// Toast Notification
function showToast(message) {
    // Check if existing toast
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> <span>${message}</span>`;
        document.body.appendChild(toast);
    } else {
        toast.querySelector('span').textContent = message;
    }

    // Trigger Reflow
    void toast.offsetWidth;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Add to Cart Buttons
document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        showToast("Đã thêm sản phẩm vào giỏ!");
    });
});

// Testimonial Carousel (Auto Scroll - Simple clone append logic or transform)
const track = document.querySelector('.testimonial-track');
if (track) {
    // Clone items for infinite effect
    const cards = document.querySelectorAll('.testimonial-card');
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    let position = 0;
    function autoScroll() {
        position -= 0.5; // speed
        // Reset when first set is gone (width approx 300 + gap 32 * 3 items ~ 1000px)
        // Better way: check width
        const cardWidth = 332; // 300 + 32 gap
        const totalWidth = cards.length * cardWidth;

        if (Math.abs(position) >= totalWidth) {
            position = 0;
        }

        track.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(autoScroll);
    }
    autoScroll();
}

// Initialize filter on load
if (products.length > 0) {
    filterProducts();
}

// Add fade animation style dynamically
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
