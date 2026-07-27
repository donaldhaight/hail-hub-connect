import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader, Section, Prose } from "@/components/briefing/PageShell";
import { routeHead } from "@/lib/site";

const TITLE = "Why PrepareAmerica";
const DESC =
  "Why 300 seats, one room, one day at Gratitude Ranch on 11-1-2026 is the right convening moment for the ClaimStore network.";

export const Route = createFileRoute("/why-prepare-america")({
  head: () => routeHead({ title: TITLE, description: DESC, path: "/why-prepare-america" }),
  component: WhyPrepareAmericaPage,
});

function WhyPrepareAmericaPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Briefing · Convening"
        title="Why one room, one day, three hundred seats."
        lede="Category networks are not started in press releases. They are started in rooms — small enough to qualify every attendee, large enough that the room itself is proof the network exists."
        confidentiality="C0"
        truth="ASSERTION"
      />

      <Section number="01" title="The shape of the day">
        <Prose>
          <p>
            The first annual PrepareAmerica Conference will be held on{" "}
            <strong>November 1, 2026</strong> at{" "}
            <strong>Gratitude Ranch in Flower Mound, Texas</strong>, capped
            at <strong>300 seats</strong>. The attendee mix is deliberate:
            C-level industry executives, venture and strategic capital,
            well-capitalized contractors, restructuring counsel, and
            government think tanks.
          </p>
          <p>
            Every seat is individually qualified. Every attendee is on the
            record. Every session is designed to produce a decision, a
            commitment, or a documented open question — not a panel photo.
          </p>
        </Prose>
      </Section>

      <Section number="02" title="Why this room, not a bigger one">
        <Prose>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong>Qualification is the product.</strong> A 3,000-seat
              conference is a marketing expense. A 300-seat, individually
              vetted room is an operating asset.
            </li>
            <li>
              <strong>Signal, not noise.</strong> The people in the room
              become the first insider layer of the network.
            </li>
            <li>
              <strong>Founder-scale trust.</strong> One founder can look
              300 people in the eye in one day. That is the correct scale
              for phase zero.
            </li>
          </ul>
        </Prose>
      </Section>

      <Section number="03" title="What happens next">
        <Prose>
          <p>
            Applications for a seat are open at{" "}
            <Link to="/prepare-america">/prepare-america</Link>. Seats are
            allocated with a hard cap; overflow is waitlisted and promoted
            as seats free.
          </p>
          <p>
            If you would like a private briefing before the conference,{" "}
            <Link to="/request-briefing">request one here</Link>.
          </p>
        </Prose>
      </Section>
    </PageShell>
  );
}
