import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import QuoteCard from "./components/QuoteCard";

const QUOTES = [
  { quote: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { quote: "What we think, we become.", author: "Buddha" },
  { quote: "The only way out is through.", author: "Robert Frost" },
  { quote: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { quote: "Well begun is half done.", author: "Aristotle" },
];

function randomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

// PUBLIC_INTERFACE
export default function App() {
  /** This is the root application component for the quote generator UI. */
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem("name") || "";
    } catch {
      return "";
    }
  });

  const [current, setCurrent] = useState(() => randomQuote());

  useEffect(() => {
    try {
      localStorage.setItem("name", name);
    } catch {
      // ignore storage errors
    }
  }, [name]);

  const greeting = useMemo(() => {
    const trimmed = (name || "").trim();
    return trimmed ? `Hello, ${trimmed}` : "Hello";
  }, [name]);

  const handleNewQuote = useCallback(() => {
    setCurrent(randomQuote());
  }, []);

  return (
    <div className="appShell">
      <main className="appMain">
        <header className="appHeader">
          <h1 className="appTitle">Quote Generator</h1>
          <p className="appGreeting">{greeting}</p>

          <div className="nameRow" aria-label="Name input">
            <label className="nameRow__label" htmlFor="nameInput">
              Your name
            </label>
            <input
              id="nameInput"
              className="nameRow__input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Optional"
              autoComplete="name"
            />
          </div>
        </header>

        <QuoteCard
          quote={current.quote}
          author={current.author}
          onNewQuote={handleNewQuote}
        />
      </main>
    </div>
  );
}
