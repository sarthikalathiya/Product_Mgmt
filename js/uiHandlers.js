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

    tableBody.innerHTML = "";

    paginatedProducts.forEach(product => {
        const row = document.createElement("tr");
        row.className = "align-middle product-row";
        row.style.height = "60px";
        row.style.cursor = "pointer";
        row.onclick = () => showProductDetails(product.productId);

        const productIdTd = document.createElement("td");
        productIdTd.className = "align-middle text-break";
        productIdTd.style.width = "15%";
        productIdTd.textContent = product.productId;
        row.appendChild(productIdTd);

        const productNameTd = document.createElement("td");
        productNameTd.className = "align-middle text-break";
        productNameTd.style.width = "20%";
        productNameTd.textContent = product.productName;
        row.appendChild(productNameTd);

        const productImageTd = document.createElement("td");
        productImageTd.className = "align-middle";
        productImageTd.style.width = "10%";
        const productImage = document.createElement("img");
        productImage.src = product.image;
        productImage.alt = product.productName;
        productImage.className = "img-thumbnail";
        productImage.style.width = "50px";
        productImage.style.height = "50px";
        productImage.style.objectFit = "cover";
        productImageTd.appendChild(productImage);
        row.appendChild(productImageTd);

        const productPriceTd = document.createElement("td");
        productPriceTd.className = "align-middle";
        productPriceTd.style.width = "10%";
        productPriceTd.innerHTML = `&#8377;${product.price.toFixed(2)}`;
        row.appendChild(productPriceTd);

        const productCategoryTd = document.createElement("td");
        productCategoryTd.className = "align-middle text-break";
        productCategoryTd.style.width = "15%";
        productCategoryTd.textContent = product.category;
        row.appendChild(productCategoryTd);

        const productTypeTd = document.createElement("td");
        productTypeTd.className = "align-middle";
        productTypeTd.style.width = "10%";
        productTypeTd.textContent = product.type;
        row.appendChild(productTypeTd);

        const productFeaturesTd = document.createElement("td");
        productFeaturesTd.className = "align-middle";
        productFeaturesTd.style.width = "10%";
        productFeaturesTd.innerHTML = Object.entries(product.features)
            .filter(([, value]) => value)
            .map(([key]) => `<span class="badge bg-secondary">${key}</span>`).join(' ');
        row.appendChild(productFeaturesTd);

        const actionsTd = document.createElement("td");
        actionsTd.className = "align-middle";
        actionsTd.style.width = "10%";
        actionsTd.onclick = (e) => e.stopPropagation();

        const btnGroup = document.createElement("div");
        btnGroup.className = "btn-group btn-group-sm";

        const editLink = document.createElement("a");
        editLink.href = `edit-product.html?id=${product.productId}`;
        editLink.className = "btn btn-outline-primary";
        editLink.textContent = "Edit";
        btnGroup.appendChild(editLink);

        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-outline-danger";
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteProduct(product.productId);
        btnGroup.appendChild(deleteButton);

        actionsTd.appendChild(btnGroup);
        row.appendChild(actionsTd);

        tableBody.appendChild(row);
    });

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

function showProductDetails(productId) {
    
    const product = products.find(p => p.productId === productId);
    if (!product) return;

    const formattedDate = new Date(product.mfgDate).toLocaleDateString();
    const features = Object.entries(product.features)
        .filter(([, value]) => value)
        .map(([key]) => `<span class="badge bg-secondary me-1">${key}</span>`)
        .join('');

    const content = document.getElementById('productDetailsContent');
    content.innerHTML = "";

    const rowDiv = document.createElement('div');
    rowDiv.className = 'row g-3';

    const imageColDiv = document.createElement('div');
    imageColDiv.className = 'col-md-4 text-center';
    const productImage = document.createElement('img');
    productImage.src = product.image;
    productImage.alt = product.productName;
    productImage.className = 'img-fluid rounded mb-3';
    productImage.style.maxHeight = '200px';
    productImage.style.objectFit = 'contain';
    imageColDiv.appendChild(productImage);
    rowDiv.appendChild(imageColDiv);

    const infoColDiv = document.createElement('div');
    infoColDiv.className = 'col-md-8';
    const infoTable = document.createElement('table');
    infoTable.className = 'table table-borderless product-table mb-0';
    const tbody = document.createElement('tbody');

    const rows = [
        { label: 'Product ID:', value: product.productId },
        { label: 'Product Name:', value: product.productName },
        { label: 'Price:', value: `₹${product.price.toFixed(2)}` },
        { label: 'Category:', value: product.category },
        { label: 'Type:', value: product.type },
        { label: 'Mfg. Date:', value: formattedDate },
        { label: 'Features:', value: features },
        { label: 'Description:', value: product.description }
    ];

    rows.forEach(row => {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.style.width = '150px';
        th.textContent = row.label;
        const td = document.createElement('td');
        td.innerHTML = row.value;
        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr);
    });

    infoTable.appendChild(tbody);
    infoColDiv.appendChild(infoTable);
    rowDiv.appendChild(infoColDiv);

    content.appendChild(rowDiv);

    productModal.show();
}