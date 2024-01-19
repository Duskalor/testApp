const puppeteerPage = require('./utils/page');

const msnError =
  'failed to find element matching selector "div .cont-price-soles span"';

const scrapping = async (optionValue, intento = 3) => {
  console.log(`scan número ${intento}`);
  try {
    const { datos } = await puppeteerPage(optionValue);
    console.log(datos);
    return datos;
  } catch (error) {
    console.log(error);
    if (error.message.includes(msnError) && intento > 0) {
      console.log('parece error de usuario Volviendo a escanear');
      const datos = await scrapping(optionValue, intento - 1);

      return datos;
    } else {
      console.log('No se puede escanear. Se agotaron los intentos.');
      return null;
    }
  }
};
module.exports = scrapping;
