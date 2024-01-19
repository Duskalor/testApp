const puppeteerPage = require('./utils/page');
const optionValue = 'HDES';

const msnError =
  'failed to find element matching selector "div .cont-price-soles span"';

const scrapping = async (attempts = 3) => {
  console.log(`scan numero ${attempts}`);
  try {
    const { datos } = await puppeteerPage(optionValue);
    console.log(datos);
    return datos;
  } catch (error) {
    console.log(error);
    if (error.message.includes(msnError) && attempts > 0) {
      console.log('Volviendo a escanear');
      await scrapping(attempts - 1);
    }
  }
};
module.exports = scrapping;
