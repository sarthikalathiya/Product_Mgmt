let products = JSON.parse(localStorage.getItem('products')) || [];

let currentSort = {
    field: null,
    direction: 'asc'
};

let currentPage = 1;
let itemsPerPage = 5;

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
    
    if (filteredProducts.length === 0) {
        currentPage = 1; // Reset to first page when no results
    }
    displayProducts(filteredProducts);
}

function displayProducts(productsToShow = products) {
    const tableBody = document.getElementById('productTableBody');
    const paginationControls = document.querySelector('.pagination-container');
    
    if (!tableBody) return;

    if (!productsToShow || productsToShow.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">
                    <div class="text-muted">No products found</div>
                </td>
            </tr>
        `;
        // Hide pagination controls
        if (paginationControls) {
            paginationControls.style.display = 'none';
        }
        return;
    }

    // Show pagination controls
    if (paginationControls) {
        paginationControls.style.display = 'block';
    }

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = productsToShow.slice(startIndex, endIndex);

    // Update current page display
    document.getElementById('currentPage').textContent = `Page ${currentPage}`;

    // Display paginated products
    tableBody.innerHTML = paginatedProducts.map(product => `
        <tr class="align-middle" style="height: 60px;">
            <td class="align-middle text-break" style="width: 15%">${product.productId}</td>
            <td class="align-middle text-break" style="width: 20%">${product.productName}</td>
            <td class="align-middle" style="width: 10%">
                <img src="${product.image}" alt="${product.productName}" 
                     class="img-thumbnail" 
                     style="width: 50px; height: 50px; object-fit: cover;">
            </td>
            <td class="align-middle" style="width: 10%">$${product.price.toFixed(2)}</td>
            <td class="align-middle text-break" style="width: 15%">${product.category}</td>
            <td class="align-middle" style="width: 10%">${product.type}</td>
            <td class="align-middle" style="width: 10%">${Object.entries(product.features)
                .filter(([, value]) => value)
                .map(([key]) => `<span class="badge bg-secondary">${key}</span>`)
                .join(' ')}</td>
            <td class="align-middle" style="width: 10%">
                <div class="btn-group btn-group-sm">
                    <a href="edit-product.html?id=${product.productId}" class="btn btn-outline-primary">Edit</a>
                    <button onclick="deleteProduct('${product.productId}')" class="btn btn-outline-danger">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');

    // Update pagination buttons state
    updatePaginationState(productsToShow.length);
}

function updatePaginationState(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const prevButton = document.querySelector('.page-item:first-child');
    const nextButton = document.querySelector('.page-item:last-child');

    prevButton.classList.toggle('disabled', currentPage === 1);
    nextButton.classList.toggle('disabled', currentPage === totalPages);
}

function changePage(direction) {
    if (!products || products.length === 0) return;
    
    const totalPages = Math.ceil(products.length / itemsPerPage);
    
    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
    }

    displayProducts();
}

function generateFormFields(formElement, isEdit = false) {
    const dynamicFields = document.getElementById('dynamicFields');
    if (!dynamicFields) return;

    Object.entries(CONFIG.formFields).forEach(([fieldId, field]) => {
        const div = document.createElement('div');
        div.className = 'mb-3';
        
        const label = document.createElement('label');
        label.className = 'form-label';
        label.htmlFor = fieldId;
        label.textContent = field.label;
        
        let input;
        if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = 3;
        } else {
            input = document.createElement('input');
            input.type = field.type;
        }
        
        input.className = 'form-control';
        input.id = fieldId;
        Object.entries(field.validation).forEach(([key, value]) => {
            if (key !== 'errorMessage') input[key] = value;
        });
        
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = field.validation.errorMessage;
        
        div.appendChild(label);
        div.appendChild(input);
        div.appendChild(feedback);
        dynamicFields.appendChild(div);
    });
}

