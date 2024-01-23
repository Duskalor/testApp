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

      const titulo = await data.$eval('h5 a', (text) => text.innerHTML);
      const codigo = await data.$eval('.cod_item', (text) => text.innerHTML);
      const url = `https://www.deltron.com.pe/modulos/productos/items/producto.php?item_number=${codigo
        .split(' ')
        .pop()}`;
      const img = await data.$eval('img', (img) => img.getAttribute('src'));
      const minCode = await data.$eval(
        '.minicod_item',
        (text) => text.innerHTML
      );
      const precio = await data.$eval(
        '.cont-prices-item div .cont-price-soles span',
        (text) => text.innerHTML
      );
      // Obtener la demás información
      const page2 = await browser.newPage();

      // desahabiliando cosas innecesarias
      await page2.setJavaScriptEnabled(false);
      await page2.setRequestInterception(true);
      page2.on('request', (request) => {
        if (
          request.resourceType() === 'image' ||
          request.resourceType() === 'stylesheet'
        ) {
          request.abort();
        } else {
          request.continue();
        }
      });
      await page2.goto(url);

      const nombre = await page2.$eval(
        '.title-name-product',
        (text) => text.innerHTML
      );
      const imageGallery = await page2.$('#imageGallery');

      const bigimg = await imageGallery.$$eval('li img', (imgs) =>
        imgs.map((img) => img.getAttribute('src'))
      );

      await page2.close();
      const item = {
        nombre,
        url,
        img,
        bigimg,
        codigo: codigo.split(' ').pop(),
        precio: precio.split(' ').pop(),
        minCode: minCode?.split('</span>').pop(),
        categoria,
        titulo,
      };
      datos.push(item);
    }
    dataFromWebScrapping.push(datos);
    page.close();

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  await browser.close();
  console.log('scrapping complete');
  return dataFromWebScrapping;
};

module.exports = scrap;
