import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "activity"
  | "alertCircle"
  | "alertTriangle"
  | "arrowLeft"
  | "arrowRight"
  | "bell"
  | "briefcase"
  | "calendar"
  | "chart"
  | "check"
  | "chevronDown"
  | "copy"
  | "circle"
  | "clock"
  | "creditCard"
  | "database"
  | "dollar"
  | "download"
  | "externalLink"
  | "eye"
  | "filter"
  | "grid"
  | "home"
  | "layers"
  | "lock"
  | "lockKeyhole"
  | "logout"
  | "mail"
  | "menu"
  | "message"
  | "plus"
  | "search"
  | "settings"
  | "shield"
  | "shoppingBag"
  | "spark"
  | "store"
  | "trendUp"
  | "upload"
  | "user"
  | "users"
  | "wallet"
  | "x";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

const paths: Record<IconName, ReactNode> = {
  activity: <path d="M22 12h-4l-3 8-6-16-3 8H2" />,
  alertCircle: <path d="M12 8v5m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  alertTriangle: <path d="M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20h15.8a2 2 0 0 0 1.7-2.5L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4m0 4h.01" />,
  arrowLeft: <path d="M19 12H5m7-7-7 7 7 7" />,
  arrowRight: <path d="M5 12h14m-7-7 7 7-7 7" />,
  bell: <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-3 13a3 3 0 0 1-6 0" />,
  briefcase: <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1m-9 0h14a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a2 2 0 0 1 2-2Zm3 5h8" />,
  calendar: <path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v13a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2Z" />,
  chart: <path d="M4 19V5m0 14h16M8 16V9m4 7V6m4 10v-4" />,
  check: <path d="m5 13 4 4L19 7" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  copy: <path d="M8 8h11v11H8V8Zm-3 8H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v1" />,
  circle: <circle cx="12" cy="12" r="8" />,
  clock: <path d="M12 7v5l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  creditCard: <path d="M3 8h18M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm2 10h4" />,
  database: <path d="M4 6c0 2 4 4 8 4s8-2 8-4-4-4-8-4-8 2-8 4Zm0 0v6c0 2 4 4 8 4s8-2 8-4V6M4 12v6c0 2 4 4 8 4s8-2 8-4v-6" />,
  dollar: <path d="M12 2v20m5-16H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />,
  download: <path d="M12 3v12m0 0 5-5m-5 5-5-5M4 21h16" />,
  externalLink: <path d="M14 3h7v7m0-7-9 9M20 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5" />,
  eye: <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
  filter: <path d="M4 6h16M7 12h10m-7 6h4" />,
  grid: <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" />,
  home: <path d="m3 11 9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V11Z" />,
  layers: <path d="m12 2 9 5-9 5-9-5 9-5Zm-7 9 7 4 7-4M5 16l7 4 7-4" />,
  lock: <path d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6V11Z" />,
  lockKeyhole: <path d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6V11Zm6 4v2" />,
  logout: <path d="M10 17l5-5-5-5m5 5H3m7-9h8a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-8" />,
  mail: <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 3 8 5 8-5" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  message: <path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-7a8 8 0 1 1 18-4Z" />,
  plus: <path d="M12 5v14m-7-7h14" />,
  search: <path d="m21 21-5-5m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />,
  settings: <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-6v3m0 14v3m10-10h-3M5 12H2m17.1-7.1-2.1 2.1M7 17l-2.1 2.1m14.2 0L17 17M7 7 4.9 4.9" />,
  shield: <path d="M12 2 5 5v6c0 5 3 9 7 11 4-2 7-6 7-11V5l-7-3Z" />,
  shoppingBag: <path d="M6 8h12l1 13H5L6 8Zm3 0a3 3 0 0 1 6 0" />,
  spark: <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Zm7 13 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />,
  store: <path d="M4 10h16l-1-5H5l-1 5Zm1 0v10h14V10M8 20v-6h8v6" />,
  trendUp: <path d="M3 17 9 11l4 4 8-8m-6 0h6v6" />,
  upload: <path d="M12 21V9m0 0 5 5m-5-5-5 5M4 3h16" />,
  user: <path d="M20 21a8 8 0 0 0-16 0m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />,
  users: <path d="M16 21a6 6 0 0 0-12 0m9-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm8 13a5 5 0 0 0-5-5m1-12a3 3 0 0 1 0 6" />,
  wallet: <path d="M4 7h15a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h13m1 9h.01" />,
  x: <path d="m6 6 12 12M18 6 6 18" />,
};

export function Icon({ name, className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
