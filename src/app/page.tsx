"use client";
import { useState } from "react";
import { questions, phishOptions, PHISH_CORRECT, round3, round3Start, Choice, Step } from "@/src/components/lib/challenge-data";
import { Welcome, ChallengeHeader, QuestionCard, PhishingEmail, AnswerList, Feedback, StoryStep, Results } from "@/src/components/cybersafe";

const TOTAL = 15, MAX = 150;



export default function Page() {
  const [stage, setStage] = useState<"welcome" | "quiz" | "results">("welcome");
  const [index, setIndex] = useState(0); // 0-9 = rounds 1 and 2; 10 = round 3
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [stepId, setStepId] = useState(round3Start);
  const [path, setPath] = useState<Step[]>([]);
  const [ending, setEnding] = useState<Choice["end"] | null>(null);

  const restart = () => { setStage("welcome"); setIndex(0); setScore(0); setSelected(null); setStepId(round3Start); setPath([]); setEnding(null); };
  const next = () => { setSelected(null); setIndex(index + 1); };

  if (stage === "welcome") return <Welcome onStart={() => setStage("quiz")} />;
  if (stage === "results") return <Results score={score} max={MAX} onRestart={restart} />;

  // Rounds 1 and 2
  if (index < questions.length) {
    const q = questions[index];
    const isPhish = q.round === 1;
    const correct = q.round === 1 ? PHISH_CORRECT : q.correct;
    const right = selected === correct;
    const pick = (i: number) => { setSelected(i); if (i === correct) setScore((s) => s + 10); };
    return (
      <div className="min-h-screen bg-slate-50">
        <ChallengeHeader score={score} current={index + 1} total={TOTAL} label={isPhish ? "Round 1: Spot the Phish" : "Round 2: What Would You Do?"} />
        <QuestionCard title={q.round === 2 ? q.prompt : undefined}>
          {q.round === 1 ? <PhishingEmail q={q} /> : <p className="-mt-3 text-lg text-slate-600">{q.detail} What do you do?</p>}
          {isPhish && <p className="mt-6 text-xl font-semibold text-slate-900">What would you do?</p>}
          <AnswerList options={q.round === 1 ? phishOptions : q.options} selected={selected} correct={correct} onPick={pick} />
          {selected !== null && (q.round === 1
            ? <Feedback right={right} heading="Why this is suspicious" clues={q.clues} text={(right ? "" : "The best action is to report it. ") + q.lesson} onNext={next} />
            : <Feedback right={right} text={q.explanation} onNext={next} />)}
        </QuestionCard>
      </div>
    );
  }

  // Round 3: branching story
  const step = round3[stepId];
  const choose = (c: Choice) => {
    setPath((p) => [...p, step]);
    if (c.next) setStepId(c.next);
    else if (c.end) { setEnding(c.end); setScore((s) => s + c.end!.points); }
  };
  const current = ending ? TOTAL : TOTAL - 4 + Math.min(path.length, 3);
  return (
    <div className="min-h-screen bg-slate-50">
      <ChallengeHeader score={score} current={current} total={TOTAL} label="Round 3: Stop the Attack" />
      <QuestionCard title="Can You Stop the Attack?">
        <StoryStep step={step} history={path} />
        {!ending && (
          <div className="mt-6 space-y-3">
            {step.choices.map((c, i) => (
              <button key={c.label} onClick={() => choose(c)} className="flex w-full items-center gap-3 rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-left font-medium text-slate-900 transition hover:border-blue-700 hover:bg-blue-50">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold">{"ABCD"[i]}</span>{c.label}
              </button>
            ))}
          </div>
        )}
        {ending && <Feedback right={ending.good} heading={ending.title} text={ending.text} points={ending.points} nextLabel="See my score" onNext={() => setStage("results")} />}
      </QuestionCard>
    </div>
  );
}
