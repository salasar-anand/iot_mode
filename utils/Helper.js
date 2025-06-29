// ✅ ESM style
export const sendResponse = (res, success, message, data = null, error = null) => {
  const response = { success, message };
  if (data) response.data = data;
  if (error) response.error = error;
  res.status(success ? 200 : 400).json(response);
};
