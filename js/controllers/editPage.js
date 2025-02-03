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
        if (imageInput) {
            // Create preview container if it doesn't exist
            let previewContainer = imageInput.parentNode.querySelector('.preview-container');
            if (!previewContainer) {
                previewContainer = document.createElement('div');
                previewContainer.className = 'preview-container mt-2';
                const preview = document.createElement('img');
                preview.className = 'img-thumbnail';
                preview.style.maxWidth = '200px';
                previewContainer.appendChild(preview);
                imageInput.parentNode.appendChild(previewContainer);
            }

            // Set initial preview if product has image
            const preview = previewContainer.querySelector('img');
            if (preview && product.image) {
                preview.src = product.image;
            }
        }
    },

    setupFormElements(product) {
        const imageInput = document.getElementById('productImage');
        const categorySelect = document.getElementById('category');
        if (imageInput) {
            imageInput.required = false;

            imageInput.addEventListener('change', function () {
                const previewContainer = this.parentNode.querySelector('.preview-container');
                const preview = previewContainer ? previewContainer.querySelector('img') : null;
                
                if (preview && this.files && this.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        preview.src = e.target.result;
                    };
                    reader.readAsDataURL(this.files[0]);
                }
            });
        }

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