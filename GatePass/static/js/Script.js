let imageUploaded = false;

function SelectImage() {
    const imageInput = document.getElementById('imageInput');
    imageInput.click();
}

function changeImage() {
    const imageInput = document.getElementById('imageInput');
    const imageContainer = document.getElementById('imageContainer');
    const file = imageInput.files[0];

    //console.dir(imageInput.files[0]);
    //if (imageInput.files[0].type.indexOf("image/") > -1) {
    //    let img = document.createElement('img');
    //    img.src = window.URL.createObjectURL(imageInput.files[0]);
    //    img.style.maxWidth = '100%';
    //    img.style.maxHeight = '100%';
    //    img.style.objectFit = 'contain';
    //    imageContainer.innerHTML = '';
    //    imageContainer.appendChild(img);
    //}

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.objectFit = 'contain';
            img.style.alignContent = 'Center';
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

    var name = document.getElementById("visitor_name");
    var comingFrom = document.getElementById("coming_from");
    var adhar = document.getElementById("adhar_number");
    var mobileNum = document.getElementById("mobile_number");
    var mobileToken = document.getElementById("token_number");
    var helmet = document.getElementById("helmet_number");
    var requestedName = document.getElementById("requested_person");
    var purpose = document.getElementsByName("purpose");

    const namePattern = /^[A-Za-z\s]+$/;
    const mobilePattern = new RegExp(`^[0-9]{10}$`);
    const adharPattern = /^\d{4} \d{4} \d{4}$/;
    const numberPattern = /^[0-9]+$/;

    const imageInput = document.getElementById('imageInput');
    const file = imageInput.files[0];

    if (!file) {
        alert('No image selected. Please choose an image file.');
        return;
    }

    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSizeInBytes = 3 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
        alert('Invalid image type. Please choose a JPEG or PNG image.');
        return;
    }

    if (file.size > maxSizeInBytes) {
        alert('Image file size is too large. Please choose a smaller image.');
        return;
    }

    if (name.value.trim() === '') {
        alert("Enter Your Name");
        name.focus();
        return;
    } else if (!namePattern.test(name.value.trim())) {
        alert("Enter Valid Name");
        name.focus();
        return;
    }

    if (comingFrom.value.trim() === '') {
        alert("Enter Place");
        comingFrom.focus();
        return;
    }

    if (adhar.value.trim() === '') {
        alert("Enter Your Adhar Card Number");
        adhar.focus();
        return;
    } else if (!adharPattern.test(adhar.value.trim())) {
        alert("Enter Valid Adhar Card Number");
        adhar.focus();
        return;
    }

    if (mobileNum.value.trim() === '') {
        alert("Enter Your Mobile Number");
        mobileNum.focus();
        return;
    } else if (!mobilePattern.test(mobileNum.value.trim())) {
        alert("Enter Valid Mobile Number");
        mobileNum.focus();
        return;
    }

    if (mobileToken.value.trim() === '') {
        alert("Enter Your Mobile Token Number");
        mobileToken.focus();
        return;
    } else if (!numberPattern.test(mobileToken.value.trim())) {
        alert("Enter Valid Mobile Token Number");
        mobileToken.focus();
        return;
    }

    if (helmet.value.trim() === '') {
        alert("Enter Your Helmet Number");
        helmet.focus();
        return;
    } else if (!numberPattern.test(helmet.value.trim())) {
        alert("Enter Valid Helmet Number");
        helmet.focus();
        return;
    }

    if (requestedName.value.trim() === '') {
        alert("Enter Requested Person's Name");
        requestedName.focus();
        return;
    } else if (!namePattern.test(requestedName.value.trim())) {
        alert("Enter Valid Name");
        requestedName.focus();
        return;
    }

    let selectedOption = false;

    for (let i = 0; i < purpose.length; i++) {
        if (purpose[i].checked) {
            selectedOption = true;
            break;
        }
    }

    if (!selectedOption) {
        alert("Select Your Purpose Of Visit");
        return;
    }

    console.log("Everything is Valid!");

    GatherData();
}
