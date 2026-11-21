
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  Scissors,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/server-api";
import { toast } from "sonner";

// Helper: Get service image
function getImage(service) {
  const image =
    service.imageUrl || service.serviceImage || service.image;

  return typeof image === "string" && image.trim()
    ? image
    : null;
}

// Helper: Get service duration
function getDuration(service) {
  const duration =
    service.duration ??
    service.estimatedDuration ??
    service.durationMinutes;

  if (typeof duration === "number") {
    return `${duration} min`;
  }

  if (typeof duration === "string" && duration.trim()) {
    return duration;
  }

  return "Duration not specified";
}

// Helper: Format price
function getPrice(price) {
  const amount = Number(price);

  if (!Number.isFinite(amount)) {
    return "Price not specified";
  }

  return `৳${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

// Helper: Get local date (avoid UTC mismatch)
function getLocalDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function ServiceDetail({ service }) {
  const router = useRouter();

  // Authentication
  const { data: session, isPending } = authClient.useSession();

  // Service information
  const image = getImage(service);
  const serviceId = String(service._id || service.id || "");
  const isActive = service.status === "active";
  const isAdmin = session?.user?.role === "admin";

  // Appointment form state
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("09:00 AM");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Predefined time slots
  const slots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
  ];

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace(
        `/sign-in?callbackUrl=${encodeURIComponent(
          `/services/${serviceId}`
        )}`
      );
    }
  }, [isPending, session?.user, router, serviceId]);

  // Handle appointment submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Authentication check
    if (!session?.user) {
      router.push(
        `/sign-in?callbackUrl=${encodeURIComponent(
          `/services/${serviceId}`
        )}`
      );
      return;
    }

    // Admin restriction
    if (isAdmin) {
      toast.error("Admins cannot create customer appointments.");
      return;
    }

    // Service validation
    if (!isActive) {
      toast.error("This service is currently unavailable.");
      return;
    }

    // Date validation
    if (!date) {
      toast.error("Please select an appointment date.");
      return;
    }

    if (date < getLocalDate()) {
      toast.error("Please select today or a future date.");
      return;
    }

    // Message validation
    if (message.trim().length > 500) {
      toast.error("Message cannot exceed 500 characters.");
      return;
    }

    if (submitting) return;

    setSubmitting(true);

    try {
      await apiRequest("/api/appointments", {
        method: "POST",
        body: JSON.stringify({
          serviceId,
          appointmentDate: date,
          timeSlot,
          message: message.trim(),
        }),
      });

      toast.success("Appointment request submitted successfully!");

      router.push("/dashboard/customer/appointments");
    } catch (error) {
      toast.error(
        error?.message || "Failed to submit appointment request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f4] px-5 py-12 dark:bg-stone-950 sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-6xl">

        {/* Back navigation */}
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#617565] transition-colors hover:text-[#203d30] dark:text-emerald-300"
        >
          <ArrowLeft className="size-4" />
          All services
        </Link>

        <article className="grid overflow-hidden rounded-3xl border border-[#e9e2d7] bg-[#fffefa] shadow-[0_24px_70px_-48px_rgba(57,43,29,0.5)] dark:border-stone-800 dark:bg-stone-900 lg:grid-cols-[1.05fr_0.95fr]">

          {/* Service image */}
          <div className="relative min-h-64 bg-[#eee8de] sm:min-h-96 lg:min-h-[560px]">
            {image ? (
              <Image
                src={image}
                alt={service.serviceName || "Salon service"}
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full min-h-64 items-center justify-center bg-[#eee8de] text-[#9a8063]">
                <Scissors className="size-14 opacity-70" />
              </div>
            )}
          </div>

          {/* Service details */}
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">

            <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#927758] dark:text-amber-200">
              <Sparkles className="size-4" />
              SALONBOOK SERVICE
            </p>

            {service.category && (
              <p className="mt-5 text-sm font-medium text-[#8b7458] dark:text-amber-200">
                {service.category}
              </p>
            )}

            <h1 className="mt-2 font-serif text-3xl leading-tight font-medium tracking-tight text-[#342c24] dark:text-stone-100 sm:text-4xl">
              {service.serviceName || "Salon service"}
            </h1>

            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#81766a] dark:text-stone-400 sm:text-base">
              {service.description ||
                "Service details have not been provided yet."}
            </p>

            {/* Price and duration */}
            <div className="mt-8 grid grid-cols-2 gap-3">

              <div className="rounded-2xl bg-[#f3f0e9] p-4 dark:bg-stone-800">
                <p className="text-xs font-medium text-[#81766a] dark:text-stone-400">
                  Price
                </p>

                <p className="mt-1 font-serif text-xl font-semibold text-[#342c24] dark:text-stone-100">
                  {getPrice(service.price)}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f3f0e9] p-4 dark:bg-stone-800">
                <p className="inline-flex items-center gap-1.5 text-xs font-medium text-[#81766a] dark:text-stone-400">
                  <Clock3 className="size-3.5" />
                  Estimated duration
                </p>

                <p className="mt-1 font-serif text-xl font-semibold text-[#342c24] dark:text-stone-100">
                  {getDuration(service)}
                </p>
              </div>

            </div>

            {/* Inactive service */}
            {!isActive && (
              <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
                This service is currently unavailable for booking.
              </div>
            )}

            {/* Admin notice */}
            {!isPending && isAdmin && (
              <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                Administrator accounts cannot request customer appointments.
              </div>
            )}

            {/* Appointment form */}
            {!isPending && session?.user && !isAdmin && isActive && (
              <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-4 rounded-2xl bg-[#f3f0e9] p-4 dark:bg-stone-800 sm:p-5"
              >
                <div>
                  <h2 className="font-serif text-xl text-[#342c24] dark:text-stone-100">
                    Request an appointment
                  </h2>

                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                    Choose your preferred date and time.
                  </p>
                </div>

                {/* Appointment date */}
                <label className="grid gap-2 text-xs font-semibold text-stone-600 dark:text-stone-300">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="size-4" />
                    Appointment date
                  </span>

                  <input
                    type="date"
                    required
                    min={getLocalDate()}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm dark:border-stone-700 dark:bg-stone-950 dark:text-white"
                  />
                </label>

                {/* Time slot */}
                <label className="grid gap-2 text-xs font-semibold text-stone-600 dark:text-stone-300">
                  Time slot

                  <select
                    required
                    value={timeSlot}
                    onChange={(event) => setTimeSlot(event.target.value)}
                    className="h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm dark:border-stone-700 dark:bg-stone-950 dark:text-white"
                  >
                    {slots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Optional message */}
                <label className="grid gap-2 text-xs font-semibold text-stone-600 dark:text-stone-300">
                  Additional message (optional)

                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    maxLength={500}
                    placeholder="Write your message..."
                    rows={3}
                    className="w-full resize-y rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-950 dark:text-white"
                  />

                  <span className="text-right font-normal text-stone-400">
                    {message.length}/500
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting || !date}
                  className="h-11 rounded-full bg-[#1f493c] text-sm font-semibold text-white transition-colors hover:bg-[#17382e] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Submitting..."
                    : "Request appointment"}
                </button>

                <p className="text-center text-xs text-stone-500 dark:text-stone-400">
                  Your appointment will remain pending until confirmed by the salon.
                </p>
              </form>
            )}

          </div>
        </article>
      </div>
    </main>
  );
}


// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { ArrowLeft, Clock3, Scissors, Sparkles } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { authClient } from "@/lib/auth-client";
// import { apiRequest } from "@/lib/server-api";
// import { toast } from "sonner";

// function getImage(service) {
//   const image = service.imageUrl || service.serviceImage || service.image;
//   return typeof image === "string" && image.trim() ? image : null;
// }

// function getDuration(service) {
//   const duration =
//     service.duration ?? service.estimatedDuration ?? service.durationMinutes;
//   if (typeof duration === "number") return `${duration} min`;
//   if (typeof duration === "string" && duration.trim()) return duration;
//   return "Duration not specified";
// }

// function getPrice(price) {
//   const amount = Number(price);
//   if (!Number.isFinite(amount)) return "Price not specified";
//   return `৳${new Intl.NumberFormat("en-BD", {
//     maximumFractionDigits: 2,
//   }).format(amount)}`;
// }

// export default function ServiceDetail({ service }) {
//   const image = getImage(service);
//   const router = useRouter();
//   const { data: session, isPending } = authClient.useSession();
//   const [date, setDate] = useState("");
//   const [timeSlot, setTimeSlot] = useState("09:00 AM");
//   const [message, setMessage] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const slots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM", "06:30 PM"];

//   useEffect(() => {
//     if (!isPending && !session?.user) {
//       router.replace(`/sign-in?callbackUrl=/services/${service._id || service.id}`);
//     }
//   }, [isPending, session, router, service]);

//   const submit = async (event) => {
//     event.preventDefault();
//     if (!session?.user) {
//       router.push(`/sign-in?callbackUrl=/services/${service._id || service.id}`);
//       return;
//     }
//     if (session.user.role === "admin") {
//       toast.error("Administrator accounts cannot create customer appointments.");
//       return;
//     }
//     setSubmitting(true);
//     try {
//       await apiRequest("/api/appointments", {
//         method: "POST",
//         body: JSON.stringify({
//           serviceId: service._id || service.id,
//           appointmentDate: date,
//           timeSlot,
//           message,
//         }),
//       });
//       toast.success("Appointment request submitted.");
//       router.push("/dashboard/customer/appointments");
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-[#faf8f4] px-5 py-12 dark:bg-stone-950 sm:px-8 sm:py-16 lg:px-12">
//       <div className="mx-auto max-w-6xl">
//         <Link
//           className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#617565] transition-colors hover:text-[#203d30] dark:text-emerald-300 dark:hover:text-emerald-200"
//           href="/services"
//         >
//           <ArrowLeft aria-hidden="true" className="size-4" />
//           All services
//         </Link>

//         <article className="grid overflow-hidden rounded-3xl border border-[#e9e2d7] bg-[#fffefa] shadow-[0_24px_70px_-48px_rgba(57,43,29,0.5)] dark:border-stone-800 dark:bg-stone-900 lg:grid-cols-[1.05fr_0.95fr]">
//           <div className="relative min-h-64 bg-[#eee8de] sm:min-h-96 lg:min-h-[560px]">
//             {image ? (
//               <Image
//                 alt={service.serviceName || "Salon service"}
//                 className="object-cover"
//                 fill
//                 priority
//                 sizes="(max-width: 1024px) 100vw, 52vw"
//                 src={image}
//                 unoptimized
//               />
//             ) : (
//               <div className="flex h-full min-h-64 items-center justify-center bg-[radial-gradient(circle_at_25%_30%,#f8f2e8_0,#e9e0d2_60%,#d8caba_100%)] text-[#9a8063]">
//                 <Scissors aria-hidden="true" className="size-14 opacity-70" strokeWidth={1.2} />
//               </div>
//             )}
//           </div>

//           <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
//             <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#927758] dark:text-amber-200">
//               <Sparkles aria-hidden="true" className="size-4" />
//               SALONBOOK SERVICE
//             </p>
//             {service.category && (
//               <p className="mt-5 text-sm font-medium text-[#8b7458] dark:text-amber-200">{service.category}</p>
//             )}
//             <h1             className="mt-2 font-serif text-3xl leading-tight font-medium tracking-tight text-[#342c24] dark:text-stone-100 sm:text-4xl">
//               {service.serviceName || "Salon service"}
//             </h1>
//             <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#81766a] dark:text-stone-400 sm:text-base">
//               {service.description || "Service details have not been provided yet."}
//             </p>

//             <div className="mt-8 grid grid-cols-2 gap-3">
//               <div className="rounded-2xl bg-[#f3f0e9] p-4 dark:bg-stone-800">
//                 <p className="text-xs font-medium text-[#81766a] dark:text-stone-400">Price</p>
//                 <p className="mt-1 font-serif text-xl font-semibold text-[#342c24] dark:text-stone-100">
//                   {getPrice(service.price)}
//                 </p>
//               </div>
//               <div className="rounded-2xl bg-[#f3f0e9] p-4 dark:bg-stone-800">
//                 <p className="inline-flex items-center gap-1.5 text-xs font-medium text-[#81766a] dark:text-stone-400">
//                   <Clock3 aria-hidden="true" className="size-3.5" />
//                   Estimated duration
//                 </p>
//                 <p className="mt-1 font-serif text-xl font-semibold text-[#342c24] dark:text-stone-100">
//                   {getDuration(service)}
//                 </p>
//               </div>
//             </div>
//             {session?.user?.role !== "admin" && (
//               <form onSubmit={submit} className="mt-6 grid gap-3 rounded-2xl bg-[#f3f0e9] p-4 dark:bg-stone-800">
//                 <h2 className="font-serif text-xl text-[#342c24] dark:text-stone-100">Request an appointment</h2>
//                 <label className="text-xs font-semibold text-stone-600 dark:text-stone-300">Date
//                   <input type="date" required min={new Date().toISOString().slice(0, 10)} value={date} onChange={(e) => setDate(e.target.value)} className="mt-2 h-11 w-full rounded-lg border border-stone-300 px-3 dark:border-stone-700 dark:bg-stone-950" />
//                 </label>
//                 <label className="text-xs font-semibold text-stone-600 dark:text-stone-300">Time slot
//                   <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className="mt-2 h-11 w-full rounded-lg border border-stone-300 px-3 dark:border-stone-700 dark:bg-stone-950">{slots.map((slot) => <option key={slot}>{slot}</option>)}</select>
//                 </label>
//                 <label className="text-xs font-semibold text-stone-600 dark:text-stone-300">Message (optional)
//                   <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="mt-2 min-h-20 w-full rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-700 dark:bg-stone-950" />
//                 </label>
//                 <button disabled={submitting} className="h-11 rounded-full bg-[#1f493c] text-sm font-semibold text-white">{submitting ? "Submitting..." : "Request appointment"}</button>
//               </form>
//             )}
//           </div>
//         </article>
//       </div>
//     </main>
//   );
// }
