"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: string;
  label: string;
}

interface ParsedValue {
  number: number;
  prefix: string;
  suffix: string;
}

const animationDuration = 1400;
type AnimationState = "idle" | "animating" | "complete";

function parseValue(value: string): ParsedValue {
  const match = value.match(/\d+(?:[.,]\d+)?/);

  if (!match || match.index === undefined) {
    return { number: 0, prefix: "", suffix: value };
  }

  return {
    number: Number(match[0].replace(",", ".")),
    prefix: value.slice(0, match.index),
    suffix: value.slice(match.index + match[0].length),
  };
}

function AnimatedValue({ value, active }: { value: string; active: boolean }) {
  const parsed = parseValue(value);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!active) return;

    let frameId = 0;
    const startTime = performance.now();

    const update = (time: number) => {
      const progress = Math.min((time - startTime) / animationDuration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCurrent(Math.round(parsed.number * easedProgress));

      if (progress < 1) frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(frameId);
  }, [active, parsed.number]);

  return `${parsed.prefix}${current}${parsed.suffix}`;
}

export function AnimatedStats({ stats }: { stats: Stat[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationState, setAnimationState] = useState<AnimationState>("idle");

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setAnimationState(reduceMotion ? "complete" : "animating");
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="numbers" ref={containerRef}>
      {stats.map((stat) => (
        <div className="number" key={stat.label} aria-label={`${stat.value} ${stat.label}`}>
          <strong aria-hidden="true">
            {animationState === "animating" ? (
              <AnimatedValue value={stat.value} active />
            ) : animationState === "complete" ? (
              stat.value
            ) : (
              "0"
            )}
          </strong>
          <span aria-hidden="true">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
