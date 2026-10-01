// Fixed-length digest comparison avoids direct variable-length secret comparison.
// The host must supply a private token. Missing configuration denies tool calls.
export async function authenticate(request, secret) {
  if (typeof secret !== 'string' || !secret.length) return false;
  const header = request.headers.get('authorization') ?? '';
  if (!header.startsWith('Bearer ') || header.length > 8192) return false;
  const hash = async value => new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
  const [actual, expected] = await Promise.all([hash(header.slice(7)), hash(secret)]);
  let difference = 0;
  for (let i = 0; i < expected.length; i++) difference |= actual[i] ^ expected[i];
  return difference === 0;
}
