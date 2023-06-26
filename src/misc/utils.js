export const distance = (a, b) => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));

export const rand = (min, max) => {
  const buf = new Uint32Array(1);
  window.crypto.getRandomValues(buf);
  return denormalize(buf[0] / (0xffffffff + 1), min, max);
};

export const denormalize = (norm, min, max) => {
  return norm * (max - min) + min;
};

export const randInt = (min, max) => Math.round(rand(min, max));

export const slerp = (start, end, amount) => ({
  x: start.x + (end.x - start.x) * amount,
  y: start.y + (end.y - start.y) * amount,
});

export const lerp = (start, end, amount) => {
  const t = amount / distance(start, end);
  return {
    x: (1 - t) * start.x + t * end.x,
    y: (1 - t) * start.y + t * end.y,
  };
};
