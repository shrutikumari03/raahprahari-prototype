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

export function ContactPage() {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [notice, setNotice] = useState(false);

  function validateField(field: ContactField, value: string) {
    const trimmedValue = value.trim();
    if (field === "name" && !trimmedValue) return "Enter your name.";
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
      return "Enter a valid email address.";
    }
    if (field === "message" && !trimmedValue) return "Enter a message.";
    return undefined;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const nextErrors: ContactErrors = {};

    const nameError = validateField("name", name);
    const emailError = validateField("email", email);
    const messageError = validateField("message", message);
    if (nameError) nextErrors.name = nameError;
    if (emailError) nextErrors.email = emailError;
    if (messageError) nextErrors.message = messageError;

    setErrors(nextErrors);
    setNotice(Object.keys(nextErrors).length === 0);
  }

  function validateOnBlur(field: ContactField, value: string) {
    const error = validateField(field, value);
    setErrors((previous) => {
      if (previous[field] === error) return previous;
      const next = { ...previous };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
    setNotice(false);
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
                onBlur={(event) =>
                  validateOnBlur("name", event.currentTarget.value)
                }
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
                We’ll only use this address to respond.
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
                onBlur={(event) =>
                  validateOnBlur("email", event.currentTarget.value)
                }
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
                onBlur={(event) =>
                  validateOnBlur("message", event.currentTarget.value)
                }
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
