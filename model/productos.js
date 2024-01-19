const { Schema, model } = require('mongoose');

const productosSchema = new Schema(
  {
    nombre: { type: String, required: true },
    minCode: { type: String, required: true, unique: true },
    img: { type: String, required: true },
    precio: { type: String, required: true },
    url: { type: String, required: true },
    categoria: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const productosModel = model('productos', productosSchema);

module.exports = productosModel;
