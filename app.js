const scrapping = require('./scrapping');
const productosModel = require('./model/productos');
const { connectDB, connectClose } = require('./utils/db');
const discos = 'HDES';
const procesadores = 'CPU';

connectDB()
  .then(async () => {
    console.log('Connected BD');
    try {
      const DataDiscos = await scrapping(discos);
      const DataPro = await scrapping(procesadores);
      console.log({ DataDiscos, DataPro });

      const AlldataScrapping = [...DataDiscos, ...DataPro];
      console.log(`cantidad de datos ${AlldataScrapping.length}`);

      const insetedData = await productosModel.insertMany(AlldataScrapping, {
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
