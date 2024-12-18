import React, { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

const EditImage = () => {
  const [image, setImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [prompt, setPrompt] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
  };

  const handleEditImage = async () => {
    // Send the image and prompt to your backend API
    const res = await fetch("/api/v1/dalle/edit", {
      method: "POST",
      body: JSON.stringify({ prompt, image }),
    });
    const data = await res.json();
    setEditedImage(data.editedImageUrl);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Edit Your Image</h2>

      <div className="border-dashed border-2 p-4 rounded-md text-center">
        {!image ? (
          <>
            <label htmlFor="upload" className="cursor-pointer">
              <FiUploadCloud size={50} className="mx-auto mb-2" />
              <span>Upload Image</span>
            </label>
            <input type="file" id="upload" className="hidden" onChange={handleImageUpload} />
          </>
        ) : (
          <img src={image} alt="Uploaded" className="w-full max-h-96 object-contain" />
        )}
      </div>

      <div className="mt-4">
        <textarea
          placeholder="Describe how to edit the image (e.g., 'Add a sunset background')"
          className="w-full p-2 border rounded-md"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button onClick={handleEditImage} className="mt-2 bg-blue-500 text-white p-2 rounded-md">
          Apply Edit
        </button>
      </div>

      {editedImage && (
        <div className="mt-4">
          <h3 className="font-bold">Edited Image</h3>
          <img src={editedImage} alt="Edited" className="w-full max-h-96 object-contain" />
          <a href={editedImage} download className="mt-2 inline-block bg-green-500 text-white p-2 rounded-md">
            Download Image
          </a>
        </div>
      )}
    </div>
  );
};

export default EditImage;
