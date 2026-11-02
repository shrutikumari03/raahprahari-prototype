import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  CircleHelp,
  Construction,
  Mountain,
  Snowflake,
  TreePine,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocalState } from "@/lib/storage";

export const Route = createFileRoute("/report")({
  validateSearch: (search: Record<string, unknown>) => ({
    segment: typeof search.segment === "string" ? search.segment : undefined,
  }),
  component: ReportPage,
});

const draftKey = "rp.reportObservationDraft";
const maxPhotoBytes = 10 * 1024 * 1024;

const hazardTypes = [
  { value: "debris", label: "Debris/Landslide", icon: Mountain },
  { value: "road-damage", label: "Road damage", icon: Construction },
  { value: "snow-ice", label: "Snow/Ice", icon: Snowflake },
  { value: "fallen-tree", label: "Fallen tree", icon: TreePine },
  { value: "flooding", label: "Flooding", icon: Waves },
  { value: "other", label: "Other", icon: CircleHelp },
] as const;

type HazardType = (typeof hazardTypes)[number]["value"];
type Step = 1 | 2 | 3;

interface Draft {
  hazardType: HazardType | "";
  description: string;
  observedAt: string;
  location: string;
}

const emptyDraft: Draft = {
  hazardType: "",
  description: "",
  observedAt: "",
  location: "",
};

const steps = ["Observation", "Location", "Review & send"];

