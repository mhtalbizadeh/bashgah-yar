import Image from "next/image";
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
      <div className="relative mb-6 overflow-hidden rounded-2xl shadow-sm">
        <Image
          src="/Image.png"
          alt="ویترین مکمل‌های ورزشی"
          width={1042}
          height={210}
          priority
          className="h-36 w-full object-cover sm:h-48"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <h1 className="text-xl font-bold text-white sm:text-2xl">مکمل‌ها</h1>
          <p className="mt-1 text-sm text-slate-200">
            مشاهده و سفارش مکمل‌های ورزشی
          </p>
        </div>
      </div>

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
