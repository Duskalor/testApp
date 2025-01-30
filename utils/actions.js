const productosModel = require('../model/productos');

const deleteAll = async () => {
  await productosModel.deleteMany({});
  console.log('Datos borrados');
};

const InsertProductosDB = async (data) => {
  const productos = await productosModel.insertMany(data, {
    ordered: false,
  });
  return productos;
};

module.exports = { deleteAll, InsertProductosDB };
