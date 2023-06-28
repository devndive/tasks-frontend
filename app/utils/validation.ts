
export function validateName(name: string): string | undefined {
  if (name.length < 3) {
    return "That name is too short";
  }

  return "";
}
