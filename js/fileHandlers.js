function validateFileInput(callback) {
    const fileInput = document.getElementById('productImage');
    const isEditMode = document.getElementById('productId')?.value; // Check if we're in edit mode

    if (!fileInput.files || fileInput.files.length === 0) {
        if (isEditMode) {
            // In edit mode, no file is OK
            fileInput.setCustomValidity('');
            callback(true);
            return;
        }
        // In create mode, file is required
        fileInput.setCustomValidity('Please select an image file');
        callback(false);
        return;
    }

    isValidImageFile(fileInput.files[0], (isValid) => {
        if (!isValid) {
            fileInput.setCustomValidity('Please select a valid image file (JPEG, PNG, GIF)');
            callback(false);
        } else {
            fileInput.setCustomValidity('');
            callback(true);
        }
    });
}

function isValidImageFile(file, callback) {
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const reader = new FileReader();
    reader.onloadend = function (e) {
        const arr = (new Uint8Array(e.target.result)).subarray(0, 4);
        let header = "";
        for (let i = 0; i < arr.length; i++) {
            header += arr[i].toString(16);
        }
        let mimeType;
        switch (header) {
            case "89504e47":
                mimeType = "image/png";
                break;
            case "47494638":
                mimeType = "image/gif";
                break;
            case "ffd8ffe0":
            case "ffd8ffe1":
            case "ffd8ffe2":
                mimeType = "image/jpeg";
                break;
            default:
                mimeType = "unknown";
                break;
        }
        callback(validMimeTypes.includes(mimeType));
    };
    reader.readAsArrayBuffer(file);
}