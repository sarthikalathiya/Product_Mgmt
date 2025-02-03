function initializeProducts() {
    // Sort by newest first initially
    currentSort.field = 'productId';
    currentSort.direction = 'desc';

    products.sort((a, b) => b.productId - a.productId);
    filteredProducts = [...products];
    displayProducts();
}

const IndexPage = {
   
    init() {
      
        productModal = new bootstrap.Modal(document.getElementById('productDetailsModal'));

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
            itemsPerPageSelect.addEventListener('change', function () {
                itemsPerPage = parseInt(this.value);
                currentPage = 1;
                displayProducts();
            });
        }

        initializeProducts();
    }
};