import Link from "next/link";

export function AnnouncementBar() {
  return (
    <aside aria-label="Announcements" className="bg-indigo text-cotton">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-6 px-4 text-xs tracking-wide sm:justify-between sm:px-6 lg:px-10">
        <p className="hidden sm:block">Handwoven in northern Ghana · Sewn in Accra</p>
        <p>
          <Link href="/collections/fugu-wednesday" className="underline-offset-4 hover:underline">
            The Fugu Wednesday edit is here <span aria-hidden>→</span>
          </Link>
        </p>
        <p className="hidden sm:block">Delivery across Ghana &amp; worldwide</p>
      </div>
    </aside>
  );
}
