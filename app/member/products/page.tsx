import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ActionButton } from "@/components/ui/ActionButton";
import { getProducts } from "@/actions/products";
import { createOrder } from "@/actions/orders";
import { formatToman } from "@/lib/format";

export default async function MemberProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <PageHeader title="مکمل‌ها" description="مشاهده و سفارش مکمل‌های ورزشی" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-slate-900">{product.name}</h3>
                {product.stock > 0 ? (
                  <Badge tone="success">موجود</Badge>
                ) : (
                  <Badge tone="danger">ناموجود</Badge>
                )}
              </div>
              <p className="text-sm text-slate-500">
                {product.description || "—"}
              </p>
              <p className="text-sm font-medium text-slate-800">
                {formatToman(product.price)}
              </p>
              {product.stock > 0 ? (
                <ActionButton
                  label="ثبت سفارش"
                  pendingLabel="در حال ثبت..."
                  variant="primary"
                  action={createOrder.bind(null, { productId: product.id })}
                />
              ) : (
                <span className="text-center text-xs text-slate-400">
                  موجودی این محصول به پایان رسیده است
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
