let products = JSON.parse(localStorage.getItem('products')) || [];

function generateProductId() {
    return Date.now().toString();
}

function createProduct(event) {
    event.preventDefault();
    const product = {
        productId: generateProductId(),
        productName: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('price').value),
        description: document.getElementById('description').value,
        mfgDate: document.getElementById('mfgDate').value,
        category: document.getElementById('category').value,
        type: document.querySelector('input[name="type"]:checked').value,
        features: {
            outOfStock: document.getElementById('outOfStock').checked,
            freeShipping: document.getElementById('freeShipping').checked,
            warranty: document.getElementById('warranty').checked
        }
    };

    const imageFile = document.getElementById('productImage').files[0];
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            product.image = e.target.result;
            products.push(product);
            localStorage.setItem('products', JSON.stringify(products));
            window.location.href = 'index.html';
        };
        reader.readAsDataURL(imageFile);
    }
}

function updateProduct(event) {
    event.preventDefault();
    const productId = document.getElementById('productId').value;
    const productIndex = products.findIndex(p => p.productId === productId);
    
    if (productIndex !== -1) {
        const updatedProduct = {
            ...products[productIndex],
            productName: document.getElementById('productName').value,
            price: parseFloat(document.getElementById('price').value),
            description: document.getElementById('description').value,
            mfgDate: document.getElementById('mfgDate').value,
            category: document.getElementById('category').value,
            type: document.querySelector('input[name="type"]:checked').value,
            features: {
                outOfStock: document.getElementById('outOfStock').checked,
                freeShipping: document.getElementById('freeShipping').checked,
                warranty: document.getElementById('warranty').checked
            }
        };

        const imageFile = document.getElementById('productImage').files[0];
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                updatedProduct.image = e.target.result;
                products[productIndex] = updatedProduct;
                localStorage.setItem('products', JSON.stringify(products));
                window.location.href = 'index.html';
            };
            reader.readAsDataURL(imageFile);
        } else {
            products[productIndex] = updatedProduct;
            localStorage.setItem('products', JSON.stringify(products));
            window.location.href = 'index.html';
        }
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.productId !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts();
    }
}

function searchProduct() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const selectedCategory = document.getElementById('categoryFilter').value;
    
    let filteredProducts = products;
    
    // Apply category filter if selected
    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
    }
    
    // Apply search term filter
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => {
            if (/^\d/.test(searchTerm)) {
                // If search term starts with a digit, search by ID
                return p.productId.includes(searchTerm);
            } else {
                // If search term starts with a letter, search by name
                return p.productName.toLowerCase().includes(searchTerm.toLowerCase());
            }
        });
    }
    
    displayProducts(filteredProducts);
}

function displayProducts(productsToShow = products) {
    const tableBody = document.getElementById('productTableBody');
    if (!tableBody) return;

    if (productsToShow.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">
                    <div class="text-muted">No products found</div>
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = productsToShow.map(product => `
        <tr>
            <td>${product.productId}</td>
            <td>${product.productName}</td>
            <td><img src="${product.image}" alt="${product.productName}" class="img-thumbnail" style="max-width: 50px"></td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.category}</td>
            <td>${product.type}</td>
            <td>${Object.entries(product.features)
                .filter(([, value]) => value)
                .map(([key]) => `<span class="badge bg-secondary">${key}</span>`)
                .join(' ')}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <a href="edit-product.html?id=${product.productId}" class="btn btn-outline-primary">Edit</a>
                    <button onclick="deleteProduct('${product.productId}')" class="btn btn-outline-danger">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Add event listeners for real-time search
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (searchInput && categoryFilter) {
        searchInput.addEventListener('input', searchProduct);
        categoryFilter.addEventListener('change', searchProduct);
    }
});

function sortProducts(field) {
    products.sort((a, b) => {
        if (a[field] < b[field]) return -1;
        if (a[field] > b[field]) return 1;
        return 0;
    });
    displayProducts();
}

// Initialize page
if (window.location.pathname.includes('edit-product.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = products.find(p => p.productId === productId);
    if (product) {
        document.getElementById('productId').value = product.productId;
        document.getElementById('productName').value = product.productName;
        document.getElementById('price').value = product.price;
        document.getElementById('description').value = product.description;
        document.getElementById('mfgDate').value = product.mfgDate;
        document.getElementById('category').value = product.category;
        document.querySelector(`input[name="type"][value="${product.type}"]`).checked = true;
        document.getElementById('outOfStock').checked = product.features.outOfStock;
        document.getElementById('freeShipping').checked = product.features.freeShipping;
        document.getElementById('warranty').checked = product.features.warranty;
        document.getElementById('currentImage').src = product.image;
    }
} else if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    displayProducts();
}
