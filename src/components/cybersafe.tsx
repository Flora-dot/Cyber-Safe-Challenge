"use client";
import { ReactNode } from "react";
import {
  ShieldCheck,
  MailWarning,
  ListChecks,
  ShieldAlert,
  Paperclip,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Lock,
} from "lucide-react";
import { PhishQ, Step, remember, resultLevels } from "@/src/components/lib/challenge-data";

const btn = "inline-flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";

export function Welcome({ onStart }: { onStart: () => void }) {
  const cards = [
    { Icon: MailWarning, t: "Spot the Phish", d: "Learn to identify suspicious emails and messages." },
    { Icon: ListChecks, t: "Make the Right Call", d: "Test how you respond to common workplace security situations." },
    { Icon: ShieldAlert, t: "Stop the Attack", d: "See how small decisions can allow or stop an attack." },
  ];
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-16">
      <ShieldCheck className="mb-6 h-12 w-12 text-blue-700" />
      <h1 className="text-5xl font-bold tracking-tight text-slate-100 sm:text-6xl">CyberSafe Challenge</h1>
      <p className="mt-3 text-2xl text-blue-700">Think. Verify. Protect.</p>
      <p className="mt-6 max-w-2xl text-lg text-slate-400">Cybersecurity doesn&apos;t start with the IT team. It starts with every person who uses the organization&apos;s systems and information.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {cards.map(({ Icon, t, d }) => (
          <div key={t} className="rounded-xl border border-slate-200 bg-white p-5">
            <Icon className="mb-3 h-6 w-6 text-blue-700" />
            <h2 className="font-semibold text-slate-900">{t}</h2>
            <p className="mt-1 text-sm text-slate-600">{d}</p>
          </div>
        ))}
      </div>
      <div className="mt-10"><button onClick={onStart} className={btn}>Start Challenge <ArrowRight className="h-4 w-4" /></button></div>
    </main>
  );
}

export function ChallengeHeader({ score, current, total, label }: { score: number; current: number; total: number; label: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-6 py-3 text-sm">
        <span className="flex items-center gap-2 font-semibold text-slate-900"><ShieldCheck className="h-4 w-4 text-blue-700" /><span className="hidden sm:inline">{label}</span></span>
        <span className="text-slate-600">Question {current} of {total}</span>
        <span className="font-semibold text-slate-900">Score: {score}</span>
      </div>
      <div className="h-1.5 bg-slate-100"><div className="h-full bg-blue-700 transition-all duration-500" style={{ width: `${(current / total) * 100}%` }} /></div>
    </header>
  );
}

export function QuestionCard({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      {title && <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900">{title}</h2>}
      {children}
    </section>
  );
}

export function PhishingEmail({ q }: { q: PhishQ }) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex justify-between gap-4 text-sm text-slate-500"><span>From: <span className="text-slate-800">{q.from}</span></span><span className="shrink-0">{q.time}</span></div>
        <h3 className="mt-1 text-lg font-semibold text-slate-900">{q.subject}</h3>
      </div>
      <div className="space-y-3 px-5 py-5 text-slate-700">
        {q.body.map((p, i) => <p key={i}>{p}</p>)}
        {q.attachment && <div className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm"><Paperclip className="h-4 w-4" />{q.attachment}</div>}
        {q.cta && <div><span className="inline-block rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white">{q.cta}</span></div>}
      </div>
    </article>
  );
}

