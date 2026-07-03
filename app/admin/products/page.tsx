import { FiPlus, FiEdit2 } from "react-icons/fi";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHead, Th, TableBody, Tr, Td } from "@/components/ui/Table";
import { FormDialog } from "@/components/ui/FormDialog";
import { ConfirmDeleteButton } from "@/components/ui/ConfirmDeleteButton";
import { ProductForm } from "@/components/forms/ProductForm";
import { getProducts, deleteProduct } from "@/actions/products";
import { formatToman } from "@/lib/format";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <PageHeader
        title="مکمل‌ها"
        description="مدیریت محصولات و موجودی مکمل‌های ورزشی"
        action={
          <FormDialog title="افزودن محصول" triggerLabel="افزودن محصول" triggerIcon={<FiPlus className="h-4 w-4" />}>
            <ProductForm />
          </FormDialog>
        }
      />

      <Card>
        <Table>
          <TableHead>
            <Th>نام محصول</Th>
            <Th>توضیحات</Th>
            <Th>قیمت</Th>
            <Th>موجودی</Th>
            <Th>عملیات</Th>
          </TableHead>
          <TableBody>
            {products.length === 0 && (
              <Tr>
                <Td colSpan={5} className="text-center text-slate-400">
                  محصولی ثبت نشده است.
                </Td>
              </Tr>
            )}
            {products.map((product) => (
              <Tr key={product.id}>
                <Td>{product.name}</Td>
                <Td className="max-w-xs whitespace-normal text-slate-500">
                  {product.description || "—"}
                </Td>
                <Td>{formatToman(product.price)}</Td>
                <Td>
                  {product.stock > 0 ? (
                    <Badge tone={product.stock < 5 ? "warning" : "success"}>
                      {product.stock} عدد
                    </Badge>
                  ) : (
                    <Badge tone="danger">ناموجود</Badge>
                  )}
                </Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <FormDialog
                      title="ویرایش محصول"
                      triggerLabel="ویرایش"
                      triggerIcon={<FiEdit2 className="h-4 w-4" />}
                      iconOnly
                    >
                      <ProductForm product={product} />
                    </FormDialog>
                    <ConfirmDeleteButton
                      itemLabel={product.name}
                      action={deleteProduct.bind(null, product.id)}
                    />
                  </div>
                </Td>
              </Tr>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
