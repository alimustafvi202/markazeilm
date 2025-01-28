import mongoose from "mongoose";

const saleProductSchema = mongoose.Schema({
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, required: true },
  salePrice: { type: Number, required: true },
});

let SaleProduct;
try {
  SaleProduct = mongoose.model("SaleProduct");
} catch (e) {
  SaleProduct = mongoose.model("SaleProduct", saleProductSchema);
}

export default SaleProduct;
