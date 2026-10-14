import { Container, SectionHeading } from "@/components/ui/container";
import { Stars } from "@/components/ui/rating";

/* SAMPLE quotes for design review. Replace with approved customer reviews (FR-CON-1) before launch. */
const quotes = [
  { body: "The weave is tight and the indigo is so deep. I've had compliments every single Wednesday.", name: "Kwame A.", place: "Accra" },
  { body: "Ordered from London and it arrived in six days, beautifully wrapped. It felt like a piece of home.", name: "Akosua M.", place: "London" },
  { body: "They called me on WhatsApp to check my measurements before starting. The fit on my wedding day was perfect.", name: "Efua D.", place: "Houston" },
];

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Kind words" title="Worn and loved" align="center" />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {quotes.map((q) => (
            <li key={q.name}>
              <figure className="flex h-full flex-col rounded-2xl bg-white/60 p-7 ring-1 ring-line">
                <Stars value={5} />
                <blockquote className="mt-5 flex-1 font-display text-xl leading-snug">“{q.body}”</blockquote>
                <figcaption className="mt-6 text-sm text-muted">
                  <span className="font-medium text-ink">{q.name}</span> · {q.place} · Verified buyer
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
