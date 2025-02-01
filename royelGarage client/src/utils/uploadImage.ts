export const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Royel_garage"); // preset_name
    formData.append("cloud_name", "dfvgxf4dc"); // cloud_name

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dfvgxf4dc/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await res.json();

    if (!data.secure_url) {
      throw new Error("Image URL not found in response");
    }

    return data.secure_url; // Return the uploaded image URL
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Optionally rethrow the error to handle it upstream
  }
};
