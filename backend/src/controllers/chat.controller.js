const asyncHandler = require('../utils/asyncHandler');
const { processChatMessage } = require('../services/chatbot.service');

const sendChatResponse = asyncHandler(async (req, res) => {
  const { message, history } = req.body || {};
  const response = await processChatMessage(message, history);

  res.json({
    message,
    response
  });
});

module.exports = {
  sendChatResponse
};
