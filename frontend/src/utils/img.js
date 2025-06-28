/**
 * Build a usable <img src="…">:
 *  • If value already starts with http/https → return as-is (remote URL).
 *  • Else treat it as a filename inside Spring's /images/* handler.
 */
export const imgSrc = (nameOrUrl) =>
  nameOrUrl?.startsWith("http")
    ? nameOrUrl
    : `http://localhost:8070/images/${nameOrUrl}`;
