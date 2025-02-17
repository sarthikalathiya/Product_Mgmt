// Register pages
PageController.register('index.html', () => IndexPage.init());
PageController.register('editProduct.html', () => EditPage.init());
PageController.register('createProduct.html', () => CreatePage.init());

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => PageController.init());