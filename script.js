let products = JSON.parse(localStorage.getItem('products')) || [];
let filteredProducts = [];
let searchTimeout = null;

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
        reader.onload = function (e) {
            product.image = e.target.result;
            products.unshift(product);
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
            reader.onload = function (e) {
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
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(() => {
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

function displayProducts(productsToShow = null) {
    const tableBody = document.getElementById('productTableBody');
    const paginationControls = document.querySelector('.pagination-container');

    if (!tableBody) return;

    const displayList = productsToShow || filteredProducts.length > 0 ? filteredProducts : products;

    if (!displayList || displayList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">
                    <div class="text-muted">No products found</div>
                </td>
            </tr>
        `;
        if (paginationControls) {
            paginationControls.style.display = 'none';
        }
        return;
    }

    if (paginationControls) {
        paginationControls.style.display = 'block';
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = displayList.slice(startIndex, endIndex);

    document.getElementById('currentPage').textContent = `Page ${currentPage}`;

    tableBody.innerHTML = paginatedProducts.map(product => `
        <tr class="align-middle" style="height: 60px;">
            <td class="align-middle text-break" style="width: 15%">${product.productId}</td>
            <td class="align-middle text-break" style="width: 20%">${product.productName}</td>
            <td class="align-middle" style="width: 10%">
                <img src="${product.image}" alt="${product.productName}" 
                     class="img-thumbnail" 
                     style="width: 50px; height: 50px; object-fit: cover;">
            </td>
            <td class="align-middle" style="width: 10%">&#8377;${product.price.toFixed(2)}</td>
            <td class="align-middle text-break" style="width: 15%">${product.category}</td>
            <td class="align-middle" style="width: 10%">${product.type}</td>
            <td class="align-middle" style="width: 10%">${Object.entries(product.features)
            .filter(([, value]) => value)
            .map(([key]) => `<span class="badge bg-secondary">${key}</span>`).join(' ')}</td>
            <td class="align-middle" style="width: 10%">
                <div class="btn-group btn-group-sm">
                    <a href="edit-product.html?id=${product.productId}" class="btn btn-outline-primary">Edit</a>
                    <button onclick="deleteProduct('${product.productId}')" class="btn btn-outline-danger">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');

    updatePaginationState(displayList.length);
}

function updatePaginationState(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const prevButton = document.querySelector('.page-item:first-child');
    const nextButton = document.querySelector('.page-item:last-child');

    prevButton.classList.toggle('disabled', currentPage === 1);
    nextButton.classList.toggle('disabled', currentPage === totalPages);
}

function changePage(direction) {
    const displayList = filteredProducts.length > 0 ? filteredProducts : products;
    
    if (!displayList || displayList.length === 0) return;

    const totalPages = Math.ceil(displayList.length / itemsPerPage);

    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
    }

    displayProducts();
}

function generateFormFields(formElement, isEdit = false, callback) {
    const dynamicFields = document.getElementById('dynamicFields');
    if (!dynamicFields) return;

    dynamicFields.innerHTML = '';

    const fields = [
        { id: 'productName', label: 'Product Name', type: 'text', required: true },
        { id: 'productImage', label: 'Product Image', type: 'file', accept: 'image/*' },
        { id: 'price', label: 'Price', type: 'number', required: true, step: '0.01' },
        { id: 'description', label: 'Description', type: 'textarea', required: true },
        { id: 'mfgDate', label: 'Manufacturing Date', type: 'date', required: true }
    ];

    fields.forEach(field => {
        const div = document.createElement('div');
        div.className = 'mb-3';

        const label = document.createElement('label');
        label.className = 'form-label';
        label.htmlFor = field.id;
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
        input.id = field.id;
        if (field.required) input.required = true;
        if (field.step) input.step = field.step;
        if (field.accept) input.accept = field.accept;

        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = `Please provide a valid ${field.label.toLowerCase()}`;

        div.appendChild(label);
        div.appendChild(input);
        div.appendChild(feedback);
        dynamicFields.appendChild(div);
    });

    if (callback) callback();
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

function initializeProducts() {
    // Sort by newest first initially
    currentSort.field = 'productId';
    currentSort.direction = 'desc';
    
    products.sort((a, b) => b.productId - a.productId);
    filteredProducts = [...products];
    displayProducts();
}

const PageController = {
    pages: {},

    register(pageName, initFunction) {
        this.pages[pageName] = initFunction;
    },

    init() {
        const pagePath = window.location.pathname;
        const pageName = pagePath.split('/').pop() || 'index.html';
        
        if (this.pages[pageName]) {
            this.pages[pageName]();
        }
    }
};

// Index page controller
const IndexPage = {
    init() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');

        if (categoryFilter) {
            generateCategoryDropdown(categoryFilter);
        }

        if (searchInput && categoryFilter) {
            searchInput.addEventListener('input', searchProduct);
            categoryFilter.addEventListener('change', searchProduct);
        }

        const itemsPerPageSelect = document.getElementById('itemsPerPage');
        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', function() {
                itemsPerPage = parseInt(this.value);
                currentPage = 1;
                displayProducts();
            });
        }

        initializeProducts();
    }
};

// Edit page controller
const EditPage = {
    init() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const product = products.find(p => p.productId === productId);
        
        if (product) {
            this.initializeForm(product);
        }
    },

    initializeForm(product) {
        generateFormFields(document.getElementById('productForm'), true, () => {
            document.getElementById('productId').value = product.productId;
            document.getElementById('productName').value = product.productName;
            document.getElementById('price').value = product.price;
            document.getElementById('description').value = product.description;
            document.getElementById('mfgDate').value = product.mfgDate;

            this.setupImagePreview(product);
            this.setupFormElements(product);
        });
    },

    setupImagePreview(product) {
        const imageInput = document.getElementById('productImage');
        if (imageInput && product.image) {
            const previewContainer = document.createElement('div');
            previewContainer.className = 'mt-2';
            const preview = document.createElement('img');
            preview.src = product.image;
            preview.className = 'img-thumbnail';
            preview.style.maxWidth = '200px';
            imageInput.parentNode.appendChild(previewContainer);
            previewContainer.appendChild(preview);
        }
    },

    setupFormElements(product) {
        const categorySelect = document.getElementById('category');
        if (categorySelect) {
            generateCategoryDropdown(categorySelect);
            categorySelect.value = product.category;
        }

        const typeContainer = document.querySelector('.type-container');
        if (typeContainer) {
            generateTypeRadios(typeContainer);
            const typeRadio = document.querySelector(`input[name="type"][value="${product.type}"]`);
            if (typeRadio) typeRadio.checked = true;
        }

        const featuresContainer = document.querySelector('.features-container');
        if (featuresContainer) {
            generateFeatureCheckboxes(featuresContainer);
            Object.entries(product.features).forEach(([key, value]) => {
                const checkbox = document.getElementById(key);
                if (checkbox) checkbox.checked = value;
            });
        }
    }
};

// Create page controller
const CreatePage = {
    init() {
        const form = document.getElementById('productForm');
        if (form) {
            const categorySelect = document.getElementById('category');
            if (categorySelect) {
                generateCategoryDropdown(categorySelect);
            }

            generateFormFields(form, false);

            const typeContainer = document.querySelector('.type-container');
            if (typeContainer) generateTypeRadios(typeContainer);

            const featuresContainer = document.querySelector('.features-container');
            if (featuresContainer) generateFeatureCheckboxes(featuresContainer);
        }
    }
};

// Register pages
PageController.register('index.html', () => IndexPage.init());
PageController.register('edit-product.html', () => EditPage.init());
PageController.register('create-product.html', () => CreatePage.init());

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => PageController.init());
