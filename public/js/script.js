// Toggle Waxing Options Based on User Selection (Works for Both Pages)
function toggleWaxingOptions() {
    const waxingYes = document.getElementById("waxingYes");
    const waxingNo = document.getElementById("waxingNo");
    const waxingDropdown = document.getElementById("getsWaxing");
    const waxingOptions = document.getElementById("waxingOptions");

    if (!waxingOptions) return; // Exit if the element doesn't exist

    // Check if we're using radio buttons (Edit Page) or a dropdown (New Page)
    if (waxingYes && waxingNo) {
        // Handling for Edit Page (Radio Buttons)
        if (waxingYes.checked) {
            waxingOptions.style.display = "block";
        } else {
            waxingOptions.style.display = "none";
        }
    } else if (waxingDropdown) {
        // Handling for New Page (Dropdown)
        if (waxingDropdown.value === "true") {
            waxingOptions.style.display = "block";
        } else {
            waxingOptions.style.display = "none";
        }
    }
}

// Ensure this script runs only when the page is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    toggleWaxingOptions(); // Initialize state on page load

    // Attach event listeners for the Edit Page (Radio Buttons)
    const waxingYes = document.getElementById("waxingYes");
    const waxingNo = document.getElementById("waxingNo");

    if (waxingYes && waxingNo) {
        waxingYes.addEventListener("change", toggleWaxingOptions);
        waxingNo.addEventListener("change", toggleWaxingOptions);
    }

    // Attach event listener for the New Page (Dropdown)
    const waxingDropdown = document.getElementById("getsWaxing");
    if (waxingDropdown) {
        waxingDropdown.addEventListener("change", toggleWaxingOptions);
    }
});


// // Image preview before upload
// document.addEventListener("DOMContentLoaded", function () {
//     const fileInput = document.getElementById("profilePhotoInput");
//     const previewImage = document.getElementById("profilePhotoPreview");

//     if (fileInput && previewImage) {
//         fileInput.addEventListener("change", function (event) {
//             const file = event.target.files[0];
//             if (file) {
//                 const reader = new FileReader();
//                 reader.onload = function (e) {
//                     previewImage.src = e.target.result;
//                 };
//                 reader.readAsDataURL(file);
//             }
//         });
//     }
// });







