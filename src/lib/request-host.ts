/**
 * Host detection for ADR-030 (one engine, many domains).
 *
 * The route loader runs on both sides, so the server-only header read is
 * isolated behind createIsomorphicFn: the client branch reads the browser
 * location, the server branch reads the request header. This keeps
 * `@tanstack/react-start/server` out of the client bundle.
 */
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

export const getCurrentHost = createIsomorphicFn()
  .client((): string | null => window.location.host)
  .server((): string | null => getRequestHeader("host") ?? null);
