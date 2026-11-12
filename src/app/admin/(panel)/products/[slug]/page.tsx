import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCompanies, getProduct } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, companies] = await Promise.all([
    getProduct(slug),
    getCompanies(),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          제품 수정 (Edit product)
        </h2>
        <p className="text-sm text-[var(--muted)]">{product.slug}</p>
      </div>
      <ProductForm mode="edit" companies={companies} initial={product} />
    </div>
  );
}
