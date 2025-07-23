import * as React from "react"

export function Logo() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <path
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M12 4.25c-4.28 0-7.75 3.47-7.75 7.75S7.72 19.75 12 19.75 19.75 16.28 19.75 12 16.28 4.25 12 4.25z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.5"
      />
      <path
        d="M9 14.5c0 .828 1.343 1.5 3 1.5s3-.672 3-1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 10.5c0 .276-.224.5-.5.5s-.5-.224-.5-.5c0-.276.224-.5.5-.5s.5.224.5.5z"
        fill="currentColor"
      />
       <path
        d="M9 10.5c0 .276-.224.5-.5.5s-.5-.224-.5-.5c0-.276.224-.5.5-.5s.5.224.5.5z"
        fill="currentColor"
      />
      <path
        d="M17.5 12c0-3.038-2.462-5.5-5.5-5.5"
        stroke="hsl(var(--accent))"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  )
}
