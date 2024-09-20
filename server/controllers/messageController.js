import Message from '../models/OTP.js';

export const getSentMessages = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { sentAt: -1 },
    populate: 'recipient',
  };

  try {
    const result = await Message.paginate({}, options);
    res.json({
      messages: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sent messages', error: error.message });
  }
};