const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function generateUlid(): string {
  return encodeTime(Date.now()) + encodeRandom();
}

function encodeTime(time: number): string {
  let str = "";
  for (let i = 9; i >= 0; i--) {
    str = ENCODING[time % 32] + str;
    time = Math.floor(time / 32);
  }
  return str;
}

function encodeRandom(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let str = "";
  for (let i = 0; i < 16; i++) {
    str += ENCODING[bytes[i] % 32];
  }
  return str;
}
