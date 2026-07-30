/**
 * Compounding maths for the interactive projection.
 *
 * Deliberately transparent and boring: a standard SIP future-value calculation
 * with monthly compounding and contributions made at the start of each month.
 * Nothing here implies a return — the UI labels every figure as illustrative.
 */

export type CompoundingInput = {
  /** Contribution made at the start of every month, in rupees. */
  monthly: number;
  /** Investment horizon in years. */
  years: number;
  /** Expected annualised return as a percentage (e.g. 12 for 12%). */
  annualReturn: number;
};

export type CompoundingResult = {
  totalInvested: number;
  finalValue: number;
  wealthCreated: number;
  /** Final value as a multiple of capital invested. */
  multiple: number;
};

export type SamplePoint = {
  /** Position along the horizon, 0 → 1. */
  t: number;
  /** Elapsed years at this sample (fractional). */
  year: number;
  invested: number;
  value: number;
};

/**
 * Future value of an annuity-due, compounded monthly:
 *
 *   FV = P × [((1 + r)^n − 1) / r] × (1 + r)
 *
 * `months` may be fractional — the chart samples between year boundaries. The
 * zero-return case is handled separately to avoid dividing by zero.
 */
function futureValue(monthly: number, months: number, monthlyRate: number) {
  if (months <= 0) return 0;
  if (monthlyRate === 0) return monthly * months;
  return monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
}

export function computeCompounding({ monthly, years, annualReturn }: CompoundingInput): CompoundingResult {
  const monthlyRate = annualReturn / 100 / 12;
  const totalInvested = monthly * 12 * years;
  const finalValue = futureValue(monthly, years * 12, monthlyRate);

  return {
    totalInvested,
    finalValue,
    wealthCreated: finalValue - totalInvested,
    multiple: totalInvested > 0 ? finalValue / totalInvested : 0,
  };
}

/**
 * Sample the growth curve at a *fixed* number of points regardless of horizon.
 *
 * This is what lets the chart morph smoothly when the year slider moves: two
 * SVG `d` strings can only be interpolated when they share a structure, so the
 * path must always carry the same number of segments.
 */
export function sampleSeries({ monthly, years, annualReturn }: CompoundingInput, samples = 48): SamplePoint[] {
  const monthlyRate = annualReturn / 100 / 12;
  const totalMonths = years * 12;

  return Array.from({ length: samples + 1 }, (_, index) => {
    const t = index / samples;
    const months = totalMonths * t;
    return {
      t,
      year: years * t,
      invested: monthly * months,
      value: futureValue(monthly, months, monthlyRate),
    };
  });
}

/**
 * Build an SVG path from fixed-length samples, in a `width` × `height` viewBox.
 * Straight segments are enough: at 48 samples the curve is already smoother
 * than any curve-fitting would make it, and it cannot overshoot below zero.
 */
export function samplesToPath(
  samples: SamplePoint[],
  key: 'value' | 'invested',
  width: number,
  height: number,
  maxValue: number,
) {
  if (maxValue <= 0) return '';

  return samples
    .map((point, index) => {
      const x = point.t * width;
      const y = height - (point[key] / maxValue) * height;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
}
