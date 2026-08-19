import { describe, it, expect } from "vitest";
import {
  calculateHoursTraded,
  calculateShiftPercentage,
  calculateFutureValue,
  calculateSubscriptionLifetimeLoss,
} from "../financeMath";

describe("Financial Mathematics Engine (financeMath)", () => {
  describe("calculateHoursTraded", () => {
    it("should calculate exact hours traded for ₹3,000 expense at ₹500/hr", () => {
      const result = calculateHoursTraded(3000, 500);
      expect(result).toBe(6.0);
    });

    it("should handle floating point hourly rates correctly", () => {
      const result = calculateHoursTraded(1500, 450);
      expect(result).toBe(3.3);
    });

    it("should return 0 for zero or invalid inputs without throwing errors", () => {
      expect(calculateHoursTraded(0, 500)).toBe(0);
      expect(calculateHoursTraded(3000, 0)).toBe(0);
      expect(calculateHoursTraded(-500, 500)).toBe(0);
    });
  });

  describe("calculateShiftPercentage", () => {
    it("should calculate 75% shift percentage for 6 hours in an 8-hour workday", () => {
      const result = calculateShiftPercentage(6, 8);
      expect(result).toBe(75);
    });

    it("should cap max percentage at 100%", () => {
      const result = calculateShiftPercentage(12, 8);
      expect(result).toBe(100);
    });

    it("should return 0 for zero or negative hours", () => {
      expect(calculateShiftPercentage(0, 8)).toBe(0);
      expect(calculateShiftPercentage(-2, 8)).toBe(0);
    });
  });

  describe("calculateFutureValue", () => {
    it("should project ₹3,000 to ₹20,182 over 20 years at 10% annual return", () => {
      const result = calculateFutureValue(3000, 0.1, 20);
      expect(result).toBe(20182);
    });

    it("should return 0 for non-positive expenses", () => {
      expect(calculateFutureValue(0, 0.1, 20)).toBe(0);
      expect(calculateFutureValue(-1000, 0.1, 20)).toBe(0);
    });
  });

  describe("calculateSubscriptionLifetimeLoss", () => {
    it("should calculate compound lifetime loss for ₹499/mo subscription over 20 years", () => {
      const result = calculateSubscriptionLifetimeLoss(499, 20, 0.08);
      expect(result).toBeGreaterThan(250000);
    });

    it("should return 0 for zero monthly cost", () => {
      expect(calculateSubscriptionLifetimeLoss(0)).toBe(0);
    });
  });
});
