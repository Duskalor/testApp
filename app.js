const scrapping = require('./scrapping');
const productosModel = require('./model/productos');
const { connectDB, connectClose } = require('./utils/db');
const discos = 'HDES';
const procesadores = 'CPU';
connectDB()
  .then(async () => {
    console.log('Connected BD');
    try {
      const data = await Promise.all([
        // scrapping(discos),
        scrapping(procesadores),
      ]);
      console.log({ data });
      console.log(`cantidad de datos ${data.length}`);
      const insetedData = await productosModel.insertMany(data, {
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
