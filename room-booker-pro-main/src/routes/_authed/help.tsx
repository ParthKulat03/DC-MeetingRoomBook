import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/States";

export const Route = createFileRoute("/_authed/help")({
  head: () => ({
    meta: [
      { title: "Help | Meeting Room Booking" },
      { name: "description", content: "How to book, change and cancel a corporate meeting room." },
      { property: "og:title", content: "Help | Meeting Room Booking" },
      { property: "og:description", content: "Guidance for booking corporate meeting rooms." },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  ["How do I book a room?", "Open Book a Room, pick a date and room, then drag across the 15-minute slots."],
  ["Can I change a booking?", "Cancel the booking from My Bookings and create a new one."],
  ["Why is a slot grey?", "Grey slots are already booked or in the past."],
  ["Who approves my account?", "Your administrator approves new employee accounts."],
];

function HelpPage() {
  return (
    <>
      <PageHeader title="Help" description="Everything you need to book a room in under a minute." />
      <div className="grid gap-4 md:grid-cols-2">
        {faqs.map(([q, a]) => (
          <Card key={q}>
            <CardHeader>
              <CardTitle className="text-base">{q}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{a}</CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
