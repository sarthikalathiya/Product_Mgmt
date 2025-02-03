function generateFormFields(formElement, isEdit = false, callback) {
  
    const dynamicFields = document.getElementById('dynamicFields');
    if (!dynamicFields) return;

    dynamicFields.innerHTML = '';

    Object.entries(AppConfig.formFields).forEach(([fieldId, fieldConfig]) => {
        const div = document.createElement('div');
        div.className = 'mb-3';

        const label = document.createElement('label');
        label.className = 'form-label';
        label.htmlFor = fieldId;
        label.textContent = fieldConfig.label;

        let input;
        if (fieldConfig.type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = 3;
        } else {
            input = document.createElement('input');
            input.type = fieldConfig.type;
        }

        input.className = 'form-control';
        input.id = fieldId;

        // Apply validation attributes
        if (fieldConfig.validation) {
            if (fieldConfig.validation.required) input.required = true;
            if (fieldConfig.validation.pattern) input.pattern = fieldConfig.validation.pattern;
            if (fieldConfig.validation.min) input.min = fieldConfig.validation.min;
            if (fieldConfig.validation.step) input.step = fieldConfig.validation.step;
            if (fieldConfig.validation.accept) input.accept = fieldConfig.validation.accept;
            if (fieldConfig.validation.minLength) input.minLength = fieldConfig.validation.minLength;
            if (fieldConfig.validation.maxLength) input.maxLength = fieldConfig.validation.maxLength;
            if (fieldConfig.validation.max) input.max = fieldConfig.validation.max;
        }

        if (fieldConfig.type === 'file') {
            input.addEventListener('change', function() {
                validateFileInput();
            });
        }

        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = fieldConfig.validation?.errorMessage || `Please provide a valid ${fieldConfig.label.toLowerCase()}`;

        div.appendChild(label);
        div.appendChild(input);
        div.appendChild(feedback);
        dynamicFields.appendChild(div);
    });

    if (callback) callback();
}

function generateCategoryDropdown(selectElement) {
    const options = AppConfig.categories.map(cat =>
        `<option value="${cat.id}">${cat.label}</option>`
    ).join('');

    selectElement.innerHTML = `
        <option value="">Select a category</option>
        ${options}
    `;
}

function generateTypeRadios(container) {
   
    container.innerHTML = AppConfig.productTypes.map(type => `
        <div class="mb-2">
            <input type="radio" class="form-check-input" 
                   name="type" value="${type.id}" required>
            <label class="form-check-label">${type.label}</label>
        </div>
    `).join('');
}

function generateFeatureCheckboxes(container) { container.innerHTML = AppConfig.features.map(feature => `
    <div class="mb-2">
        <input type="checkbox" class="form-check-input" id="${feature.id}">
        <label class="form-check-label">${feature.label}</label>
    </div>
`).join('');
}