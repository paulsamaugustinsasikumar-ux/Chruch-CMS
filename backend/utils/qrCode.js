const QRCode = require('qrcode');

const generateQRCode = async (data) => {
  try {
    const options = {
      errorCorrectionLevel: 'M',
      type: 'png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    };

    const buffer = await QRCode.toBuffer(data, options);
    return buffer;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw error;
  }
};

module.exports = {
  generateQRCode
};