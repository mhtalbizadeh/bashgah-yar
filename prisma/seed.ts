import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const DEMO_PASSWORD = "12345678";

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function main() {
  console.log("در حال پاک‌سازی داده‌های قبلی...");
  await prisma.notification.deleteMany();
  await prisma.order.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.trainingProgram.deleteMany();
  await prisma.salary.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  console.log("در حال ساخت کاربران...");
  const admin = await prisma.user.create({
    data: {
      name: "علی رضایی",
      phone: "09120000001",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  const coaches = await Promise.all(
    [
      { name: "محمد حسینی", phone: "09120000002" },
      { name: "سارا احمدی", phone: "09120000003" },
      { name: "رضا کریمی", phone: "09120000004" },
    ].map((coach) =>
      prisma.user.create({
        data: { ...coach, password: passwordHash, role: "COACH" },
      })
    )
  );

  const members = await Promise.all(
    [
      { name: "امیر محمدی", phone: "09120000005" },
      { name: "نگار صادقی", phone: "09120000006" },
      { name: "بهنام یوسفی", phone: "09120000007" },
      { name: "مریم قاسمی", phone: "09120000008" },
      { name: "حسین نوری", phone: "09120000009" },
      { name: "زهرا کاظمی", phone: "09120000010" },
      { name: "علی اصغری", phone: "09120000011" },
      { name: "فاطمه رستمی", phone: "09120000012" },
    ].map((member) =>
      prisma.user.create({
        data: { ...member, password: passwordHash, role: "MEMBER" },
      })
    )
  );

  console.log("در حال ساخت پلن‌های عضویت...");
  const plans = await Promise.all([
    prisma.subscriptionPlan.create({
      data: {
        name: "ماهانه",
        durationDays: 30,
        price: 500_000,
        description: "اشتراک یک‌ماهه با دسترسی کامل به سالن",
      },
    }),
    prisma.subscriptionPlan.create({
      data: {
        name: "سه ماهه",
        durationDays: 90,
        price: 1_350_000,
        description: "اشتراک سه‌ماهه با تخفیف ویژه",
      },
    }),
    prisma.subscriptionPlan.create({
      data: {
        name: "شش ماهه",
        durationDays: 180,
        price: 2_400_000,
        description: "اشتراک شش‌ماهه به همراه یک جلسه مشاوره تغذیه",
      },
    }),
    prisma.subscriptionPlan.create({
      data: {
        name: "سالانه",
        durationDays: 365,
        price: 4_200_000,
        description: "اشتراک سالانه با بیشترین صرفه‌جویی",
      },
    }),
  ]);

  console.log("در حال ساخت اشتراک‌ها و پرداخت‌ها...");
  const subscriptionSeeds = [
    { member: members[0], plan: plans[0], startOffset: -10, status: "ACTIVE" as const },
    { member: members[1], plan: plans[1], startOffset: -40, status: "ACTIVE" as const },
    { member: members[2], plan: plans[0], startOffset: -28, status: "ACTIVE" as const },
    { member: members[3], plan: plans[2], startOffset: -100, status: "ACTIVE" as const },
    { member: members[4], plan: plans[0], startOffset: -45, status: "EXPIRED" as const },
    { member: members[5], plan: plans[3], startOffset: -20, status: "ACTIVE" as const },
    { member: members[6], plan: plans[1], startOffset: -5, status: "ACTIVE" as const },
  ];

  for (const seed of subscriptionSeeds) {
    const startDate = daysFromNow(seed.startOffset);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + seed.plan.durationDays);

    const subscription = await prisma.subscription.create({
      data: {
        memberId: seed.member.id,
        planId: seed.plan.id,
        startDate,
        endDate,
        status: seed.status,
      },
    });

    await prisma.payment.create({
      data: {
        memberId: seed.member.id,
        subscriptionId: subscription.id,
        amount: seed.plan.price,
        status: "PAID",
        paidAt: startDate,
      },
    });
  }

  // یک پرداخت در انتظار تایید برای تنوع در فیلتر
  await prisma.payment.create({
    data: {
      memberId: members[7].id,
      amount: plans[0].price,
      status: "PENDING",
    },
  });

  console.log("در حال ساخت برنامه‌های تمرینی...");
  const programSeeds = [
    {
      coach: coaches[0],
      member: members[0],
      title: "برنامه شروع - هفته اول تا چهارم",
      content: "روز اول: سینه و پشت بازو\nروز دوم: پا و شکم\nروز سوم: پشت و جلو بازو\nروز چهارم: استراحت فعال و کاردیو",
    },
    {
      coach: coaches[0],
      member: members[2],
      title: "برنامه حجم - سطح متوسط",
      content: "تمرکز روی افزایش حجم عضلانی با ۴ جلسه در هفته و رژیم پرکالری",
    },
    {
      coach: coaches[1],
      member: members[1],
      title: "برنامه چربی‌سوزی",
      content: "ترکیب تمرینات مقاومتی و کاردیوی اینتروال، ۵ جلسه در هفته",
    },
    {
      coach: coaches[2],
      member: members[5],
      title: "برنامه آماده‌سازی مسابقه",
      content: "برنامه ۱۲ هفته‌ای با تمرکز روی تعریف عضلانی",
    },
  ];

  for (const p of programSeeds) {
    await prisma.trainingProgram.create({
      data: {
        coachId: p.coach.id,
        memberId: p.member.id,
        title: p.title,
        content: p.content,
      },
    });
  }

  console.log("در حال ساخت محصولات (مکمل‌ها)...");
  const products = await Promise.all([
    prisma.product.create({
      data: { name: "پروتئین وی", description: "پودر پروتئین وی ۲ کیلوگرمی", price: 1_800_000, stock: 22 },
    }),
    prisma.product.create({
      data: { name: "کراتین مونوهیدرات", description: "بسته ۳۰۰ گرمی", price: 650_000, stock: 40 },
    }),
    prisma.product.create({
      data: { name: "گینر حجم‌دهنده", description: "پودر افزایش وزن ۳ کیلوگرمی", price: 2_100_000, stock: 8 },
    }),
    prisma.product.create({
      data: { name: "BCAA", description: "آمینو اسید شاخه‌دار، ۲۰۰ گرمی", price: 900_000, stock: 15 },
    }),
    prisma.product.create({
      data: { name: "مولتی ویتامین", description: "قرص مولتی ویتامین ورزشکاران", price: 480_000, stock: 0 },
    }),
  ]);

  console.log("در حال ساخت سفارش‌ها...");
  await Promise.all([
    prisma.order.create({
      data: { memberId: members[0].id, productId: products[0].id, status: "DELIVERED" },
    }),
    prisma.order.create({
      data: { memberId: members[1].id, productId: products[1].id, status: "READY" },
    }),
    prisma.order.create({
      data: { memberId: members[2].id, productId: products[3].id, status: "PENDING" },
    }),
    prisma.order.create({
      data: { memberId: members[0].id, productId: products[2].id, status: "PENDING" },
    }),
  ]);

  console.log("در حال ساخت تجهیزات...");
  await Promise.all([
    prisma.equipment.create({
      data: { name: "تردمیل حرفه‌ای", purchaseDate: daysFromNow(-500), status: "ACTIVE" },
    }),
    prisma.equipment.create({
      data: { name: "دستگاه پرس سینه", purchaseDate: daysFromNow(-300), status: "ACTIVE" },
    }),
    prisma.equipment.create({
      data: { name: "دوچرخه ثابت", purchaseDate: daysFromNow(-620), status: "NEEDS_REPAIR", description: "صدای غیرعادی هنگام رکاب زدن" },
    }),
    prisma.equipment.create({
      data: { name: "دستگاه لَت", purchaseDate: daysFromNow(-900), status: "BROKEN", description: "سیم دستگاه پاره شده است" },
    }),
    prisma.equipment.create({
      data: { name: "ست هالتر و وزنه", purchaseDate: daysFromNow(-150), status: "ACTIVE" },
    }),
  ]);

  console.log("در حال ساخت حقوق مربیان...");
  const now = new Date();
  for (const coach of coaches) {
    for (let i = 0; i < 2; i++) {
      const month = ((now.getMonth() - i + 12) % 12) + 1;
      const year = now.getFullYear() - (now.getMonth() - i < 0 ? 1 : 0);
      await prisma.salary.create({
        data: {
          coachId: coach.id,
          amount: 12_000_000 + Math.round(Math.random() * 2_000_000),
          month,
          year,
          status: i === 0 ? "PENDING" : "PAID",
          paymentDate: i === 0 ? null : daysFromNow(-30 * (i + 1)),
        },
      });
    }
  }

  console.log("در حال ساخت اعلان‌ها...");
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: members[4].id,
        title: "پایان اشتراک",
        message: "اشتراک شما به پایان رسیده است. برای تمدید با پذیرش تماس بگیرید.",
      },
    }),
    prisma.notification.create({
      data: {
        userId: members[0].id,
        title: "برنامه تمرینی جدید",
        message: "یک برنامه تمرینی جدید برای شما ثبت شد.",
      },
    }),
    prisma.notification.create({
      data: {
        userId: members[1].id,
        title: "سفارش آماده تحویل",
        message: "سفارش کراتین مونوهیدرات شما آماده تحویل است.",
      },
    }),
    prisma.notification.create({
      data: {
        userId: admin.id,
        title: "سفارش جدید",
        message: "یک سفارش جدید ثبت شد و در انتظار بررسی است.",
      },
    }),
    prisma.notification.create({
      data: {
        userId: coaches[0].id,
        title: "حقوق ماه جاری",
        message: "حقوق ماه جاری شما هنوز پرداخت نشده است.",
      },
    }),
  ]);

  console.log("پایان seed. اطلاعات ورود آزمایشی:");
  console.log(`  مدیر:    ${admin.phone} / ${DEMO_PASSWORD}`);
  console.log(`  مربی:    ${coaches[0].phone} / ${DEMO_PASSWORD}`);
  console.log(`  ورزشکار: ${members[0].phone} / ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
