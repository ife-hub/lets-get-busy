"use client";

import { useState } from "react";
import {
  SmileyX,
  Crown,
  Lightning,
  Dollar,
  MusicNote,
  Leaf,
  Bee,
  Lighter,
  ShotGlass,
  XMark,
  Squiggle,
} from "@/components/Doodles";
import type { RsvpPayload, RsvpResponse } from "@/lib/types";

type FormState = Partial<RsvpPayload>;

const TOTAL_STEPS = 6;

const RESIDENCY_OPTIONS: RsvpPayload["residency"][] = ["On campus", "Off campus"];
const YES_NO: ("Yes" | "No")[] = ["Yes", "No"];
const DRINK_OPTIONS: RsvpPayload["drinks"][] = ["Hard", "Soft", "Both", "None"];
const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say"];
const SEXUALITY_OPTIONS = ["Straight", "Gay", "Bisexual", "Other", "Prefer not to say"];

export default function Page() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RsvpResponse | null>(null);

  const update = (patch: FormState) => setForm((f) => ({ ...f, ...patch }));

  const canAdvance = (): boolean => {
    switch (step) {
      case 1:
        return !!form.email && !!form.phone;
      case 2:
        return !!form.aka && !!form.gender;
      case 3:
        return !!form.residency && !!form.sexuality;
      case 4:
        return !!form.interestedEvent && !!form.interestedCommunity;
      case 5:
        return !!form.drinks;
      default:
        return true;
    }
  };

  const next = () => {
    setError(null);
    if (!canAdvance()) {
      setError("Fill in everything on this one before you move on.");
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const back = () => setStep((s) => Math.max(s - 1, 1));

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data: RsvpResponse = await res.json();
      if (!res.ok && !data.ok) {
        setError(data.error || "Something went wrong. Try again.");
        setSubmitting(false);
        return;
      }
      setResult(data);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (result) return <Confirmation result={result} aka={form.aka ?? ""} />;

  if (!started) return <Hero onStart={() => setStarted(true)} />;

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <CornerDoodles />

      <div className="w-full max-w-md relative z-10">
        <Progress step={step} />

        <div className="mt-10 min-h-[280px]">
          {step === 1 && (
            <FieldGroup title="First, how do we reach you">
              <Field label="Email">
                <input
                  type="email"
                  className="field-input"
                  placeholder="you@email.com"
                  value={form.email ?? ""}
                  onChange={(e) => update({ email: e.target.value })}
                />
              </Field>
              <Field label="Phone">
                <input
                  type="tel"
                  className="field-input"
                  placeholder="+1 555 000 0000"
                  value={form.phone ?? ""}
                  onChange={(e) => update({ phone: e.target.value })}
                />
              </Field>
            </FieldGroup>
          )}

          {step === 2 && (
            <FieldGroup title="Who's coming through">
              <Field label="Generally known as">
                <input
                  type="text"
                  className="field-input"
                  placeholder="Your name / alias"
                  value={form.aka ?? ""}
                  onChange={(e) => update({ aka: e.target.value })}
                />
              </Field>
              <Field label="Gender">
                <ChoiceRow
                  options={GENDER_OPTIONS}
                  value={form.gender}
                  onChange={(v) => update({ gender: v })}
                />
              </Field>
            </FieldGroup>
          )}

          {step === 3 && (
            <FieldGroup title="A little more about you">
              <Field label="Staying on or off campus">
                <ChoiceRow
                  options={RESIDENCY_OPTIONS}
                  value={form.residency}
                  onChange={(v) => update({ residency: v as RsvpPayload["residency"] })}
                />
              </Field>
              <Field label="Sexuality">
                <ChoiceRow
                  options={SEXUALITY_OPTIONS}
                  value={form.sexuality}
                  onChange={(v) => update({ sexuality: v })}
                />
              </Field>
            </FieldGroup>
          )}

          {step === 4 && (
            <FieldGroup title="Are you actually pulling up">
              <Field label="Interested in the event?">
                <ChoiceRow
                  options={YES_NO}
                  value={form.interestedEvent}
                  onChange={(v) => update({ interestedEvent: v as "Yes" | "No" })}
                />
              </Field>
              <Field label="Interested in a community or rave?">
                <ChoiceRow
                  options={YES_NO}
                  value={form.interestedCommunity}
                  onChange={(v) => update({ interestedCommunity: v as "Yes" | "No" })}
                />
              </Field>
            </FieldGroup>
          )}

          {step === 5 && (
            <FieldGroup title="Last thing">
              <Field label="Hard or soft drinks">
                <ChoiceRow
                  options={DRINK_OPTIONS}
                  value={form.drinks}
                  onChange={(v) => update({ drinks: v as RsvpPayload["drinks"] })}
                />
              </Field>
            </FieldGroup>
          )}

          {step === 6 && <Review form={form} />}
        </div>

        {error && <p className="text-rust text-sm mt-4 font-body">{error}</p>}

        <div className="flex items-center justify-between mt-10">
          <button
            type="button"
            onClick={back}
            disabled={step === 1 || submitting}
            className="pill-btn px-5 py-2 text-sm rounded-none disabled:opacity-20"
          >
            Back
          </button>

          {step < TOTAL_STEPS ? (
            <button type="button" onClick={next} className="pill-btn-solid px-6 py-2 text-sm">
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="pill-btn-solid px-6 py-2 text-sm"
            >
              {submitting ? "Sending…" : "Lock it in"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function Hero({ onStart }: { onStart: () => void }) {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center overflow-hidden">
      <CornerDoodles />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-sm">
        <div className="flex items-center gap-3 text-cream text-sm tracking-[0.3em] font-body uppercase">
          <span>July 31st</span>
          <Crown className="w-8 h-5 text-gold" />
          <span>10pm</span>
        </div>

        <div className="flex items-center gap-2 text-gold text-sm tracking-widest uppercase">
          <span>📍</span>
          <span>LA</span>
        </div>

        <h1 className="font-brush text-6xl sm:text-7xl leading-[0.95] text-cream mt-2">
          Let&apos;s
          <br />
          <span className="text-gold">Get</span>
          <br />
          Busy
        </h1>
        <Squiggle className="w-40 h-3 text-gold -mt-2" />

        <p className="font-hand text-2xl text-gold mt-4">w dabi-balls</p>

        <div className="border border-gold/60 px-6 py-2 mt-6 text-gold text-xs tracking-[0.3em] uppercase">
          Dress: BB
        </div>

        <p className="text-cream/70 text-xs tracking-[0.25em] uppercase mt-2">
          ✕ Strictly by invite ✕
        </p>

        <button
          type="button"
          onClick={onStart}
          className="pill-btn-solid mt-10 px-10 py-3 text-sm tracking-widest uppercase"
        >
          Fill Form
        </button>
      </div>
    </main>
  );
}

function Confirmation({ result, aka }: { result: RsvpResponse; aka: string }) {
  if (!result.interested) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
        <CornerDoodles />
        <div className="relative z-10 max-w-sm flex flex-col items-center gap-5">
          <SmileyX className="w-16 h-16 text-gold rotate-180" />
          <h1 className="font-brush text-4xl text-cream">noted.</h1>
          <p className="text-cream/70 text-sm">
            No worries{aka ? `, ${aka}` : ""} — you're logged as not interested this time.
            Catch the next one.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
      <CornerDoodles />
      <div className="relative z-10 max-w-sm flex flex-col items-center gap-6">
        <Crown className="w-14 h-8 text-gold" />
        <h1 className="font-brush text-4xl text-cream leading-tight">
          You&apos;re
          <br />
          <span className="text-gold">on the list</span>
        </h1>
        <p className="text-cream/70 text-sm">
          {aka ? `${aka}, ` : ""}your check-in QR just landed in your inbox. Show it at the
          door on July 31st.
        </p>

        {result.qrDataUrl && (
          <div className="border-4 border-gold p-2 bg-cream">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.qrDataUrl} alt="Your check-in QR code" className="w-48 h-48" />
          </div>
        )}

        {result.error && <p className="text-rust text-xs">{result.error}</p>}

        <div className="w-full border border-gold/50 mt-4 p-5 text-left">
          <p className="text-gold text-xs tracking-[0.2em] uppercase mb-3">
            Want to support the motion?
          </p>
          <PlaceholderLine label="Bank" value="OPay" />
          <PlaceholderLine label="Account name" value="DABIRA AYOBAMI ODUDE" />
          <PlaceholderLine label="Account number" value="8085780102" />
          <p className="text-cream/40 text-[11px] mt-3">
            Totally optional — swap these for your real details before launch.
          </p>
        </div>

        <p className="text-cream/40 text-[11px] tracking-[0.25em] uppercase mt-4">
          ✕ Strictly by invite ✕
        </p>
      </div>
    </main>
  );
}

function PlaceholderLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm py-1 border-b border-gold/10 last:border-none">
      <span className="text-cream/60">{label}</span>
      <span className="text-cream font-medium">{value}</span>
    </div>
  );
}

