export interface Unit {
  id: string;
  label: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

export interface Category {
  name: string;
  units: Unit[];
}

function linear(factor: number): Pick<Unit, "toBase" | "fromBase"> {
  return { toBase: (v) => v * factor, fromBase: (v) => v / factor };
}

export const categories: Category[] = [
  {
    name: "Length",
    units: [
      { id: "mm", label: "Millimeters", ...linear(0.001) },
      { id: "cm", label: "Centimeters", ...linear(0.01) },
      { id: "m", label: "Meters", ...linear(1) },
      { id: "km", label: "Kilometers", ...linear(1000) },
      { id: "in", label: "Inches", ...linear(0.0254) },
      { id: "ft", label: "Feet", ...linear(0.3048) },
      { id: "yd", label: "Yards", ...linear(0.9144) },
      { id: "mi", label: "Miles", ...linear(1609.344) },
    ],
  },
  {
    name: "Weight",
    units: [
      { id: "mg", label: "Milligrams", ...linear(0.001) },
      { id: "g", label: "Grams", ...linear(1) },
      { id: "kg", label: "Kilograms", ...linear(1000) },
      { id: "oz", label: "Ounces", ...linear(28.3495) },
      { id: "lb", label: "Pounds", ...linear(453.592) },
    ],
  },
  {
    name: "Temperature",
    units: [
      { id: "c", label: "Celsius", toBase: (v) => v, fromBase: (v) => v },
      { id: "f", label: "Fahrenheit", toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      { id: "k", label: "Kelvin", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  {
    name: "Volume",
    units: [
      { id: "ml", label: "Milliliters", ...linear(0.001) },
      { id: "l", label: "Liters", ...linear(1) },
      { id: "cup", label: "Cups (US)", ...linear(0.24) },
      { id: "gal", label: "Gallons (US)", ...linear(3.78541) },
    ],
  },
  {
    name: "Speed",
    units: [
      { id: "ms", label: "Meters/second", ...linear(1) },
      { id: "kmh", label: "Km/h", ...linear(0.277778) },
      { id: "mph", label: "Miles/hour", ...linear(0.44704) },
      { id: "knot", label: "Knots", ...linear(0.514444) },
    ],
  },
  {
    name: "Data",
    units: [
      { id: "bit", label: "Bits", ...linear(0.125) },
      { id: "byte", label: "Bytes", ...linear(1) },
      { id: "kb", label: "Kilobytes", ...linear(1000) },
      { id: "mb", label: "Megabytes", ...linear(1_000_000) },
      { id: "gb", label: "Gigabytes", ...linear(1_000_000_000) },
      { id: "kib", label: "Kibibytes", ...linear(1024) },
      { id: "mib", label: "Mebibytes", ...linear(1024 ** 2) },
      { id: "gib", label: "Gibibytes", ...linear(1024 ** 3) },
    ],
  },
];
