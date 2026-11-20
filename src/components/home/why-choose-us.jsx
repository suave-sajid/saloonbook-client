import {
  CalendarDays,
  Heart,
  Sparkles,
  WalletCards,
} from "lucide-react";

const reasons = [
  {
    title: "Professional Salon Services",
    description:
      "Discover thoughtfully presented salon services and beauty treatments in one place.",
    icon: Sparkles,
    className: "bg-[#e9ede5] text-[#45624e]",
  },
  {
    title: "Easy Appointment Booking",
    description:
      "Explore service details and compare options to make a more informed choice.",
    icon: CalendarDays,
    className: "bg-[#f0e7dc] text-[#8e6d4c]",
  },
  {
    title: "Transparent Pricing",
    description:
      "Review listed prices and estimated service durations before you decide.",
    icon: WalletCards,
    className: "bg-[#eae8df] text-[#746b4c]",
  },
  {
    title: "Customer-Focused Experience",
    description:
      "Find salon information and service details through a clear, convenient experience.",
    icon: Heart,
    className: "bg-[#f1e4e1] text-[#956b61]",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      aria-labelledby="why-choose-us-title"
      className="bg-[#faf8f4] px-5 py-20 dark:bg-stone-950 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
        <div className="max-w-lg">
          <p className="mb-4 text-[11px] font-semibold tracking-[0.2em] text-[#927758] dark:text-amber-200 sm:text-xs">
            A BETTER WAY TO FIND YOUR CARE
          </p>
          <h2
            className="font-serif text-3xl leading-tight font-medium tracking-tight text-[#342c24] dark:text-stone-100 sm:text-4xl lg:text-[42px]"
            id="why-choose-us-title"
          >
            Why Choose SalonBook?
          </h2>
          <p className="mt-5 text-sm leading-7 text-[#81766a] dark:text-stone-400 sm:text-base">
            Everything you need for a more convenient and enjoyable salon
            experience.
          </p>
          <div className="mt-8 hidden h-px w-24 bg-[#c4ad8c] lg:block" />
        </div>

        <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2 sm:gap-y-11">
          {reasons.map(({ title, description, icon: Icon, className }, index) => (
            <article
              className="relative pl-[68px]"
              key={title}
            >
              <span
                aria-hidden="true"
                className={`absolute left-0 top-0 flex size-12 items-center justify-center rounded-2xl ${className} dark:brightness-90`}
              >
                <Icon className="size-5" strokeWidth={1.7} />
              </span>
              <p className="mb-1 text-[10px] font-semibold tracking-[0.16em] text-[#a28a6c] dark:text-amber-200">
                0{index + 1}
              </p>
              <h3 className="font-serif text-lg font-semibold text-[#342c24] dark:text-stone-100 sm:text-xl">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#81766a] dark:text-stone-400">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
