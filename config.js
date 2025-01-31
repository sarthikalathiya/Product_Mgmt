const AppConfig = {
    categories: [
        { id: 'electronics', label: 'Electronics' },
        { id: 'clothing', label: 'Clothing' },
        { id: 'books', label: 'Books' },
        { id: 'furniture', label: 'Furniture' }
    ],
    productTypes: [
        { id: 'retail', label: 'Retail' },
        { id: 'wholesale', label: 'Wholesale' }
    ],
    features: [
        { id: 'outOfStock', label: 'Out of Stock' },
        { id: 'freeShipping', label: 'Free Shipping' },
        { id: 'warranty', label: 'Has Warranty' }
    ],
    formFields: {
        productName: {
            type: 'text',
            label: 'Product Name',
            validation: {
                pattern: '^[a-zA-Z0-9\\s-]{3,50}$',
                required: true,
                errorMessage: 'Please enter a valid product name (3-50 characters, alphanumeric)'
            }
        },
        productImage: {
            type: 'file',
            label: 'Image',
            validation: {
                accept: 'image/png, image/jpeg, image/jpg',
                required: true,
                errorMessage: 'Please select a valid image file (PNG, JPEG, JPG)'
            }
        },
        price: {
            type: 'number',
            label: 'Price',
            validation: {
                min: 0.01,
                step: 0.01,
                required: true,
                errorMessage: 'Please enter a valid price'
            }
        },
        description: {
            type: 'textarea',
            label: 'Description',
            validation: {
                required: true,
                minLength: 10,
                maxLength: 500,
                errorMessage: 'Please enter a description (10-500 characters)'
            }
        },
        mfgDate: {
            type: 'date',
            label: 'Manufacturing Date',
            validation: {
                required: true,
                errorMessage: 'Please select a manufacturing date'
            }
        }
    }
};
