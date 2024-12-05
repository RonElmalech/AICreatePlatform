import { surpriseMePrompts } from '../constants';
import FileSaver from 'file-saver';

export default function getRandomPrompt(prompt) {
    const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
    const randomPrompt = surpriseMePrompts[randomIndex];
    
    if(randomPrompt === prompt) {
        return getRandomPrompt(prompt);
    }

    return randomPrompt;
}

export async function downloadImage(_id, photo) {
    try {
      const response = await fetch(photo); // Fetch the image
      const blob = await response.blob(); // Convert the response to a Blob
      FileSaver.saveAs(blob, `download-${_id}.jpg`); // Save the image as a file
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  }
  
