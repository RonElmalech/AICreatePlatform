import { generateAIResponse } from '../mongodb/routes/dalleRoutes.js'; // Import your AI response generation logic


export const initializeSocketHandlers = (io) => {
  let clients = {};

  // Listen for new socket connections
  io.on('connection', (socket) => {
    clients[socket.id] = socket;

    // Listen for user-generated AI request
    socket.on('generate-ai-response', async (data) => {
      const { text, language, socketId } = data;

      try {
        // Call the AI response handler (your route handler)
        const aiResponse = await generateAIResponse({ body: { text, language } }, { json: (data) => data });

        // Emit AI response back to the requesting socket
        io.to(socketId).emit('ai-response', { response: aiResponse.response || 'No response from AI' });
      } catch (error) {
        console.error('Error in AI response:', error.message);
        io.to(socketId).emit('ai-response', { error: 'Failed to process AI request.' });
      }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      delete clients[socket.id];
    });
  });
};
