import { ArrowRight, Building2, User, Users } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { whatsappLink } from "@/lib/config";

const AUDIENCES = [
  { icon: User, title: "Individuals", text: "Your own colourway for a wedding, birthday or a statement smock." },
  { icon: Users, title: "Groups", text: "Bridal parties, families and friends in matching or coordinated cloth." },
  { icon: Building2, title: "Companies & institutions", text: "Cloth and outfits for staff, events, uniforms and corporate gifts." },
];

export function CustomOrdersTeaser() {
  return (
    <section className="bg-cotton-deep/70 py-16 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow text-clay">Custom orders</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">We customise for individuals, groups and companies</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            Choose your own colourway at no extra cost. Tell us what you need and we&apos;ll call you to agree the design, price and timing.
          </p>
        </div>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {AUDIENCES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl bg-cotton p-7 ring-1 ring-line">
              <Icon className="size-6 text-clay" strokeWidth={1.75} />
              <h3 className="mt-5 text-2xl">{title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <LinkButton href="/custom-orders" size="lg">
            Start a custom order <ArrowRight className="size-4" />
          </LinkButton>
          <LinkButton href={whatsappLink("Hello Fugu Tribe, I'd like to talk about a custom order.")} target="_blank" rel="noopener noreferrer" size="lg" variant="outline">
            Chat on WhatsApp
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
