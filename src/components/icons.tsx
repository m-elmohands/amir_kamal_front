import type { SVGProps } from "react";
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
export function Icon({
  name,
  ...props
}: { name: "tool" | "shield" | "truck" | "support" } & SVGProps<SVGSVGElement>) {
  const paths = {
    tool: "M5 15 15 5M12 4l4 4M4 12l4 4",
    shield: "M10 2l6 3v4c0 4-2.5 7-6 9-3.5-2-6-5-6-9V5l6-3Z",
    truck:
      "M2 5h10v8H2V5Zm10 3h3l3 3v2h-6V8ZM6 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
    support: "M4 11V9a6 6 0 0 1 12 0v2M4 10H2v5h4v-5H4Zm12 0h2v5h-4v-5h2Zm0 5c0 2-2 3-4 3",
  };
  return (
    <svg {...props} viewBox="0 0 20 20" fill="none">
      <path
        d={paths[name]}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
