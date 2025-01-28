import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  name: { type: String, required: true },
  desc: { type: String },
  price: { type: Number, required: true },
  images: { type: [String] }, // future
});


let Product;
try {
  Product = mongoose.model("Product");
} catch (e) {
  Product = mongoose.model("Product", productSchema);
}

export default Product;
