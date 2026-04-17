export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatTheta(value: number) {
  return value.toFixed(2);
}

export function formatCi(theta: number, se: number) {
  return `[${(theta - se).toFixed(2)}, ${(theta + se).toFixed(2)}]`;
}

export function formatRelativeTime(value: string) {
  const target = new Date(value).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - target);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) {
    return `${Math.max(1, minutes)}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatLocalDateTime(value: string) {
  return new Date(value).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
