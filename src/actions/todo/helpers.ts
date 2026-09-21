export function parseTodoFields(input: {
  title: string;
  description: string | null;
}): { title: string; description: string | null } {
  const title = input.title.trim();
  if (title === "") {
    throw new Error("Title is required");
  }
  const description =
    input.description === null ? null : input.description.trim() || null;
  return { title, description };
}
