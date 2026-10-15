import Link from "next/link";

export function AnnouncementBar() {
  return (
    <aside aria-label="Announcements" className="bg-indigo text-cotton">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-6 px-4 text-xs tracking-wide sm:justify-between sm:px-6 lg:px-10">
        <p className="hidden sm:block">Fugu shop at Oyarifa Crossing, Accra</p>
        <p>
          <Link href="/custom-orders" className="underline-offset-4 hover:underline">
            Custom colours at no extra cost <span aria-hidden>→</span>
          </Link>
        </p>
        <p className="hidden sm:block">Pickup or delivery · Worldwide shipping</p>
      </div>
    </aside>
  );
}
