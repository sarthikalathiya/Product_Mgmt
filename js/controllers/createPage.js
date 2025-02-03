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