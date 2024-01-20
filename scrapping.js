const puppeteerPage = require('./utils/page');

const msnError1 =
  'failed to find element matching selector ".nopadding div .cont-price-soles span"';
const msnError2 =
  'TargetCloseError: Protocol error (Page.reload): Target closed';

const scrapping = async (optionValue, intento = 3) => {
  console.log(`scan número ${intento}`);
  try {
    const { datos } = await puppeteerPage(optionValue, intento);
    return datos;
  } catch (error) {
    // console.log(error);
    if (
      error.message.includes(msnError1) ||
      (error.message.includes(msnError2) && intento > 1)
    ) {
      console.log('parece error de usuario Volviendo a escanear');
      return await scrapping(optionValue, intento - 1);
    } else {
      console.log('No se puede escanear. Se agotaron los intentos.');
      return null;
    }
  }
};
module.exports = scrapping;
