import { Hand, RotateCcw, Smartphone, Truck } from "lucide-react";
import { siteConfig } from "@/lib/config";

const items = [
  { icon: Hand, title: "Woven by hand", text: "Every strip made on a narrow loom" },
  { icon: Smartphone, title: "MoMo & card", text: "MTN, Telecel, AT, Visa, Mastercard" },
  { icon: Truck, title: "Ghana & worldwide", text: "Tracked delivery to your door" },
  { icon: RotateCcw, title: `${siteConfig.returnWindowDays}-day returns`, text: "On ready-to-ship pieces" },
];

export function TrustStrip() {
  return (
    <section aria-label="Why shop with us" className="border-y border-line bg-cotton-deep/60">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-6 px-4 py-7 sm:px-6 lg:grid-cols-4 lg:px-10">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-cotton text-indigo ring-1 ring-line">
              <Icon className="size-[18px]" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs leading-relaxed text-muted sm:text-sm">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
