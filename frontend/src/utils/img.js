/**
 * Build a usable <img src="…">:
 *  • If value already starts with http/https → return as-is (remote URL).
 *  • Else treat it as a filename inside Spring's /images/* handler.
 */
export const imgSrc = (nameOrUrl) =>
  nameOrUrl?.startsWith("http")
    ? nameOrUrl
    : `${process.env.REACT_APP_API_BASE_URL}/images/${nameOrUrl}`;
