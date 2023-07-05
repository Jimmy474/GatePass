function SelectImage() {
    const imageInput = document.getElementById('imageInput');
    imageInput.click();
}

function changeImage() {
    const imageInput = document.getElementById('imageInput');
    const imageContainer = document.getElementById('imageContainer');
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.objectFit = 'contain';
            imageContainer.innerHTML = '';
            imageContainer.appendChild(img);
        };
        reader.readAsDataURL(file);

        // Create a FormData object to store the image file
        const formData = new FormData();
        formData.append('image', file);

        // Send the AJAX request to the Flask server
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Handle the server response
        })
        .catch(error => {
            console.error('Error:', error);
        });

    }
}

function Generate() {
    const indexForm = document.getElementById('form');
    if (indexForm) {
        indexForm.action = "/Pass";
        indexForm.method = "post";
        indexForm.submit();
    }
}