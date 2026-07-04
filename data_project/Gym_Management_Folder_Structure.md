# ساختار پوشه‌بندی پروژه مدیریت باشگاه بدنسازی

این سند ساختار پوشه‌بندی فعلی پروژه، تصمیم‌های معماری و نحوه اجرای آن
را توضیح می‌دهد. تمام ۱۲ صفحه اصلی (طبق سند صفحات پروژه) با داده واقعی
(نه mock ثابت در کد) پیاده‌سازی شده‌اند و پایگاه‌داده پروژه از فاز
SQLite محلی به **PostgreSQL واقعی** مهاجرت کرده است.

> **نکته مهم:** نسخه نصب‌شده Next.js در این پروژه (16) با آنچه در دوره
> آموزشی مدل‌های زبانی رایج است تفاوت‌هایی دارد؛ مهم‌ترین آن تغییر نام
> `middleware.ts` به `proxy.ts` است (عملکرد یکسان، فقط تغییر نام).
> Prisma هم در نسخه ۷ دیگر `url` را در `schema.prisma` نمی‌پذیرد و به
> Driver Adapter (`@prisma/adapter-pg`) نیاز دارد.

## نمای کلی

```text
bashgah-yar/
├── app/                    # مسیرها و صفحات (App Router)
├── actions/                # Server Actionها (خواندن + نوشتن) به تفکیک موجودیت
├── components/
│   ├── forms/              # فرم‌های هر موجودیت (React Hook Form + Zod)
│   ├── layout/              # Sidebar مشترک
│   ├── ui/                  # کامپوننت‌های پایه (Button, Input, Modal, ...)
│   └── NotificationsView.tsx
├── lib/
│   ├── prisma.ts           # نمونه Singleton از PrismaClient (+ Driver Adapter)
│   ├── auth-guard.ts       # requireUser / requireRole برای Server Actionها و صفحات
│   ├── navigation.ts       # آیتم‌های منوی هر نقش
│   ├── format.ts           # فرمت تاریخ/مبلغ به فارسی
│   ├── validations/        # اسکیمای Zod به تفکیک موجودیت
│   └── generated/prisma/   # خروجی تولیدشده توسط Prisma (گیت‌ایگنور)
├── prisma/
│   ├── schema.prisma       # مدل‌های پایگاه داده (provider = postgresql)
│   ├── seed.ts             # داده‌های آزمایشی فارسی
│   └── migrations/
├── types/
│   └── next-auth.d.ts      # افزودن id/phone/role به تایپ‌های Auth.js
├── auth.ts                 # پیکربندی Auth.js (Credentials با شماره تماس)
├── proxy.ts                # محافظت از مسیرها بر اساس نقش (جایگزین middleware)
└── data_project/           # مستندات تحلیل و فناوری پروژه
```

## `app/` — مسیرها و صفحات (۱۲ صفحه اصلی)

| بخش | مسیر | نقش‌های مجاز |
|---|---|---|
| ورود | `app/(auth)/login` | عمومی |
| داشبورد | `app/admin`, `app/coach`, `app/member` | هر نقش، داشبورد خودش |
| کاربران | `app/admin/users` | مدیر |
| پلن‌های عضویت | `app/admin/plans` | مدیر |
| اشتراک‌ها | `app/admin/subscriptions`, `app/member/subscription` | مدیر / ورزشکار |
| پرداخت‌ها | `app/admin/payments`, `app/member/payments` | مدیر / ورزشکار |
| برنامه‌های تمرینی | `app/admin/programs`, `app/coach/programs`, `app/member/programs` | هر سه (با دسترسی متفاوت) |
| مکمل‌ها | `app/admin/products`, `app/member/products` | مدیر / ورزشکار |
| سفارش‌ها | `app/admin/orders`, `app/member/orders` | مدیر / ورزشکار |
| تجهیزات | `app/admin/equipment` | مدیر |
| حقوق مربیان | `app/admin/salaries`, `app/coach/salary` | مدیر / مربی |
| اعلان‌ها | `app/admin/notifications`, `app/coach/notifications`, `app/member/notifications` | هر سه |

هر بخش نقش (`admin`, `coach`, `member`) یک `layout.tsx` مخصوص به خود
دارد که سایدبار همان نقش (`components/layout/Sidebar.tsx` +
`lib/navigation.ts`) را نمایش می‌دهد. صفحه اصلی (`app/page.tsx`) کاربر
واردشده را بر اساس نقش به داشبورد مربوطه هدایت می‌کند.

## `proxy.ts` — کنترل دسترسی

