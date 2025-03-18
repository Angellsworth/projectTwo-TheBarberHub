const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // ✅ Correct dotenv

// ✅ Cloudinary Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// ✅ Upload the default profile picture only if needed
async function uploadDefaultProfilePicture() {
    try {
        const results = await cloudinary.uploader.upload('./public/images/default-profile.png', {
            folder: 'default-profile', // ✅ Store it in a separate Cloudinary folder
            public_id: 'default-profile-pic', // ✅ Set a permanent ID
            transformation: [
                { quality: 'auto', fetch_format: 'auto' },
                { width: 200, crop: 'fill', gravity: 'auto' }
            ]
        });

        console.log("Default profile picture uploaded:", results.secure_url);
        return results.secure_url; // ✅ Return Cloudinary URL
    } catch (error) {
        console.error("Error uploading default profile picture:", error);
    }
}

// ✅ Call the function
uploadDefaultProfilePicture();