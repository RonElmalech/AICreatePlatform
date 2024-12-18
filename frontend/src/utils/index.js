import { surpriseMePrompts } from '../constants';
import FileSaver from 'file-saver';

// Get a random prompt function
export default function getRandomPrompt(prompt) {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];
  
  if(randomPrompt === prompt) {
    return getRandomPrompt(prompt);
  }

  return randomPrompt;
}

// Download image function
export async function downloadImage(photo, userName = 'user') {
  try {
    if (!photo) {
      throw new Error('No image generated');  // If no image URL is provided, throw an error
    }

    const response = await fetch(photo);  // Fetch the image from the URL
    const blob = await response.blob();   // Convert the response to a Blob

    // Generate a unique filename using a timestamp
    const timestamp = Date.now();  // Get the current timestamp
    const fileName = `MindCraftAI-${userName}-${timestamp}.jpg`;  // Use the timestamp in the filename

    // Save the image with the generated name
    FileSaver.saveAs(blob, fileName);

  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;  // Propagate the error to handle it in the component
  }
}
