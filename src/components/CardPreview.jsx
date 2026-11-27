import { useState } from "react";
import { Link } from "react-router-dom";
import CardStack from "./CardStack";

const samples = [
  { _id: "sample-1", firstName: "Mira", lastName: "Shah", about: "I build accessible interfaces and draw city maps." },
  { _id: "sample-2", firstName: "Jules", lastName: "Park", about: "Backend developer looking for a weekend game jam." },
  { _id: "sample-3", firstName: "Ravi", lastName: "Das", about: "I make small music apps and collect field recordings." },
];

export default function CardPreview() {
  const [choices, setChoices] = useState([]);
  const remaining = samples.slice(choices.length);
  const previous = samples[choices.length - 1];

  function choose(status, id) {
    setChoices((current) => samples[current.length]?._id === id ? [...current, status] : current);
  }

  return (
    <main className="mx-auto max-w-2xl py-8">
      <div className="px-6">
        <Link to="/" className="link link-hover">Back to feed</Link>
        <h1 className="mt-5 text-2xl font-bold">Card preview</h1>
        <p>Try Ignore or Interested on three sample profiles. Your choices stay in this tab.</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button className="btn btn-sm" disabled={!choices.length} onClick={() => setChoices([])}>
            Reset stack
          </button>
          <span role="status">
            {previous && `${choices.at(-1)} · ${previous.firstName}. `}
            {remaining.length ? `Card ${choices.length + 1} of ${samples.length}` : "All cards tried."}
          </span>
        </div>
      </div>
      {remaining.length > 0 && <CardStack profiles={remaining} onDecision={choose} />}
    </main>
  );
}
