import { Palette, Smartphone, Store, Truck } from "lucide-react";

const items = [
  { icon: Store, title: "Shop in Accra", text: "Oyarifa Crossing, pickup any day" },
  { icon: Truck, title: "Delivery worldwide", text: "Across Ghana and abroad" },
  { icon: Smartphone, title: "MoMo & card", text: "MTN, Telecel, AT, Visa, Mastercard" },
  { icon: Palette, title: "Custom colours", text: "At no extra cost" },
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
