// Register pages
PageController.register('index.html', () => IndexPage.init());
PageController.register('edit-product.html', () => EditPage.init());
PageController.register('create-product.html', () => CreatePage.init());

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => PageController.init());