const iconPaths: Record<string, string> = {
  Heart:
    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  Clock:
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 0v10l4 2",
  Zap: "M13 2L3 14h9l-1 10 10-12h-9l1-10z",
  HelpCircle:
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 0M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01",
  Users:
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm12 10v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75",
  MapPin:
    "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  Monitor:
    "M2 3h20v14H2zm0 0M8 21h8m-4-4v4",
  PieChart:
    "M21.21 15.89A10 10 0 1 1 8 2.83m14 8.17A10 10 0 0 0 12 2v10z",
  MessageSquare:
    "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  Info: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 9v4m0-8h.01",
};

export function Icon({
  name,
  className = "w-6 h-6",
}: {
  name: string;
  className?: string;
}) {
  const d = iconPaths[name];
  if (!d) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
      </svg>
    );
  }
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}
