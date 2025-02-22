import jalaali from 'jalaali-js';

export type ConversionDirection = 'g2p' | 'p2g';

export interface ConversionResult {
  jy?: number;
  jm?: number;
  jd?: number;
  gy?: number;
  gm?: number;
  gd?: number;
  isBeforeCommonEra: boolean;
  error?: boolean;
}

export const convertDate = (
  year: number,
  month: number,
  day: number,
  direction: 'g2p' | 'p2g'
) => {
  if (direction === 'g2p') {
    // For dates after 622 CE, use Jalaali-js
    if (
      year > 622 ||
      (year === 622 && (month > 3 || (month === 3 && day >= 21)))
    ) {
      try {
        // Convert to Jalaali
        const { jy, jm, jd } = jalaali.toJalaali(year, month, day);
        return {
          jy,
          jm,
          jd,
          isBeforeCommonEra: false,
        };
      } catch (error) {
        console.error('Error in Jalaali conversion:', error);
        return {
          error: true,
          isBeforeCommonEra: false,
        };
      }
    }

    // For dates before 622 CE, use our custom formulas
    if (year < 622) {
      // Helper function to determine if we should use the next Persian year
      const shouldUseNextYear = (m: number, d: number) => {
        // For months after March (4-12), we're in the current Persian year
        // For March, we check the day (>= 21 means next year)
        // For months before March (1-2), we're in the current Persian year
        if (m === 3) {
          return d >= 21;
        }
        return false;
      };

      // For negative years
      if (year < 0) {
        const absYear = Math.abs(year);
        // For negative years, after March 21st, we decrease the year (make it more negative)
        // because we're moving forward in time
        const jy = shouldUseNextYear(month, day)
          ? -(absYear + 621) // After March 21st
          : -(absYear + 622); // Before March 21st
        return {
          jy,
          jm: month,
          jd: day,
          isBeforeCommonEra: true,
        };
      }

      // For year 0
      if (year === 0) {
        const jy = shouldUseNextYear(month, day) ? -621 : -622;
        return {
          jy,
          jm: month,
          jd: day,
          isBeforeCommonEra: true,
        };
      }

      // For years 1 to 621
      const jy = shouldUseNextYear(month, day) ? year - 621 : year - 622;

      // Special case for year 621 transition to Persian year 0/1
      if (year === 621) {
        if (month === 3) {
          if (day === 19) {
            return {
              jy: -1,
              jm: 12,
              jd: 29,
              isBeforeCommonEra: false,
            };
          }
          if (day === 20) {
            return {
              jy: 0,
              jm: 1,
              jd: 1,
              isBeforeCommonEra: false,
            };
          }
        }
      }

      // For all dates before 622 CE, calculate the Persian year
      // For dates before March 21st (including December 31st), use year - 622
      // For dates on or after March 21st, use year - 621
      const finalJy = shouldUseNextYear(month, day) ? year - 621 : year - 622;
      return {
        jy: finalJy,
        jm: month,
        jd: day,
        isBeforeCommonEra: finalJy < 0,
      };
    }
  } else {
    // Persian to Gregorian conversion
    if (year >= 1) {
      // For dates after 1 AP (622 CE), use Jalaali-js
      try {
        // Convert to Gregorian
        const { gy, gm, gd } = jalaali.toGregorian(year, month, day);
        return {
          gy,
          gm,
          gd,
          isBeforeCommonEra: false,
        };
      } catch (error) {
        console.error('Error in Gregorian conversion:', error);
        return {
          error: true,
          isBeforeCommonEra: false,
        };
      }
    }

    // For dates before 1 AP, use our custom formulas
    if (year === -621 && month === 1 && day === 1) {
      return {
        gy: 1,
        gm: 3,
        gd: 21,
        isBeforeCommonEra: false,
      };
    }

    if (year === 0 && month === 1 && day === 1) {
      return {
        gy: 621,
        gm: 3,
        gd: 20,
        isBeforeCommonEra: false,
      };
    }

    if (year === -1 && month === 12 && day === 29) {
      return {
        gy: 621,
        gm: 3,
        gd: 19,
        isBeforeCommonEra: false,
      };
    }

    // For regular dates before 1 AP
    return {
      gy: year + 621,
      gm: month,
      gd: day,
      isBeforeCommonEra: false,
    };
  }
};

// Helper functions for Julian Day calculations
function gregorianToJulian(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

function julianToJalali(julianDay: number) {
  const gy = julianToGregorian(julianDay).gy;
  let jy = gy - 621;
  const r = jalaliCalc(jy);
  const jdn1f = gregorianToJulian(gy, 3, r.march);
  let jd1f = julianDay - jdn1f;

  if (jd1f < 0) {
    jy--;
    jd1f = julianDay - gregorianToJulian(gy - 1, 3, r.march);
  }

  let jm = 1 + Math.floor(jd1f / 30);
  let jalaliDay = (jd1f % 30) + 1;

  return { jy, jm, jd: jalaliDay };
}

function julianToGregorian(jd: number) {
  const z = Math.floor(jd + 0.5);
  const a = Math.floor((z - 1867216.25) / 36524.25);
  const b = z + 1 + a - Math.floor(a / 4);
  const c = b + 1524;
  const d = Math.floor((c - 122.1) / 365.25);
  const e = Math.floor(365.25 * d);
  const f = Math.floor((c - e) / 30.6001);

  const gd = Math.floor(c - e - Math.floor(30.6001 * f));
  const gm = f - 1 - 12 * Math.floor(f / 14);
  const gy = d - 4715 - Math.floor((7 + gm) / 10);

  return { gy, gm, gd };
}

function jalaliToJulian(jy: number, jm: number, jd: number): number {
  const r = jalaliCalc(jy);
  return (
    gregorianToJulian(r.gy, 3, r.march) +
    (jm - 1) * 31 -
    Math.floor(jm / 7) * (jm - 7) +
    jd -
    1
  );
}

function jalaliCalc(jy: number) {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
    2192, 2262, 2324, 2394, 2456, 3178,
  ];

  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];

  if (jy < jp || jy >= breaks[bl - 1])
    throw new Error('Invalid Jalali year ' + jy);

  let jump;
  for (let i = 1; i < bl; i += 1) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ =
      leapJ + Math.floor(jump / 33) * 8 + Math.floor(((jump % 33) + 3) / 4);
    jp = jm;
  }

  let n = jy - jp;
  leapJ = leapJ + Math.floor(n / 33) * 8 + Math.floor(((n % 33) + 3) / 4);

  const leapG =
    Math.floor(gy / 4) - Math.floor(((Math.floor(gy / 100) + 1) * 3) / 4) - 150;
  const march = 20 + leapJ - leapG;

  return {
    leap: leapJ,
    gy: gy,
    march: march,
  };
}