function Review({ form }: { form: FormState }) {
  const rows: [string, string | undefined][] = [
    ["Email", form.email],
    ["Phone", form.phone],
    ["Known as", form.aka],
    ["Gender", form.gender],
    ["Residency", form.residency],
    ["Sexuality", form.sexuality],
    ["Interested in event", form.interestedEvent],
    ["Interested in community/rave", form.interestedCommunity],
    ["Drinks", form.drinks],
  ];
  return (
    <FieldGroup title="Check it over">
      <div className="flex flex-col gap-1">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between text-sm py-1.5 border-b border-gold/10">
            <span className="text-cream/50">{label}</span>
            <span className="text-cream">{value || "—"}</span>
          </div>
        ))}
      </div>
    </FieldGroup>
  );
}

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-hand text-3xl text-gold">{title}</h2>
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-cream/60 text-xs tracking-[0.2em] uppercase">{label}</span>
      {children}
    </label>
  );
}

function ChoiceRow({
  options,
  value,
  onChange,
}: {
  options: string[];
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-4 py-1.5 text-sm border transition-colors ${
              active
                ? "border-gold bg-gold text-ink"
                : "border-gold/30 text-cream/80 hover:border-gold/70"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <XMark key={i} filled={i < step} className="w-4 h-4 text-gold" />
      ))}
      <span className="text-cream/40 text-xs ml-2 font-body">
        {step} / {TOTAL_STEPS}
      </span>
    </div>
  );
}

function CornerDoodles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-70 z-0">
      <SmileyX className="doodle-drift absolute top-8 left-6 w-12 h-12 text-gold/70" />
      <Lightning className="doodle-drift absolute top-1/3 left-4 w-8 h-12 text-cream/50" style={{ animationDelay: "1s" }} />
      <Leaf className="doodle-drift absolute bottom-24 left-8 w-16 h-16 text-gold/25" style={{ animationDelay: "2s" }} />
      <Bee className="doodle-drift absolute bottom-10 left-10 w-10 h-8 text-gold/60" style={{ animationDelay: "0.5s" }} />

      <Dollar className="doodle-drift absolute top-10 right-8 w-8 h-12 text-gold/70" style={{ animationDelay: "1.5s" }} />
      <MusicNote className="doodle-drift absolute top-1/2 right-6 w-10 h-10 text-gold/50" style={{ animationDelay: "2.5s" }} />
      <Lighter className="doodle-drift absolute bottom-16 right-8 w-8 h-12 text-gold/60" style={{ animationDelay: "0.8s" }} />
      <ShotGlass className="doodle-drift absolute bottom-40 right-10 w-8 h-10 text-cream/40" style={{ animationDelay: "1.8s" }} />
    </div>
  );
}
