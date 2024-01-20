const { launch } = require('puppeteer');
const { Cookie1, Cookie2, Cookie3, categoria } = require('./const');
const selectSelector = '#GrupoLineaId';
const URL =
  'https://www.deltron.com.pe/modulos/productos/items/ctBuscador/templates/buscador_web_v1.php';
let page = null;
let browser = null;
const puppeteerPage = async (optionValue, first = 3) => {
  try {
    if (first === 3) {
      browser = await launch({ headless: 'new' });
      page = await browser.newPage();
      await page.setViewport({
        width: 1366,
        height: 768,
        deviceScaleFactor: 1,
      });
      await page.goto(URL);
      await page.setCookie(Cookie1, Cookie2, Cookie3);
    }
    const datos = [];
    // console.log({ page });
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await page.waitForSelector('#GrupoLineaId');
    await page.select(selectSelector, optionValue);
    await page.waitForSelector('#listado-productos-dg');
    await page.click('#chkStock');
    await page.waitForSelector('#listado-productos-dg');
    await page.select('#cboAlmacenes', '030');
    await page.waitForSelector('#listado-productos-dg');
    await new Promise((resolve) => setTimeout(resolve, 12000));
    const alldata = await page.$$('.container-item-busc-dg .thumbnail');
    for (const data of alldata) {
      // console.log(data);
      const nombre = await data.$eval('h5 a', (text) => text.innerHTML);
      const url = await data.$eval('h5 a', (text) => text.getAttribute('href'));
      const img = await data.$eval('img', (img) => img.getAttribute('src'));
      const minCode = await data.$eval(
        '.minicod_item',
        (text) => text.innerHTML
      );
      const precio = await data.$eval(
        '.nopadding div .cont-price-soles span',
        (text) => text.innerHTML
      );
      // todo en un objeto

      const categoriaName = Object.keys(categoria).find((item) =>
        nombre.includes(item)
      );

      const item = {
        nombre,
        url: `https://www.deltron.com.pe/${url}`,
        img,
        precio: precio.split(' ').pop(),
        minCode: minCode?.split('</span>').pop(),
        categoria: categoria[categoriaName],
      };
      datos.push(item);
    }
    browser.close();
    return { datos };
  } catch (error) {
    await page.reload();
    if (first === 1) {
      await browser.close();
    }
    throw new Error(error);
  }
};

module.exports = puppeteerPage;