جایگزین `middleware.ts` در Next.js 16. بررسی می‌کند:

1. کاربر واردنشده که به `/admin`, `/coach` یا `/member` برود → `/login`.
2. کاربر واردشده با نقش نامرتبط (مثلاً ورزشکار در `/admin`) → پنل خودش.
3. کاربر واردشده که دوباره به `/login` برود → پنل خودش.

این یک بررسی «خوش‌بینانه» (optimistic) است؛ هر Server Action هم مجدداً
با `requireRole` از `lib/auth-guard.ts` نقش کاربر را بررسی می‌کند.

## احراز هویت — ورود با شماره تماس

طبق تصمیم نهایی، ورود با **شماره تماس + رمز عبور** انجام می‌شود (نه
ایمیل). `auth.ts` در ریشه پروژه پیکربندی Auth.js (NextAuth v5) با
Credentials Provider و نشست JWT را نگه می‌دارد؛ `authorize()` کاربر را
با `prisma.user.findUnique({ where: { phone } })` پیدا و رمز عبور را با
`bcryptjs` مقایسه می‌کند. `lib/auth-guard.ts` دو تابع کمکی دارد:

- `requireUser()` — اگر نشستی نباشد به `/login` هدایت می‌کند.
- `requireRole(role | role[])` — علاوه بر بالا، نقش را هم بررسی می‌کند.

## پایگاه داده — PostgreSQL

پروژه از یک PostgreSQL محلی (نصب‌شده روی ویندوز، نه Docker) استفاده
می‌کند. `prisma/schema.prisma` با `provider = "postgresql"` تعریف شده و
`lib/prisma.ts` / `prisma/seed.ts` از آداپتور `PrismaPg`
(پکیج `@prisma/adapter-pg`) با `connectionString` استفاده می‌کنند.

فیلدهای مالی (`price`, `amount`) عمداً به‌صورت `Float` باقی مانده‌اند
(نه `Decimal`) چون مبالغ همیشه تومان صحیح بدون اعشار هستند؛ تبدیل به
`Decimal` نیاز به تبدیل دستی مقدار به `number` در تمام `actions/*.ts`
داشت (وگرنه پاس‌دادن مقدار `Decimal` از Server Component به Client
Component در Next.js با خطای serialization مواجه می‌شود) که برای این
پروژه ارزش پیچیدگی اضافه را نداشت.

`DATABASE_URL` در `.env` به‌صورت زیر تنظیم شده است:

```
postgresql://postgres:<password>@localhost:5432/bashgah_yar?schema=public
```

دستورهای مهاجرت اولیه (`prisma migrate dev` روی migrations قدیمی
SQLite) دوباره از صفر ساخته شدند، چون SQL تولیدشده برای SQLite با
PostgreSQL سازگار نیست.

### داده آزمایشی (`prisma/seed.ts`)

با `npm run db:seed` اجرا می‌شود و کاربران، پلن‌ها، اشتراک‌ها،
پرداخت‌ها، برنامه‌های تمرینی، محصولات، سفارش‌ها، تجهیزات، حقوق و
اعلان‌های فارسی نمونه می‌سازد. کاربران آزمایشی (رمز عبور همه: `12345678`):

| نقش | شماره تماس |
|---|---|
| مدیر | ۰۹۱۲۰۰۰۰۰۰۱ |
| مربی | ۰۹۱۲۰۰۰۰۰۰۲ |
| ورزشکار | ۰۹۱۲۰۰۰۰۰۰۵ |

## `lib/`

- `prisma.ts` — Singleton از `PrismaClient` با Driver Adapter.
- `auth-guard.ts` — `requireUser` / `requireRole`.
- `validations/` — اسکیمای Zod هر موجودیت (یک فایل به ازای هر صفحه).
- `navigation.ts` — آیتم‌های سایدبار هر نقش (آیکون از `react-icons/fi`).
- `format.ts` — `formatToman`, `formatDate`, `formatDateTime` (Intl با
  locale فارسی، از جمله تقویم شمسی).
- `generated/prisma/` — خروجی `prisma generate`. **توجه:** enumها را
  حتماً از مسیر `@/lib/generated/prisma/enums` ایمپورت کنید نه
  `.../client` — فایل `client.ts` وابستگی‌های Node.js دارد (`node:module`
  و…) و اگر در یک Client Component ایمپورت شود، build شکست می‌خورد.

## `actions/` — Server Actionها (خواندن + نوشتن)

هر فایل معادل یک موجودیت است و هم توابع خواندن (مثل `getUsers`) و هم
Server Actionهای نوشتن (`createUser`, `updateUser`, `deleteUser`) را در
بر دارد. الگوی هر تابع نوشتن:

