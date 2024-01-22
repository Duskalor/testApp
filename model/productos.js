const { Schema, model } = require('mongoose');

const productosSchema = new Schema(
  {
    titulo: { type: String, required: true },
    minCode: { type: String, required: true, unique: true },
    img: { type: String, required: true },
    bigimg: { type: String, required: true },
    precio: { type: String, required: true },
    url: { type: String, required: true },
    categoria: { type: String, required: true },
    codigo: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    descripcion: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const productosModel = model('productos', productosSchema);

module.exports = productosModel;
