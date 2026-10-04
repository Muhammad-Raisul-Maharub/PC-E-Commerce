import { getAdminProducts } from "@/app/actions/adminProducts";
import ProductsManagerClient from "./ProductsManagerClient";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="w-full">
      <ProductsManagerClient initialProducts={products} />
    </div>
  );
}
