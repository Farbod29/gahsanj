import { convertDate } from '../utils';
import jalaali from 'jalaali-js';

describe('Date Conversion Tests', () => {
  describe('Gregorian to Persian (g2p)', () => {
    describe('Pre-622 CE (Custom Formulas)', () => {
      test('converts dates before 621 CE', () => {
        // Test case 1: Year 1 CE
        expect(convertDate(1, 1, 1, 'g2p')).toEqual({
          jy: -621,
          jm: 1,
          jd: 1,
          isBeforeCommonEra: true,
        });

        // Test case 2: Year 500 CE
        expect(convertDate(500, 3, 20, 'g2p')).toEqual({
          jy: -122,
          jm: 3,
          jd: 20,
          isBeforeCommonEra: true,
        });

        // Test case for year 0
        expect(convertDate(0, 3, 20, 'g2p')).toEqual({
          jy: -622,
          jm: 3,
          jd: 20,
          isBeforeCommonEra: true,
        });

        // Test case for March 21st transition
        expect(convertDate(0, 3, 21, 'g2p')).toEqual({
          jy: -621,
          jm: 3,
          jd: 21,
          isBeforeCommonEra: true,
        });
      });

      test('converts historical dates before Persian calendar', () => {
        // March 18, 500 CE
        expect(convertDate(500, 3, 18, 'g2p')).toEqual({
          jy: -122,
          jm: 3,
          jd: 18,
          isBeforeCommonEra: true,
        });

        // March 22, 500 CE (after Nowruz)
        expect(convertDate(500, 3, 22, 'g2p')).toEqual({
          jy: -121,
          jm: 3,
          jd: 22,
          isBeforeCommonEra: true,
        });

        // December 31, 300 CE
        expect(convertDate(300, 12, 31, 'g2p')).toEqual({
          jy: -322,
          jm: 12,
          jd: 31,
          isBeforeCommonEra: true,
        });

        // March 19, 250 CE (before Nowruz)
        expect(convertDate(250, 3, 19, 'g2p')).toEqual({
          jy: -372,
          jm: 3,
          jd: 19,
          isBeforeCommonEra: true,
        });

        // March 22, 250 CE (after Nowruz)
        expect(convertDate(250, 3, 22, 'g2p')).toEqual({
          jy: -371,
          jm: 3,
          jd: 22,
          isBeforeCommonEra: true,
        });
      });

      test('converts negative years', () => {
        // Test case for -100 CE
        expect(convertDate(-100, 3, 20, 'g2p')).toEqual({
          jy: -722,
          jm: 3,
          jd: 20,
          isBeforeCommonEra: true,
        });

        // Test case for -500 CE March 21st
        expect(convertDate(-500, 3, 21, 'g2p')).toEqual({
          jy: -1121,
          jm: 3,
          jd: 21,
          isBeforeCommonEra: true,
        });

        // Test case for February 22, -2 CE
        expect(convertDate(-2, 2, 22, 'g2p')).toEqual({
          jy: -624,
          jm: 2,
          jd: 22,
          isBeforeCommonEra: true,
        });

        // Test case for March 22, -2 CE
        expect(convertDate(-2, 3, 22, 'g2p')).toEqual({
          jy: -623,
          jm: 3,
          jd: 22,
          isBeforeCommonEra: true,
        });
      });

      test('converts dates around 621-622 CE', () => {
        // Test case: March 19, 621 CE (last day of Persian year -1)
        expect(convertDate(621, 3, 19, 'g2p')).toEqual({
          jy: -1,
          jm: 12,
          jd: 29,
          isBeforeCommonEra: false,
        });

        // Test case: March 20, 621 CE (first day of Persian year 0)
        expect(convertDate(621, 3, 20, 'g2p')).toEqual({
          jy: 0,
          jm: 1,
          jd: 1,
          isBeforeCommonEra: false,
        });
      });
    });

    describe('Post-622 CE (Jalaali-js)', () => {
      test('converts dates starting from 622 CE', () => {
        // First day of Persian calendar (March 21, 622 CE)
        const { jy, jm, jd } = jalaali.toJalaali(622, 3, 21);
        const result = convertDate(622, 3, 21, 'g2p');
        expect(result).toEqual({
          jy,
          jm,
          jd,
          isBeforeCommonEra: false,
        });
      });

      test('converts modern dates', () => {
        // Test case: 23/02/2025 - 5/12/1403
        const { jy: jy1, jm: jm1, jd: jd1 } = jalaali.toJalaali(2025, 2, 23);
        expect(convertDate(2025, 2, 23, 'g2p')).toEqual({
          jy: jy1,
          jm: jm1,
          jd: jd1,
          isBeforeCommonEra: false,
        });

        // Additional test cases
        const { jy: jy2, jm: jm2, jd: jd2 } = jalaali.toJalaali(2025, 3, 21);
        expect(convertDate(2025, 3, 21, 'g2p')).toEqual({
          jy: jy2,
          jm: jm2,
          jd: jd2,
          isBeforeCommonEra: false,
        });

        const { jy: jy3, jm: jm3, jd: jd3 } = jalaali.toJalaali(2025, 3, 18);
        expect(convertDate(2025, 3, 18, 'g2p')).toEqual({
          jy: jy3,
          jm: jm3,
          jd: jd3,
          isBeforeCommonEra: false,
        });

        const { jy: jy4, jm: jm4, jd: jd4 } = jalaali.toJalaali(2025, 3, 19);
        expect(convertDate(2025, 3, 19, 'g2p')).toEqual({
          jy: jy4,
          jm: jm4,
          jd: jd4,
          isBeforeCommonEra: false,
        });

        const { jy: jy5, jm: jm5, jd: jd5 } = jalaali.toJalaali(2024, 12, 31);
        expect(convertDate(2024, 12, 31, 'g2p')).toEqual({
          jy: jy5,
          jm: jm5,
          jd: jd5,
          isBeforeCommonEra: false,
        });
      });

      test('should convert Nowruz (March 21, 2025) correctly', () => {
        const { jy, jm, jd } = jalaali.toJalaali(2025, 3, 21);
        const result = convertDate(2025, 3, 21, 'g2p');
        expect(result).toEqual({
          jy,
          jm,
          jd,
          isBeforeCommonEra: false,
        });
      });

      test('should convert end of Gregorian year (Dec 31, 2024)', () => {
        const { jy, jm, jd } = jalaali.toJalaali(2024, 12, 31);
        const result = convertDate(2024, 12, 31, 'g2p');
        expect(result).toEqual({
          jy,
          jm,
          jd,
          isBeforeCommonEra: false,
        });
      });

      test('should convert before Nowruz (March 19, 2025)', () => {
        const { jy, jm, jd } = jalaali.toJalaali(2025, 3, 19);
        const result = convertDate(2025, 3, 19, 'g2p');
        expect(result).toEqual({
          jy,
          jm,
          jd,
          isBeforeCommonEra: false,
        });
      });

      test('should handle leap year correctly (March 20, 2024)', () => {
        const { jy, jm, jd } = jalaali.toJalaali(2024, 3, 20);
        const result = convertDate(2024, 3, 20, 'g2p');
        expect(result).toEqual({
          jy,
          jm,
          jd,
          isBeforeCommonEra: false,
        });
      });

      test('should convert a random date (July 15, 2023)', () => {
        const { jy, jm, jd } = jalaali.toJalaali(2023, 7, 15);
        const result = convertDate(2023, 7, 15, 'g2p');
        expect(result).toEqual({
          jy,
          jm,
          jd,
          isBeforeCommonEra: false,
        });
      });

      // Direct Jalaali-js test cases for verification
      describe('Direct Jalaali-js Tests', () => {
        test('should convert Nowruz (March 21, 2025) correctly', () => {
          const { jy, jm, jd } = jalaali.toJalaali(2025, 3, 21);
          expect(jy).toBe(1404);
          expect(jm).toBe(1);
          expect(jd).toBe(1);
        });

        test('should convert end of Gregorian year (Dec 31, 2024)', () => {
          const { jy, jm, jd } = jalaali.toJalaali(2024, 12, 31);
          expect(jy).toBe(1403);
          expect(jm).toBe(10);
          expect(jd).toBe(11);
        });

        test('should convert before Nowruz (March 19, 2025)', () => {
          const { jy, jm, jd } = jalaali.toJalaali(2025, 3, 19);
          expect(jy).toBe(1403);
          expect(jm).toBe(12);
          expect(jd).toBe(29);
        });

        test('should handle leap year correctly (March 20, 2024)', () => {
          const { jy, jm, jd } = jalaali.toJalaali(2024, 3, 20);
          expect(jy).toBe(1403);
          expect(jm).toBe(1);
          expect(jd).toBe(1);
        });

        test('should convert a random date (July 15, 2023)', () => {
          const { jy, jm, jd } = jalaali.toJalaali(2023, 7, 15);
          expect(jy).toBe(1402);
          expect(jm).toBe(4);
          expect(jd).toBe(24);
        });
      });
    });
  });

  describe('Persian to Gregorian (p2g)', () => {
    describe('Pre-1 AP (Custom Formulas)', () => {
      test('converts dates before year 0', () => {
        // Persian year -621
        expect(convertDate(-621, 1, 1, 'p2g')).toEqual({
          gy: 1,
          gm: 3,
          gd: 21,
          isBeforeCommonEra: false,
        });

        // Persian year -1
        expect(convertDate(-1, 12, 29, 'p2g')).toEqual({
          gy: 621,
          gm: 3,
          gd: 19,
          isBeforeCommonEra: false,
        });
      });

      test('converts dates around year 0', () => {
        // First day of year 0
        expect(convertDate(0, 1, 1, 'p2g')).toEqual({
          gy: 621,
          gm: 3,
          gd: 20,
          isBeforeCommonEra: false,
        });
      });
    });

    describe('Post-1 AP (Jalaali-js)', () => {
      test('converts modern dates', () => {
        // Current Persian year
        const { gy: gy1, gm: gm1, gd: gd1 } = jalaali.toGregorian(1402, 12, 29);
        expect(convertDate(1402, 12, 29, 'p2g')).toEqual({
          gy: gy1,
          gm: gm1,
          gd: gd1,
          isBeforeCommonEra: false,
        });

        // Test conversion of 1403/11/5
        const { gy: gy2, gm: gm2, gd: gd2 } = jalaali.toGregorian(1403, 11, 5);
        expect(convertDate(1403, 11, 5, 'p2g')).toEqual({
          gy: gy2,
          gm: gm2,
          gd: gd2,
          isBeforeCommonEra: false,
        });
      });
    });
  });
});