1. `requireRole(...)` — بررسی نقش.
2. `schema.safeParse(data)` — اعتبارسنجی با Zod.
3. عملیات Prisma.
4. `revalidatePath(...)` — تازه‌سازی کش صفحات مرتبط.
5. بازگشت `{ error }` یا `{ success: true }`.

## `components/ui/` — کامپوننت‌های پایه

به‌جای shadcn/ui، کامپوننت‌های حداقلی روی Tailwind نوشته شده‌اند:
`Button`, `Input`, `Select`, `Textarea`, `Badge`, `Card`, `Table`,
`Modal`, `StatCard`, `PageHeader`, `ActionButton`, `ConfirmDeleteButton`
و **`FormDialog`**.

### ⚠️ نکته حیاتی درباره `FormDialog` (محدودیت RSC)

`FormDialog` مودالی است که یک دکمهٔ فعال‌ساز و فرم را نگه می‌دارد.
چون از `app/*/page.tsx` (Server Component) صدا زده می‌شود، **نباید
پراپ‌هایش تابع خام یا کامپوننت آیکون خام باشد** — در React Server
Components فقط داده‌های serializable، عنصرهای JSX آماده، و Server
Actionها می‌توانند از سرور به کلاینت پاس داده شوند؛ یک تابع معمولی
(مثل `trigger={(open) => ...}`) یا رفرنس یک کامپوننت (`triggerIcon={FiPlus}`)
باعث خطای زیر در زمان اجرا می‌شود (نه در build/typecheck):

```
Functions cannot be passed directly to Client Components unless...
```

به همین دلیل الگوی نهایی این‌طور است:

```tsx
// در Server Component (page.tsx)
<FormDialog title="افزودن کاربر" triggerLabel="افزودن کاربر" triggerIcon={<FiPlus className="h-4 w-4" />}>
  <UserForm />
</FormDialog>
```

و هر فرم (`UserForm`, `ProductForm`, ...) به‌جای گرفتن `onSuccess` به‌عنوان
پراپ، از `useDialogClose()` (اکسپورت‌شده از `FormDialog.tsx`، مبتنی بر
React Context) استفاده می‌کند تا بعد از موفقیت، خودش مودال را ببندد.

## `prisma/schema.prisma`

مدل‌ها از فصل «موجودیت‌های اصلی سیستم» در سند تحلیل کسب‌وکار گرفته
شده‌اند: `User` (نقش + `phone` یکتا برای ورود)، `SubscriptionPlan`،
`Subscription`، `Payment`، `TrainingProgram`، `Product`، `Order`،
`Equipment`، `Salary`، `Notification`. روابط اشتراک/پرداخت/برنامه/سفارش/
حقوق/اعلان به `User` با `onDelete: Cascade` تعریف شده‌اند تا حذف یک
کاربر، رکوردهای وابسته‌اش را هم پاک کند (مناسب برای فاز آزمایشی؛ در
تولید احتمالاً باید به‌جای حذف واقعی، غیرفعال‌سازی کاربر در نظر گرفته شود).

## متغیرهای محیطی (`.env`)

- `DATABASE_URL` — رشته اتصال PostgreSQL محلی (`postgresql://postgres:...@localhost:5432/bashgah_yar?schema=public`).
- `AUTH_SECRET` — کلید امضای نشست Auth.js (با `npx auth secret` تولید شود).

## دستورهای مفید

```bash
npm run dev          # اجرای سرور توسعه
npm run db:migrate    # اعمال تغییرات schema.prisma روی دیتابیس
npm run db:seed       # پر کردن دیتابیس با داده آزمایشی فارسی
npm run db:studio     # مرور گرافیکی دیتابیس (Prisma Studio)
```

## افزودن یک موجودیت جدید — الگوی پیشنهادی

1. مدل را در `prisma/schema.prisma` تعریف و `npm run db:migrate` را
   اجرا کنید.
2. `lib/validations/<entity>.ts` را با اسکیمای Zod بسازید.
3. `actions/<entity>.ts` را با توابع خواندن + Server Actionهای
   create/update/delete بسازید (با `requireRole`).
4. فرم مربوطه را در `components/forms/<Entity>Form.tsx` بسازید (با
   `useDialogClose()` اگر داخل `FormDialog` استفاده می‌شود).
5. صفحه را در `app/<role>/<entity>/page.tsx` با جدول/کارت و
   `FormDialog` تکمیل کنید و در `lib/navigation.ts` لینک آن را اضافه کنید.
