const { handleFileUpload, getFile } = require('../services/attachment.service');

const add = async (req, res, next) => {
  try {
    if (req.files) {
      const result = await handleFileUpload(req.files, req.body, req.user);

      res.status(201).json({
        success: true,
        message: 'Files uploaded successfully',
        data: result
      });
    }
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  const { id } = req.query;
  try {
    const { attachment, downloadStream } = await getFile(id);

    res.setHeader('Content-Type', attachment.fileType);
    res.setHeader('Content-Disposition', `inline:filename="${attachment.fileName}"`);
    downloadStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

module.exports = { add, get };
