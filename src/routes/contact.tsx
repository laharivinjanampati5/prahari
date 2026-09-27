import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/site/PageHeader";
import { meta } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => meta("Contact", "Send queries or collaboration proposals to the SIH26078 extreme weather tracking team."),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  topic: z.string().min(1),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});

function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const field = "mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm";
  return (
    <>
      <PageHeader eyebrow="Contact" title="Queries & Collaboration" />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel title="Send us a message">
            <form noValidate className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => {
              e.preventDefault();
              const r = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
              if (!r.success) { setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message]))); return; }
              setErrors({}); e.currentTarget.reset();
              toast.success("Thank you — your message has been received.");
            }}>
              <div><label htmlFor="c-name" className="text-xs font-semibold">Name</label><input id="c-name" name="name" className={field} />{errors["name"] && <p className="text-xs text-destructive">{errors["name"]}</p>}</div>
              <div><label htmlFor="c-email" className="text-xs font-semibold">Email</label><input id="c-email" name="email" type="email" className={field} />{errors["email"] && <p className="text-xs text-destructive">{errors["email"]}</p>}</div>
              <div className="sm:col-span-2"><label htmlFor="c-topic" className="text-xs font-semibold">Topic</label>
                <select id="c-topic" name="topic" className={field}><option>General query</option><option>Research collaboration</option><option>Agency integration (NDRF/NDMA)</option><option>Media</option></select></div>
              <div className="sm:col-span-2"><label htmlFor="c-msg" className="text-xs font-semibold">Message</label><textarea id="c-msg" name="message" rows={5} className={field} />{errors["message"] && <p className="text-xs text-destructive">{errors["message"]}</p>}</div>
              <button className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground sm:w-fit">Send message</button>
            </form>
          </Panel>
        </div>
        <Panel title="Office">
          <address className="text-sm not-italic leading-relaxed text-muted-foreground">
            Ministry of Earth Sciences<br />Prithvi Bhavan, Lodhi Road<br />New Delhi – 110003
          </address>
        </Panel>
      </div>
    </>
  );
}