function ReportPage() {
  const [draft, setDraft] = useLocalState<Draft>(draftKey, emptyDraft);
  const [step, setStep] = useState<Step>(1);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const updateDraft = (patch: Partial<Draft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setNotice("");
  };

  const saveDraft = () => {
    try {
      window.localStorage.setItem(draftKey, JSON.stringify(draft));
      setNotice(
        photo
          ? "Draft saved locally on this device. The photo is not retained, and the draft has not been sent or received by a server."
          : "Draft saved locally on this device. It has not been sent or received by a server.",
      );
    } catch {
      setNotice(
        "Could not save this draft on the device. Check available browser storage.",
      );
    }
  };

  const continueFromObservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.hazardType || !draft.observedAt) {
      setFormError("Choose a hazard type and enter when you observed it.");
      return;
    }
    setFormError("");
    setStep(2);
    setNotice("");
  };

  const choosePhoto = (file: File | undefined) => {
    setPhotoError("");
    if (!file) {
      setPhoto(null);
      return;
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setPhoto(null);
      setPhotoError("Choose a JPG or PNG image.");
      return;
    }
    if (file.size > maxPhotoBytes) {
      setPhoto(null);
      setPhotoError("The photo must be 10 MB or smaller.");
      return;
    }
    setPhoto(file);
  };

  const selectedHazard = hazardTypes.find(
    (hazard) => hazard.value === draft.hazardType,
  );

  return (
    <main className="grid min-h-[calc(100svh-4rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <section
        aria-label="Mountain landscape"
        className="relative isolate flex min-h-64 items-end overflow-hidden bg-muted sm:min-h-72 lg:min-h-[calc(100svh-4rem)]"
      >
        <img
          src="/img/hero-road-generated.svg"
          alt="Illustrative mountain road winding through a Himalayan valley."
          className="absolute inset-0 -z-20 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-background/75" />
        <div className="mx-auto w-full max-w-content px-5 py-7 text-foreground sm:px-8 sm:py-10 lg:px-12 lg:py-14">
          <p className="text-sm font-medium tracking-wide text-foreground/80">
            Uttarakhand road safety
          </p>
          <h2 className="mt-2 max-w-lg font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Your local knowledge helps travellers prepare.
          </h2>
          <p className="mt-3 text-sm text-foreground/80">
            Share a road condition only if you can do so without disrupting traffic.
          </p>
        </div>
      </section>

      <section className="flex min-w-0 items-center justify-center bg-background px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <Card className="w-full max-w-2xl gap-0 rounded-2xl border-border bg-card p-5 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-wide text-primary">
                Prototype mockup, synthetic data
              </p>
              <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                Report a road hazard
              </h1>
            </div>
          </div>

          <ol aria-label="Report steps" className="mb-7 grid grid-cols-3 gap-2">
            {steps.map((label, index) => {
              const number = index + 1;
              const current = step === number;
              const complete = step > number;
              return (
                <li
                  key={label}
                  aria-current={current ? "step" : undefined}
                  className="flex min-w-0 items-start gap-2"
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                      current
                        ? "border-primary bg-primary text-primary-foreground"
                        : complete
                          ? "border-primary text-primary"
                          : "border-border text-muted-foreground"
                    }`}
                  >
                    {number}
                  </span>
                  <span
                    className={`pt-1 text-xs leading-tight sm:text-sm ${
                      current
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>

          {step === 1 && (
            <form onSubmit={continueFromObservation} noValidate>
              <fieldset>
                <legend className="mb-3 text-sm font-semibold">
                  What did you observe?
                </legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {hazardTypes.map(({ value, label, icon: Icon }) => (
                    <label
                      key={value}
                      className={`flex min-h-14 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring ${
                        draft.hazardType === value
                          ? "border-primary bg-primary/10 font-medium"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      <input
                        className="sr-only"
                        type="radio"
                        name="hazardType"
                        value={value}
                        required
                        checked={draft.hazardType === value}
                        onChange={() => updateDraft({ hazardType: value })}
                      />
                      <Icon
                        aria-hidden
                        className="size-4 shrink-0 text-primary"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="description"
                    className="text-sm font-semibold"
                  >
                    Describe the condition
                  </label>
                  <span
                    aria-live="polite"
                    className="shrink-0 text-xs text-muted-foreground"
                  >
                    {draft.description.length}/500
                  </span>
                </div>
                <Textarea
                  id="description"
                  value={draft.description}
                  maxLength={500}
                  rows={3}
                  placeholder="What should other road users know?"
                  onChange={(event) =>
                    updateDraft({ description: event.target.value })
                  }
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="observedAt"
                  className="mb-2 block text-sm font-semibold"
                >
                  When did you observe it?
                </label>
                <Input
                  id="observedAt"
                  type="datetime-local"
                  required
                  value={draft.observedAt}
                  onChange={(event) =>
                    updateDraft({ observedAt: event.target.value })
                  }
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="photo"
                  className="mb-2 block text-sm font-semibold"
                >
                  Add a photo{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                  aria-describedby="photo-help"
                  aria-invalid={Boolean(photoError)}
                  onChange={(event) => choosePhoto(event.target.files?.[0])}
                />
                <p
                  id="photo-help"
                  className="mt-1.5 text-xs text-muted-foreground"
                >
                  JPG or PNG, up to 10 MB{photo ? ` · ${photo.name}` : ""}
                </p>
                {photoError && (
                  <p role="alert" className="mt-1.5 text-sm text-destructive">
                    {photoError}
                  </p>
                )}
              </div>

              <div className="mt-5 rounded-xl border border-border bg-muted/50 p-3.5 text-sm">
                <p className="font-medium">
                  Capture evidence only from a location away from traffic. Do not stop in a
                  dangerous area.
                </p>
              </div>

              {formError && (
                <p role="alert" className="mt-4 text-sm text-destructive">
                  {formError}
                </p>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11 rounded-xl"
                  onClick={saveDraft}
                >
                  Save draft
                </Button>
                <Button
                  type="submit"
                  className="min-h-11 rounded-xl px-6 font-semibold"
                >
                  Continue
                </Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-display text-xl font-semibold">Location</h2>
              <label
                htmlFor="location"
                className="mb-2 mt-5 block text-sm font-semibold"
              >
                Road or nearby landmark (optional)
              </label>
              <Input
                id="location"
                value={draft.location}
                onChange={(event) =>
                  updateDraft({ location: event.target.value })
                }
                placeholder="For example, a nearby town or milestone"
              />
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11 rounded-xl"
                  onClick={saveDraft}
                >
                  Save draft
                </Button>
                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="ghost"
                    className="min-h-11 rounded-xl"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="min-h-11 rounded-xl px-6 font-semibold"
                    onClick={() => setStep(3)}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-display text-xl font-semibold">
                Review &amp; send
              </h2>
              <dl className="mt-5 space-y-4 rounded-xl border border-border p-4 text-sm">
                <div>
                  <dt className="font-semibold">Hazard type</dt>
                  <dd className="mt-1 text-muted-foreground">
                    {selectedHazard?.label ?? "Not selected"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Condition</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-muted-foreground">
                    {draft.description || "No description provided"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Observed</dt>
                  <dd className="mt-1 text-muted-foreground">
                    {draft.observedAt || "Not specified"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Location</dt>
                  <dd className="mt-1 text-muted-foreground">
                    {draft.location || "Not specified"}
                  </dd>
                </div>
                {photo && (
                  <div>
                    <dt className="font-semibold">Photo</dt>
                    <dd className="mt-1 text-muted-foreground">{photo.name}</dd>
                  </div>
                )}
              </dl>
              <p className="mt-4 rounded-xl border border-border bg-muted/50 p-3.5 text-sm">
                Sending is not connected in this prototype. Saving keeps a draft
                on this device only; no report is sent to or received by a
                server.
              </p>
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11 rounded-xl"
                  onClick={saveDraft}
                >
                  Save draft
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="min-h-11 rounded-xl"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
              </div>
            </div>
          )}

          {notice && (
            <p role="status" className="mt-4 text-sm text-muted-foreground">
              {notice}
            </p>
          )}
        </Card>
      </section>
    </main>
  );
}
