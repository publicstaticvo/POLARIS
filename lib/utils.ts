export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatTheta(value: number) {
  return value.toFixed(2);
}

export function formatCi(theta: number, se: number) {
  return `[${(theta - se).toFixed(2)}, ${(theta + se).toFixed(2)}]`;
}
