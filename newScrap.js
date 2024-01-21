const { launch } = require('puppeteer');
const { categorias, Cookie1, Cookie2, Cookie3 } = require('./utils/const');
const URL =
  'https://www.deltron.com.pe/modulos/productos/items/ctBuscador/templates/buscador_web_v1.php';

const scrap = async () => {
  const browser = await launch({ headless: 'new' });
  const dataFromWebScrapping = [];
  for (const [categoria, codigo] of Object.entries(categorias)) {
    console.log(`obteniendo datos de '${categoria}'`);
    const page = await browser.newPage();
    await page.setViewport({
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
    });
    await page.goto(URL);
    await page.setCookie(Cookie1, Cookie2, Cookie3);
    await page.reload();

    await page.waitForSelector('#GrupoLineaId');
    await page.select('#GrupoLineaId', codigo);
    await page.click('#chkStock');
    await page.select('#cboAlmacenes', '030');
    await page.waitForSelector(
      '.container-item-busc-dg .thumbnail .cont-prices-item'
    );
    const alldata = await page.$$('.container-item-busc-dg .thumbnail');
    const datos = [];
    for (const data of alldata) {
      const precioElement = await data.$(
        '.cont-prices-item div .cont-price-soles span'
      );
      if (!precioElement) {
        console.log(
          'Elemento de precio no encontrado. Saltando al siguiente elemento.'
        );
        continue; // Salta al siguiente elemento del bucle
      }

      const nombre = await data.$eval('h5 a', (text) => text.innerHTML);
      const url = await data.$eval('h5 a', (text) => text.getAttribute('href'));
      const img = await data.$eval('img', (img) => img.getAttribute('src'));
      const minCode = await data.$eval(
        '.minicod_item',
        (text) => text.innerHTML
      );
      const precio = await data.$eval(
        '.cont-prices-item div .cont-price-soles span',
        (text) => text.innerHTML
      );

      const item = {
        nombre,
        url: `https://www.deltron.com.pe/${url}`,
        img,
        precio: precio.split(' ').pop(),
        minCode: minCode?.split('</span>').pop(),
        categoria,
      };
      datos.push(item);
    }
    dataFromWebScrapping.push(datos);
    page.close();

    // await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  await browser.close();
  console.log('scrapping complete');
  return dataFromWebScrapping;
};

module.exports = scrap;
