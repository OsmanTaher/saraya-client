import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const TricycleIcon = ({
  size = 20,
  className = "",
  ...props
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#615FFF"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="4.5" cy="18" r="2.5" />

    <circle cx="18.5" cy="18" r="2.5" />

    <path d="M4.5 15.5L7.5 8.5" />
    <path d="M6 8.5h3.5" />
    <path d="M4 11.5h1.5" />

    <path d="M7 16h3.5v-3.5H8.5" />

    <path d="M11 14.5V5.5a1.5 1.5 0 0 1 1.5-1.5h1" />

    <path d="M10.5 14.5H21.5V9.5H11" />
    <path d="M16.5 9.5v5" />
  </svg>
);
