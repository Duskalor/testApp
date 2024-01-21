const productosModel = require('./model/productos');
const { connectDB, connectClose } = require('./utils/db');
const scrap = require('./newScrap');

connectDB()
  .then(async () => {
    console.log('Connected BD');
    try {
      const infoFromScrapping = await scrap();
      const infoAplanada = infoFromScrapping.flat();
      console.log(`cantidad de datos ${infoAplanada.length}`);

      const insetedData = await productosModel.insertMany(infoAplanada, {
        ordered: false,
      });
      console.log(`cantidad de información insertada: ${insetedData.length}`);
    } catch (error) {
      // Captura el error de duplicados y maneja de manera adecuada
      if (error.code === 11000) {
        console.log('Algunos documentos eran duplicados y no se insertaron.');
      } else {
        // Otros errores
        console.error('Error al insertar datos:', error);
      }
    }
  })
  .finally(() => {
    console.log('Cerrando conexión con la BD');
    connectClose();
  });
