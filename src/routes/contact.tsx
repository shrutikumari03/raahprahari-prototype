import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageBanner } from "@/components/page-banner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact | RaahPrahari" }] }),
  component: ContactPage,
});

type ContactField = "name" | "email" | "message";
type ContactErrors = Partial<Record<ContactField, string>>;

function ContactPage() {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [notice, setNotice] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const nextErrors: ContactErrors = {};

    if (!name) nextErrors.name = "Enter your name.";
    if (!email) {
      nextErrors.email = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!message) nextErrors.message = "Enter a message.";

    setErrors(nextErrors);
    setNotice(Object.keys(nextErrors).length === 0);
  }

  function clearFieldError(field: ContactField) {
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
    setNotice(false);
  }

  return (
    <div className="rp-info-page">
      <PageBanner
        eyebrow="CONTACT"
        title="Contact"
        description="This prototype has no message-delivery service. Submissions are not sent."
      />
      <div className="rp-info-container rp-info-content">
        <section
          className="rp-info-card mx-auto max-w-2xl"
          aria-labelledby="contact-form-title"
        >
          <h2 id="contact-form-title">Send a message</h2>
          <p className="mb-5">
            Complete the fields below. The form checks your input locally and
            does not send or store your message.
          </p>
          <form className="rp-contact-form" onSubmit={handleSubmit} noValidate>
            <div className="rp-contact-field">
              <label htmlFor="contact-name">Name</label>
              <p id="contact-name-help" className="rp-contact-help">
                Enter the name you would like to use.
              </p>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={100}
                required
                aria-invalid={Boolean(errors.name)}
                aria-describedby={`contact-name-help${errors.name ? " contact-name-error" : ""}`}
                className="rp-contact-control"
                onChange={() => clearFieldError("name")}
              />
              {errors.name && (
                <p
                  id="contact-name-error"
                  className="rp-contact-error"
                  role="alert"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div className="rp-contact-field">
              <label htmlFor="contact-email">Email</label>
              <p id="contact-email-help" className="rp-contact-help">
                Enter a valid email address.
              </p>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby={`contact-email-help${errors.email ? " contact-email-error" : ""}`}
                className="rp-contact-control"
                onChange={() => clearFieldError("email")}
              />
              {errors.email && (
                <p
                  id="contact-email-error"
                  className="rp-contact-error"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="rp-contact-field">
              <label htmlFor="contact-message">Message</label>
              <p id="contact-message-help" className="rp-contact-help">
                Do not include sensitive or emergency information.
              </p>
              <textarea
                id="contact-message"
                name="message"
                maxLength={2000}
                required
                aria-invalid={Boolean(errors.message)}
                aria-describedby={`contact-message-help${errors.message ? " contact-message-error" : ""}`}
                className="rp-contact-control rp-contact-message"
                onChange={() => clearFieldError("message")}
              />
              {errors.message && (
                <p
                  id="contact-message-error"
                  className="rp-contact-error"
                  role="alert"
                >
                  {errors.message}
                </p>
              )}
            </div>

            {notice && (
              <p className="rp-contact-notice" role="status" aria-live="polite">
                Not connected in this prototype. Your message was not sent.
              </p>
            )}
            <Button type="submit" className="min-h-11 w-fit rounded-xl">
              Submit message
            </Button>
          </form>
          <p className="rp-contact-emergency">
            In an emergency, contact local emergency services.
          </p>
        </section>
      </div>
    </div>
  );
}
