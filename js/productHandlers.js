function createProduct(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const form = document.getElementById('productForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

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
    const reader = new FileReader();
    reader.onload = function (e) {
        product.image = e.target.result;
        products.unshift(product);
        localStorage.setItem('products', JSON.stringify(products));
        window.location.replace('index.html');
    };
    reader.readAsDataURL(imageFile);
}

function updateProduct(event) {
    event.preventDefault();
    
    const form = document.getElementById('productForm');
    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    // Additional validation for category and type
    const category = document.getElementById('category');
    const typeSelected = document.querySelector('input[name="type"]:checked');
    
    if (!category.value) {
        category.setCustomValidity('Please select a category');
        form.classList.add('was-validated');
        return;
    }
    
    if (!typeSelected) {
        const typeContainer = document.querySelector('.type-container');
        const feedback = typeContainer.querySelector('.invalid-feedback');
        feedback.style.display = 'block';
        return;
    }

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
            reader.onload = function (e) {
                updatedProduct.image = e.target.result;
                products[productIndex] = updatedProduct;
                localStorage.setItem('products', JSON.stringify(products));
                window.location.replace('index.html'); 
            };
            reader.readAsDataURL(imageFile);
        } else {
            products[productIndex] = updatedProduct;
            localStorage.setItem('products', JSON.stringify(products));
            window.location.replace('index.html'); 
        }
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.productId !== productId);
        localStorage.setItem('products', JSON.stringify(products));

        filteredProducts = filteredProducts.filter(p => p.productId !== productId);

        const displayList = filteredProducts.length > 0 ? filteredProducts : products;
        const totalPages = Math.ceil(displayList.length / itemsPerPage);
        if (currentPage > totalPages) {
            currentPage = Math.max(1, totalPages);
        }

        displayProducts();
    }
}

function sortProducts(field) {
    
    if (currentSort.field === field) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.field = field;
        currentSort.direction = 'asc';
    }

    const listToSort = filteredProducts.length > 0 ? filteredProducts : products;

    listToSort.sort((a, b) => {
        let valueA = a[field];
        let valueB = b[field];

        // Handle numeric values
        if (field === 'price') {
            valueA = parseFloat(valueA);
            valueB = parseFloat(valueB);
        } else {
            // Handle string values
            valueA = String(valueA).toLowerCase();
            valueB = String(valueB).toLowerCase();
        }

        let comparison = 0;
        if (valueA < valueB) comparison = -1;
        if (valueA > valueB) comparison = 1;

        return currentSort.direction === 'asc' ? comparison : -comparison;
    });

    currentPage = 1;
    displayProducts();
}

function searchProduct() {
    
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
        const searchTerm = document.getElementById('searchInput').value.trim();
        const selectedCategory = document.getElementById('categoryFilter').value;

        filteredProducts = [...products];

        if (selectedCategory) {
            filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
        }

        if (searchTerm) {
            filteredProducts = filteredProducts.filter(p => {
                if (/^\d/.test(searchTerm)) {
                    return p.productId.includes(searchTerm);
                } else {
                    return p.productName.toLowerCase().includes(searchTerm.toLowerCase());
                }
            });
        }

        currentPage = 1;
        displayProducts(filteredProducts);
    }, 300);
}