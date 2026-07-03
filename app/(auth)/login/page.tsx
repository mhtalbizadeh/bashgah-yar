import Image from "next/image";
import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl bg-white p-10 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 items-center justify-center">
            <Image
              src="/logo-mark.png"
              alt="باشگاه‌یار"
              width={144}
              height={105}
              className="h-full w-auto"
            />
          </div>
          <p className="text-sm font-bold text-primary">سامانه مدیریت باشگاه‌یار</p>
          <p className="mt-1 text-sm text-slate-500">ورود به حساب کاربری</p>
        </div>

        <div className="mt-10">
          <h1 className="text-lg font-bold text-slate-800">خوش آمدید</h1>
          <p className="mt-1 text-sm text-slate-500">
            لطفاً مشخصات خود را برای ورود وارد کنید
          </p>
        </div>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
