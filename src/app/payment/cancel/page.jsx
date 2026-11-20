import Link from "next/link";

export default function PaymentCancel() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#faf8f4] px-5 dark:bg-stone-950">
      <div className="max-w-lg rounded-3xl border border-stone-200 bg-white p-8 text-center dark:border-stone-800 dark:bg-stone-900">
        <h1 className="font-serif text-3xl text-[#342c24] dark:text-stone-100">Payment cancelled</h1>
        <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">No payment was completed. You can retry from your appointment when ready.</p>
        <Link href="/dashboard/customer/appointments" className="mt-6 inline-flex rounded-full bg-[#1f493c] px-5 py-3 text-sm font-semibold text-white">Return to appointments</Link>
      </div>
    </main>
  );
}
