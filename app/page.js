"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";

const LANGUAGES = [
  { code: "en-US", label: "English" },
  { code: "id-ID", label: "Indonesian" },
  { code: "es-ES", label: "Spanish" },
  { code: "fr-FR", label: "French" },
];

const langMap = {
  "en-US": "English",
  "id-ID": "Indonesian",
  "es-ES": "Spanish",
  "fr-FR": "French",
};

export default function Home() {
  const [listening, setListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [sourceLang, setSourceLang] = useState("en-US");
  const [targetLang, setTargetLang] = useState("id-ID");

  const sourceLangRef = useRef(sourceLang);
  const targetLangRef = useRef(targetLang);
  const finalTranscriptRef = useRef("");
  const translateTimeoutRef = useRef(null);

  const DEBOUNCE_DELAY = 1000; // 1 detik delay sebelum translate

  const recognition = useRef(null);

  useEffect(() => { sourceLangRef.current = sourceLang; }, [sourceLang]);
  useEffect(() => { targetLangRef.current = targetLang; }, [targetLang]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = true;
    recognition.current.lang = sourceLang;

    recognition.current.onresult = (event) => {
      let interim = "";
      let final = finalTranscriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }

      finalTranscriptRef.current = final;
      setFinalTranscript(final);
      setInterimTranscript(interim);

      if (final.trim() !== "") {
        // Debounce: tunggu beberapa saat sebelum translate
        if (translateTimeoutRef.current) clearTimeout(translateTimeoutRef.current);
        translateTimeoutRef.current = setTimeout(() => {
          callTranslateAPI(final.trim(), sourceLangRef.current, targetLangRef.current);
        }, DEBOUNCE_DELAY);
      }
    };

    recognition.current.onerror = (event) => {
      setError(event.error);
      setListening(false);
      setIsLoading(false);
    };

    recognition.current.onend = () => {
      setListening(false);
      setIsLoading(false);
    };

    return () => {
      recognition.current?.stop();
    };
  }, [sourceLang]);

  const resetAllTexts = () => {
    setInterimTranscript("");
    setFinalTranscript("");
    finalTranscriptRef.current = "";
    setTranslation("");
    setError(null);
    setIsLoading(false);
    if (translateTimeoutRef.current) clearTimeout(translateTimeoutRef.current);
  };

  const toggleListening = () => {
    if (listening) {
      recognition.current.stop();
      setListening(false);
    } else {
      resetAllTexts();
      recognition.current.lang = sourceLangRef.current;
      recognition.current.start();
      setListening(true);
    }
  };

  async function callTranslateAPI(text, currentSourceLang, currentTargetLang, retryCount = 0) {
    if (!text.trim()) return;

    const mappedSourceLang = langMap[currentSourceLang] || "English";
    const mappedTargetLang = langMap[currentTargetLang] || "Indonesian";

    setIsLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sourceLang: mappedSourceLang, targetLang: mappedTargetLang }),
      });

      const data = await res.json();

      if (res.ok) {
        setTranslation(data.output.trim());
      } else if (res.status === 429 && retryCount < 3) {
        // retry setelah 2 detik
        setTimeout(() => {
          callTranslateAPI(text, currentSourceLang, currentTargetLang, retryCount + 1);
        }, 2000);
      } else {
        setError(data.error || "Translation failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  }

  const speakTranslation = () => {
    if (!translation || isLoading) return;
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(translation);
    utterance.lang = targetLangRef.current;
    synth.speak(utterance);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Healthcare Translation</h1>

        <div className={styles.langSelectRow}>
          <select
            className={`${styles.select} ${listening ? styles.selectDisabled : ""}`}
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            disabled={listening}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>

          <select
            className={`${styles.select} ${listening ? styles.selectDisabled : ""}`}
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            disabled={listening}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>

        <button
          className={`${styles.button} ${listening ? styles.stop : styles.start}`}
          onClick={toggleListening}
        >
          {listening ? "Stop Recording" : "Start Recording"}
        </button>

        <div className={styles.textGrid}>
          <div className={styles.textBox}>
            <h2>Original Transcript</h2>
            <p>{finalTranscript}{interimTranscript || (!finalTranscript && "...")}</p>
          </div>
          <div className={styles.textBox}>
            <h2>Translated Text</h2>
            <p>{isLoading ? "Processing..." : translation || "..."}</p>
          </div>
        </div>

        <button
          className={`${styles.button} ${styles.speak}`}
          onClick={speakTranslation}
          disabled={!translation || isLoading}
        >
          Speak Translation
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </main>
  );
}