export function AnswerButton({ letter, label, state, disabled, onClick }: { letter: string; label: string; state: "idle" | "correct" | "wrong" | "dim"; disabled: boolean; onClick: () => void }) {
  const styles = { idle: "border-slate-300 bg-white hover:border-blue-700 hover:bg-blue-50", correct: "border-emerald-600 bg-emerald-50", wrong: "border-rose-600 bg-rose-50", dim: "border-slate-200 bg-white opacity-50" }[state];
  return (
    <button onClick={onClick} disabled={disabled} className={`flex w-full items-center gap-3 rounded-lg border-2 px-4 py-3 text-left font-medium text-slate-900 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 ${styles}`}>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold">{letter}</span>
      <span className="flex-1">{label}</span>
      {state === "correct" && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
      {state === "wrong" && <XCircle className="h-5 w-5 text-rose-600" />}
    </button>
  );
}

export function AnswerList({ options, selected, correct, onPick }: { options: string[]; selected: number | null; correct: number; onPick: (i: number) => void }) {
  return (
    <div className="mt-6 space-y-3">
      {options.map((o, i) => {
        const state = selected === null ? "idle" : i === correct ? "correct" : i === selected ? "wrong" : "dim";
        return <AnswerButton key={o} letter={"ABCD"[i]} label={o} state={state} disabled={selected !== null} onClick={() => onPick(i)} />;
      })}
    </div>
  );
}

export function Feedback({ right, heading, clues, text, onNext, nextLabel = "Next", points }: { right: boolean; heading?: string; clues?: string[]; text: string; onNext: () => void; nextLabel?: string; points?: number }) {
  const pts = points ?? (right ? 10 : 0);
  return (
    <div className={`mt-6 rounded-xl border-l-4 bg-white p-5 shadow-sm ${right ? "border-emerald-600" : "border-rose-600"}`}>
      <p className={`font-semibold ${right ? "text-emerald-700" : "text-rose-700"}`}>{right ? "Correct" : "Not quite"}</p>
      {heading && <h3 className="mt-3 font-semibold text-slate-900">{heading}</h3>}
      {clues && <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">{clues.map((c) => <li key={c}>{c}</li>)}</ul>}
      <p className="mt-3 text-slate-700">{text}</p>
      <div className="mt-5 flex items-center justify-between"><span className="text-lg font-bold text-slate-900">+{pts} points</span><button onClick={onNext} className={btn}>{nextLabel} <ArrowRight className="h-4 w-4" /></button></div>
    </div>
  );
}

export function StoryStep({ step, history }: { step: Step; history: Step[] }) {
  return (
    <div className="space-y-4">
      {history.map((h) => <p key={h.time} className="border-l-2 border-slate-300 pl-4 text-sm text-slate-500"><b>{h.time}</b> {h.text}</p>)}
      <div className="rounded-xl border border-slate-300 bg-white p-6 shadow-sm">
        <p className="text-2xl font-bold text-slate-900">{step.time}</p>
        <p className="mt-2 text-lg text-slate-700">{step.text}</p>
        <p className="mt-4 font-semibold text-slate-900">{step.ask}</p>
      </div>
    </div>
  );
}

export function Results({ score, max, onRestart }: { score: number; max: number; onRestart: () => void }) {
  const level = resultLevels.find((l) => score >= l.min)!;
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-4xl font-bold tracking-tight text-slate-100">Your CyberSafe Score</h1>
      <p className="mt-6 text-7xl font-bold text-blue-700">{score}<span className="text-3xl text-slate-400"> / {max}</span></p>
      <p className="mt-3 text-2xl font-semibold text-slate-200">{level.title}</p>
      <p className="text-slate-400">{level.note}</p>
      <h2 className="mt-10 text-xl font-semibold text-slate-500">Remember these 5 things</h2>
      <ol className="mt-3 space-y-2">{remember.map((r, i) => <li key={r} className="flex gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"><b className="text-blue-700">{i + 1}.</b><b className="text-slate-900">{r}</b></li>)}</ol>
      <p className="mt-10 flex items-center gap-2 text-xl font-bold text-slate-5 00"><Lock className="h-5 w-5 text-blue-400" />Cybersecurity is everyone&apos;s responsibility.</p>
      <button onClick={onRestart} className={`${btn} mt-6`}><RotateCcw className="h-4 w-4" />Take Challenge Again</button>
    </main>
  );
}
