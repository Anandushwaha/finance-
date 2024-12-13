const asyncHandler = (requestedfunction) => async (req, res, next) => {
  try {
    await requestedfunction(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      messege: error.messege,
    });
  }
};
export default asyncHandler;
