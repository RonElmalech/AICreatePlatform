import React, { useState, useEffect } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { FormField } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { startEditing, stopEditing } from "../store/editButtonSlice"; // Assuming the slice is in the correct path
import { downloadImage } from "../utils/index"; // Assuming you have the downloadImage function

const texts = {
  en: {
    title: "Edit Your Image",
    description: "Upload an image and provide a description for the edit (e.g., 'Add a sunset background').",
    uploadImage: "Upload Image",
    promptPlaceholder: "Describe how to edit the image",
    edit: "Edit Image",
    editedImageTitle: "Edited Image",
    downloadImage: "Download Image",
    strengthLabel: "Strength",
    editing: "Editing...",
    downloading: "Downloading...",
  },
  he: {
    title: "ערוך את התמונה שלך",
    description: "העלו תמונה והזינו תיאור לעריכה (למשל, 'הוסף רקע של שקיעה').",
    uploadImage: "העלה תמונה",
    promptPlaceholder: "תאר כיצד לערוך את התמונה",
    edit: "ערוך תמונה",
    editedImageTitle: "תמונה ערוכה",
    downloadImage: "הורד תמונה",
    strengthLabel: "עוצמה",
    editing: "עורך...",
    downloading: "מוריד...",
  },
};

const EditImage = () => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language.language);
  const { image: reduxImage, prompt: reduxPrompt } = useSelector(
    (state) => state.editButton
  );

  const [image, setImage] = useState(reduxImage || null);
  const [editedImage, setEditedImage] = useState(null);
  const [prompt, setPrompt] = useState(reduxPrompt || "");
  const [strength, setStrength] = useState(0.5); // Default strength value
  const [isPhotoUploaded, setisPhotoUploaded] = useState(false); // Track if editing is in progress
  const [isEditing, setIsEditing] = useState(false); // New state to track editing
  const [isDownloading, setIsDownloading] = useState(false); // New state to track downloading

  useEffect(() => {
    // When redirected from community card, update the Redux state with initial values
    if (reduxImage && reduxPrompt) {
      setImage(reduxImage);
      setPrompt(reduxPrompt);
      setisPhotoUploaded(true); // Set editing state to true
    }
  }, [reduxImage, reduxPrompt]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);  
      setisPhotoUploaded(true); // Set editing state to true

    } else {
      console.error("Uploaded file is not an image.");
      setisPhotoUploaded(false); // Stop editing in case of error]
    }
  };
   
  const handleDownload = async () => {
    setIsDownloading(true); // Start downloading

    try {
      // Use the existing downloadImage utility to download the edited image
      await downloadImage(editedImage, "user"); // Use 'user' or any dynamic value

    } catch (error) {
      console.error("Error downloading the image:", error.message);
    } finally {
      setIsDownloading(false); // End downloading
    }
  };

  const handleEditImage = async () => {
    if (!image) {
      console.error("No image to process");
      return;
    }
    setIsEditing(true); // Start editing
  
    try {
      let imageBase64 = null;
  
      // Check if image is a Blob or File before calling readAsDataURL
      if (image instanceof Blob || image instanceof File) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          imageBase64 = reader.result.split(",")[1]; // Get base64 without the prefix
  
          try {
            const res = await fetch("/api/v1/dalle/edit", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                prompt,
                image_b64: imageBase64,
                strength,
              }),
            });
  
            if (!res.ok) {
              throw new Error(`Request failed with status code ${res.status}`);
            }
  
            const data = await res.json();
            if (data.editedImageUrl) {
              setEditedImage(data.editedImageUrl); // Display the edited image
            }
          } catch (error) {
            console.error("Error in fetch request:", error.message);
          } finally {
            setIsEditing(false); // Stop editing
          }
        };
        reader.readAsDataURL(image); // Convert image to base64
      } else if (typeof image === "string" && image.startsWith("http")) {
        // If the image is a URL, fetch it and convert to base64
        try {
          const response = await fetch(image);
          const blob = await response.blob();
          const reader = new FileReader();
  
          reader.onloadend = async () => {
            imageBase64 = reader.result.split(",")[1]; // Get base64 without the prefix
  
            try {
              const res = await fetch("/api/v1/dalle/edit", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  prompt,
                  image_b64: imageBase64,
                  strength,
                }),
              });
  
              if (!res.ok) {
                throw new Error(`Request failed with status code ${res.status}`);
              }
  
              const data = await res.json();
              if (data.editedImageUrl) {
                setEditedImage(data.editedImageUrl); // Display the edited image
              }
            } catch (error) {
              console.error("Error in fetch request:", error.message);
            } finally {
              setIsEditing(false); // Stop editing
            }
          };
  
          reader.readAsDataURL(blob); // Convert the fetched image to base64
        } catch (error) {
          console.error("Error fetching the image URL:", error.message);
          setIsEditing(false); // Stop editing on error
        }
      } else {
        console.error("Unsupported image format");
        setIsEditing(false); // Stop editing if image is not supported
      }
    } catch (error) {
      console.error("Error handling image:", error.message);
      setIsEditing(false); // Stop editing on error
    }
  };
  
  

  const handleStopEditing = () => {
    dispatch(stopEditing());
    setImage(null); // Clear image
    setPrompt(""); // Clear prompt
    setisPhotoUploaded(false); // Stop editing
  };


  return (
    <div className="max-w-4xl px-2 pt-8">
      <h2 className="text-xl font-bold mb-4">{texts[language].title}</h2>
      <p className="mb-4 text-gray-400">{texts[language].description}</p>

      <div className="border border-1 bg-[#1a1a1a] hover:bg-[#555555] p-4  rounded-lg text-center relative">
        {!image ? (
          <>
            <label htmlFor="upload" className="cursor-pointer">
              <FiUploadCloud size={50} className="mx-auto mb-2" />
              <span>{texts[language].uploadImage}</span>
            </label>
            <input type="file" id="upload" className="hidden" onChange={handleImageUpload} />
          </>
        ) : (
          <img
            src={image && typeof image === "string" && image.startsWith("http") ? image : URL.createObjectURL(image)}
            alt="Uploaded"
            className="w-full max-h-96 object-contain rounded-lg"
          />
        )}

        {/* Debugging: Confirm if this button is rendered */}
        {isPhotoUploaded && (
          <button
            onClick={handleStopEditing}
            className={`absolute top-1 ${language === "he" ? "left-1" : "right-1"} p-1 bg-[#1a1a1a] border border-1  hover:bg-[#555555] text-white rounded-full`}
            style={{
              zIndex: 10, // Ensure it's on top of other elements
            }}
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      <div className="mt-4">
        <FormField
          labelName={texts[language].promptPlaceholder}
          name="text"
          placeholder={texts[language].promptPlaceholder}
          className="w-full p-2 border  rounded-lg"
          value={prompt}
          handleChange={(e) => setPrompt(e.target.value)}
        />

        <div className="mt-4">
          <label className="block ">{texts[language].strengthLabel}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={strength}
            onChange={(e) => setStrength(parseFloat(e.target.value))}
            className="w-full bg-gray-700 accent-cyan-300"
          />
          <span>{strength}</span>
        </div>

        <button onClick={handleEditImage} className="mt-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-2 px-4 rounded-lg">
          {isEditing ? texts[language].editing : texts[language].edit}
        </button>
      </div>

      {editedImage && (
  <div className="mt-4">
    <h3 className="font-bold">{texts[language].editedImageTitle}</h3>
    <img
      src={editedImage}
      alt="Edited"
      className="w-full max-h-96 object-contain rounded-lg"
    />
    <button
      onClick={handleDownload} // Call the download function on button click
      className="mt-6 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 px-4 rounded-lg"
    >
      {isDownloading ? texts[language].downloading : texts[language].downloadImage}
    </button>
  </div>
)}


      
    </div>
  );
};

export default EditImage;