function generateCategoryDropdown(selectElement) {
    const options = CONFIG.categories.map(cat => 
        `<option value="${cat.id}">${cat.label}</option>`
    ).join('');
    
    selectElement.innerHTML = `
        <option value="">Select a category</option>
        ${options}
    `;
}

function generateTypeRadios(container) {
    container.innerHTML = CONFIG.productTypes.map(type => `
        <div class="mb-2">
            <input type="radio" class="form-check-input" 
                   name="type" value="${type.id}" required>
            <label class="form-check-label">${type.label}</label>
        </div>
    `).join('');
}

function generateFeatureCheckboxes(container) {
    container.innerHTML = CONFIG.features.map(feature => `
        <div class="mb-2">
            <input type="checkbox" class="form-check-input" id="${feature.id}">
            <label class="form-check-label">${feature.label}</label>
        </div>
    `).join('');
}

// Add event listeners for real-time search
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (categoryFilter) {
        generateCategoryDropdown(categoryFilter);
    }
    
    const form = document.getElementById('productForm');
    if (form) {
        const categorySelect = document.getElementById('category');
        if (categorySelect) {
            generateCategoryDropdown(categorySelect);
        }
        
        generateFormFields(form, window.location.pathname.includes('edit-product'));
        
        const typeContainer = document.querySelector('.type-container');
        if (typeContainer) generateTypeRadios(typeContainer);
        
        const featuresContainer = document.querySelector('.features-container');
        if (featuresContainer) generateFeatureCheckboxes(featuresContainer);
    }
    
    if (searchInput && categoryFilter) {
        searchInput.addEventListener('input', searchProduct);
        categoryFilter.addEventListener('change', searchProduct);
    }

    // Add items per page change handler
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', function() {
            itemsPerPage = parseInt(this.value);
            currentPage = 1; // Reset to first page
            displayProducts();
        });
    }
});

function sortProducts(field) {
    // If clicking the same field, toggle direction
    if (currentSort.field === field) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        // If clicking new field, default to ascending
        currentSort.field = field;
        currentSort.direction = 'asc';
    }

    products.sort((a, b) => {
        let comparison = 0;
        if (a[field] < b[field]) comparison = -1;
        if (a[field] > b[field]) comparison = 1;
        
        // Reverse if descending
        return currentSort.direction === 'asc' ? comparison : -comparison;
    });

    // Update sort indicators in UI
    updateSortIndicators();
    currentPage = 1; // Reset to first page when sorting
    displayProducts();
}

function updateSortIndicators() {
    // Remove all existing indicators
    document.querySelectorAll('th').forEach(th => {
        th.textContent = th.textContent.replace(' ↑', '').replace(' ↓', '');
    });
    
    // Add indicator to current sort column
    if (currentSort.field) {
        const th = document.querySelector(`th[onclick="sortProducts('${currentSort.field}')"]`);
        if (th) {
            th.textContent += currentSort.direction === 'asc' ? ' ↑' : ' ↓';
        }
    }
}

// Update the edit product initialization
if (window.location.pathname.includes('edit-product.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = products.find(p => p.productId === productId);
    
    if (product) {
        // Special handling for hidden productId
        document.getElementById('productId').value = product.productId;
        
        // Set values for dynamically generated fields
        Object.keys(CONFIG.formFields).forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                if (fieldId === 'productImage') {
                    // Handle image preview
                    const preview = document.createElement('img');
                    preview.src = product.image;
                    preview.className = 'mt-2';
                    preview.style.maxWidth = '200px';
                    element.parentNode.appendChild(preview);
                } else {
                    element.value = product[fieldId];
                }
            }
        });

        // Set radio button for type
        const typeRadio = document.querySelector(`input[name="type"][value="${product.type}"]`);
        if (typeRadio) typeRadio.checked = true;

        // Set checkboxes for features
        Object.entries(product.features).forEach(([key, value]) => {
            const checkbox = document.getElementById(key);
            if (checkbox) checkbox.checked = value;
        });
    }
} else if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    displayProducts();
}
