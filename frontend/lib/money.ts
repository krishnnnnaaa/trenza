export const testMoney = "hello";

export const toPaise = (value: string | number): number => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
};

export const lineTotal = (price: string, quantity: number): number => {
  return (toPaise(price) * quantity) / 100;
};