# Gym Management System - Entity Analysis

# Introduction

در این سند، موجودیت‌های (Entities) اصلی سیستم مدیریت باشگاه بدنسازی معرفی شده‌اند. برای هر موجودیت، وظیفه، فیلدهای اصلی و ارتباط آن با سایر موجودیت‌ها مشخص شده است. هدف این سند، ایجاد یک دید کلی از ساختار داده‌های سیستم قبل از طراحی پایگاه داده است.

---

# 1. User

## Purpose

این موجودیت اطلاعات تمامی کاربران سیستم را نگهداری می‌کند. کاربران می‌توانند یکی از سه نقش زیر را داشته باشند:

- مدیر (Admin)
- مربی (Coach)
- ورزشکار (Member)

تمام کاربران سیستم ابتدا در این جدول ثبت می‌شوند و نقش آن‌ها توسط فیلد Role مشخص می‌شود.

## Fields

| Field     | Type     | Description                      |
| --------- | -------- | -------------------------------- |
| id        | Integer  | شناسه یکتا                       |
| fullName  | String   | نام و نام خانوادگی               |
| phone     | String   | شماره تماس                       |
| password  | String   | رمز عبور                         |
| role      | Enum     | نقش کاربر (Admin, Coach, Member) |
| createdAt | DateTime | تاریخ ایجاد حساب                 |

## Relationships

- User (Member) → Subscription (1 : 1)
- User (Member) → Payment (1 : N)
- User (Coach) → TrainingProgram (1 : N)
- User (Member) → TrainingProgram (1 : N)
- User (Member) → Order (1 : N)
- User (Coach) → Salary (1 : N)
- User → Notification (1 : N)

---

# 2. SubscriptionPlan

## Purpose

این موجودیت انواع پلن‌های عضویت باشگاه را نگهداری می‌کند.

نمونه پلن‌ها:

- ماهانه
- سه ماهه
- شش ماهه
- سالانه

## Fields

| Field       | Type    | Description      |
| ----------- | ------- | ---------------- |
| id          | Integer | شناسه پلن        |
| name        | String  | نام پلن          |
| duration    | Integer | مدت اعتبار (روز) |
| price       | Decimal | قیمت             |
| description | String  | توضیحات          |

## Relationships

- SubscriptionPlan → Subscription (1 : N)

---

# 3. Subscription

## Purpose

اطلاعات اشتراک فعال هر ورزشکار را نگهداری می‌کند.

## Fields

| Field     | Type     | Description                     |
| --------- | -------- | ------------------------------- |
| id        | Integer  | شناسه اشتراک                    |
| memberId  | FK(User) | شناسه ورزشکار                   |
| planId    | FK       | شناسه پلن                       |
| startDate | Date     | تاریخ شروع                      |
| endDate   | Date     | تاریخ پایان                     |
| status    | Enum     | وضعیت اشتراک (Active / Expired) |

## Relationships

- User → Subscription (1 : 1)
- SubscriptionPlan → Subscription (1 : N)
- Subscription → Payment (1 : N)

---

# 4. Payment

## Purpose

تمام پرداخت‌های مربوط به خرید یا تمدید اشتراک اعضا در این موجودیت ثبت می‌شود.

## Fields

| Field          | Type     | Description   |
| -------------- | -------- | ------------- |
| id             | Integer  | شناسه پرداخت  |
| memberId       | FK(User) | ورزشکار       |
| subscriptionId | FK       | اشتراک مربوطه |
| amount         | Decimal  | مبلغ پرداخت   |
| paymentDate    | DateTime | تاریخ پرداخت  |
| method         | String   | روش پرداخت    |
| status         | Enum     | وضعیت پرداخت  |

## Relationships

- User → Payment (1 : N)
- Subscription → Payment (1 : N)

---

# 5. TrainingProgram

## Purpose

برنامه تمرینی ورزشکاران که توسط مربیان ایجاد می‌شود در این موجودیت ذخیره می‌شود.

## Fields

| Field     | Type     | Description       |
| --------- | -------- | ----------------- |
| id        | Integer  | شناسه برنامه      |
| memberId  | FK(User) | ورزشکار           |
| coachId   | FK(User) | مربی              |
| title     | String   | عنوان برنامه      |
| content   | Text     | متن برنامه تمرینی |
| createdAt | DateTime | تاریخ ایجاد       |
| updatedAt | DateTime | آخرین ویرایش      |

