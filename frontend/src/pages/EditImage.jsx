import React, { useState, useEffect } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { FormField } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { startEditing, stopEditing } from "../store/editButtonSlice"; // Assuming the slice is in the correct path
import { downloadImage } from "../utils/index"; // Assuming you have the downloadImage function
import { toast, ToastContainer } from "react-toastify";
import { useRef } from "react";

// Texts for different languages
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
    strengthDescription: "Adjust the intensity of the applied edit. A higher value means stronger changes.",    editing: "Editing...",
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
    strengthDescription: "כוונן את עוצמת השינויים. ערך גבוה יותר אומר שינויים חזקים יותר.",
    editing: "עורך...",
    downloading: "מוריד...",
  },
};


const EditImage = () => {
  // Redux state
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language.language);
  const { image: reduxImage, prompt: reduxPrompt } = useSelector(
    (state) => state.editButton
  );

  // Local state
  const [image, setImage] = useState(reduxImage || null);
  const [editedImage, setEditedImage] = useState(null);
  const [prompt, setPrompt] = useState(reduxPrompt || "");
  const [strength, setStrength] = useState(0.5); // Default strength value
  const [isPhotoUploaded, setisPhotoUploaded] = useState(false); // Track if editing is in progress
  const [isEditing, setIsEditing] = useState(false); // New state to track editing
  const [isDownloading, setIsDownloading] = useState(false); // New state to track downloading
  const editButtonRef = useRef(null); // Create a ref for the button
  const downloadButtonRef = useRef(null); // Create a ref for the button

// Reset the edited image whenever a new image is uploaded or editing is stopped
  useEffect(() => {
    setEditedImage(null);
  }, [image]);

  
  // When redirected from community card, update the Redux state with initial values
  useEffect(() => {
    if (reduxImage && reduxPrompt) {
      setImage(reduxImage);
      setPrompt(reduxPrompt);
      setisPhotoUploaded(true); // Set editing state to true
    }
  }, [reduxImage, reduxPrompt]);


  // 
  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the uploaded file
    
    if (file && file.type.startsWith("image/")) {
      setImage(file);  
      setisPhotoUploaded(true); 
    } else {
      // Display an error toast if the uploaded file is not an image
      toast.error(language === 'he' ? 
        "הקובץ שהועלה אינו תמונה." : 
        "The uploaded file is not an image.", {
        position: 'top-center',
        autoClose: 3000,
      });
      setisPhotoUploaded(false); // Stop editing in case of error
    }
  };
  const handleDownload = async () => {
    setIsDownloading(true); // Start downloading

    try {
      // Use the downloadImage utility to download the edited image
      await downloadImage(editedImage, "user"); // Use 'user' or any dynamic value

    } catch (error) {
    // If prompt is empty, show an toast error message
      if (downloadButtonRef.current) {
        const buttonRect = downloadButtonRef.current.getBoundingClientRect();
        const top = buttonRect.top + window.scrollY - 60;"There was an error downloading the image. Please try again.";
        toast.error(language === 'he' ?    'הייתה בעיה בהורדה. אנא נסה שוב' : 'There was an error downloading the image. Please try again.', {
          position: 'top-center',
          autoClose: 3000,
          style: { top: `${top}px` },
        });
      }
      return; // Exit if input is empty    } finally {
      
    }
    finally{
      if (downloadButtonRef.current) {
              const buttonRect = downloadButtonRef.current.getBoundingClientRect();
              const top = buttonRect.top + window.scrollY - 60;
              toast.success(language === 'he' ? '!ההורדה הושלמה בהצלחה' : 'Download completed successfully!', {
                position: 'top-center',
                autoClose: 3000,
                style: { top: `${top}px` },
              });
            }
            setIsDownloading(false);
          }
    }


    const handleEditImage = async () => {
    if (!image || !prompt) {
      // Display a toast message if the input is empty or no image
    if (editButtonRef.current) {
            const buttonRect = editButtonRef.current.getBoundingClientRect();
            const top = buttonRect.top + window.scrollY - 60;
            toast.error(`${language === "he" ? "הזן תיאור והעלה תמונה" : "Please enter a prompt and upload an image"}`, {
              position: 'top-center',
              autoClose: 3000,
              style: { top: `${top}px` },
            });
           } 
            return; // Exit if input is empty
          }
      
    setIsEditing(true); // Start editing
  

    // Handle the image based on its type (Blob, File, or URL)
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
    setEditedImage(null); // Clear edited image
  };


  return (

    // Header
    <div className="max-w-4xl px-2 pt-8">
      <h2 className="text-xl font-bold mb-4">{texts[language].title}</h2>
      <p className="mb-4 text-gray-400">{texts[language].description}</p>
      <div className="border border-1 bg-[#1a1a1a] hover:bg-[#555555] p-4  rounded-lg text-center relative">

        {/* Display the image if uploaded, else show the upload button */}
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

        {/* Display the stop editing button if an image is uploaded */}
        {isPhotoUploaded &&  (
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


      {/* Prompt FormField */}
      <div className="mt-4">
        <FormField
          labelName={texts[language].promptPlaceholder}
          name="text"
          placeholder={texts[language].promptPlaceholder}
          className="w-full p-2 border  rounded-lg"
          value={prompt}
          handleChange={(e) => setPrompt(e.target.value)}
        />

      {/* Strength Slider */}
<div className="mt-4">
  <div className="flex items-center justify-between">
    <label className="block font-bold">
      {texts[language].strengthLabel}: <span className="text-cyan-500">{strength.toFixed(2)}</span>
    </label>
    <span className="text-sm text-gray-400 m-2">
      {texts[language].strengthDescription}
    </span>
  </div>
  <input
    type="range"
    min="0"
    max="1"
    step="0.01"
    value={strength}
    onChange={(e) => setStrength(parseFloat(e.target.value))}
    className="w-full bg-gray-700 accent-cyan-300 mt-2 "
  />
</div>

{/* ToastContainer */}
        <ToastContainer
          position="top-right"
        />        <button ref={editButtonRef} // Attach ref to the button
        onClick={handleEditImage} className="mt-2 mb-16 bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-2 px-4 rounded-lg">
          {isEditing ? texts[language].editing : texts[language].edit}
        </button>

      </div>

      {/* Display the edited image and download button */}
      {editedImage && (
  <div className="mt-4  ">
    <h3 className="font-bold mb-2">{texts[language].editedImageTitle}</h3>
    <img
      src={editedImage}
      alt="Edited"
      className="w-full max-h-96 object-contain rounded-lg border "
    />
    {/* Download Button */}
    <button
    ref={downloadButtonRef}
      onClick={handleDownload} // Call the download function on button click
      className="mt-6 mb-16  bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 px-4 rounded-lg"
    >
      {isDownloading ? texts[language].downloading : texts[language].downloadImage}
    </button>
  </div>
)}


      
    </div>
  );
};

export default EditImage;