## Relationships

- User (Coach) → TrainingProgram (1 : N)
- User (Member) → TrainingProgram (1 : N)

---

# 6. Product

## Purpose

اطلاعات مکمل‌های ورزشی موجود در باشگاه را نگهداری می‌کند.

## Fields

| Field       | Type    | Description  |
| ----------- | ------- | ------------ |
| id          | Integer | شناسه محصول  |
| name        | String  | نام مکمل     |
| price       | Decimal | قیمت         |
| stock       | Integer | موجودی       |
| description | String  | توضیحات      |
| status      | Boolean | وضعیت موجودی |

## Relationships

- Product → Order (1 : N)

---

# 7. Order

## Purpose

ثبت سفارش خرید مکمل توسط ورزشکار.

در این پروژه هر سفارش فقط شامل یک محصول است.

## Fields

| Field      | Type     | Description |
| ---------- | -------- | ----------- |
| id         | Integer  | شناسه سفارش |
| memberId   | FK(User) | ورزشکار     |
| productId  | FK       | محصول       |
| quantity   | Integer  | تعداد       |
| totalPrice | Decimal  | مبلغ کل     |
| orderDate  | DateTime | تاریخ سفارش |
| status     | Enum     | وضعیت سفارش |

## Relationships

- User → Order (1 : N)
- Product → Order (1 : N)

---

# 8. Equipment

## Purpose

اطلاعات تجهیزات باشگاه و وضعیت هر دستگاه را نگهداری می‌کند.

## Fields

| Field        | Type    | Description  |
| ------------ | ------- | ------------ |
| id           | Integer | شناسه دستگاه |
| name         | String  | نام دستگاه   |
| purchaseDate | Date    | تاریخ خرید   |
| status       | Enum    | وضعیت دستگاه |
| description  | String  | توضیحات      |

## Relationships

در این نسخه ارتباط مستقیمی با سایر موجودیت‌ها ندارد.

---

# 9. Salary

## Purpose

ثبت اطلاعات حقوق مربیان.

## Fields

| Field       | Type     | Description  |
| ----------- | -------- | ------------ |
| id          | Integer  | شناسه        |
| coachId     | FK(User) | مربی         |
| amount      | Decimal  | مبلغ حقوق    |
| month       | Integer  | ماه          |
| year        | Integer  | سال          |
| paymentDate | Date     | تاریخ پرداخت |
| status      | Enum     | وضعیت پرداخت |

## Relationships

- User (Coach) → Salary (1 : N)

---

# 10. Notification

## Purpose

اعلان‌های داخلی سیستم برای کاربران در این موجودیت ذخیره می‌شود.

نمونه اعلان‌ها:

- نزدیک شدن پایان اشتراک
- انتشار برنامه تمرینی
- آماده شدن سفارش مکمل

## Fields

| Field     | Type     | Description        |
| --------- | -------- | ------------------ |
| id        | Integer  | شناسه اعلان        |
| userId    | FK(User) | کاربر دریافت‌کننده |
| title     | String   | عنوان اعلان        |
| message   | Text     | متن اعلان          |
| isRead    | Boolean  | وضعیت خوانده شدن   |
| createdAt | DateTime | تاریخ ایجاد        |

## Relationships

- User → Notification (1 : N)

---

# Entity Relationships Summary

| Entity                          | Relationship |
| ------------------------------- | ------------ |
| User → Subscription             | One-to-One   |
| User → Payment                  | One-to-Many  |
| User (Coach) → TrainingProgram  | One-to-Many  |
| User (Member) → TrainingProgram | One-to-Many  |
| User → Order                    | One-to-Many  |
| User (Coach) → Salary           | One-to-Many  |
| User → Notification             | One-to-Many  |
| SubscriptionPlan → Subscription | One-to-Many  |
| Subscription → Payment          | One-to-Many  |
| Product → Order                 | One-to-Many  |

---

# Conclusion

ساختار فوق شامل ۱۰ موجودیت اصلی است که تمام نیازهای سیستم مدیریت باشگاه بدنسازی را پوشش می‌دهد. این طراحی با هدف سادگی، قابلیت توسعه و مناسب بودن برای یک پروژه دانشگاهی انجام شده است و می‌تواند مبنای طراحی پایگاه داده (Database Design) و رسم نمودار ERD قرار گیرد.
