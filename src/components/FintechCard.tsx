import React from "react";
import { formatCurrency, formatFutureValue } from "@/lib/calculations";

interface FintechCardProps {
  hourlyRate: number;
  expectedReturn: number;
  projectionYears: number;
  currencySymbol?: string;
  currencyCode?: string;
  onClick?: () => void;
}

export const FintechCard: React.FC<FintechCardProps> = ({
  hourlyRate,
  expectedReturn,
  projectionYears,
  currencySymbol = "₹",
  currencyCode = "INR",
  onClick,
}) => {
  // Future value of 1 hour's wage over projection period
  const futureHourVal = formatFutureValue(
    hourlyRate,
    projectionYears,
    expectedReturn,
    currencySymbol,
    currencyCode,
  );

  return (
    <div
      className="fintech-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      title="Click to customize your financial baseline settings"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="card-top">
        <div className="card-brand">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#121910"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span>RealCost</span>
        </div>
        <div className="card-chip" />
      </div>

      <div className="my-auto py-2">
        <div className="text-xs uppercase font-semibold tracking-wider text-[#3d5a27]">
          Time-To-Money Baseline
        </div>
        <div className="card-amount font-mono text-2xl md:text-3xl font-extrabold text-[#121910] mt-1">
          {formatCurrency(hourlyRate, currencySymbol, currencyCode)}
          <span className="text-sm font-sans font-normal opacity-80 text-[#253818]"> / hour</span>
        </div>
      </div>

      <div className="card-bottom">
        <div>
          <div className="card-stat">
            <div className="card-stat-label">Hourly Rate</div>
            <div className="card-stat-value font-mono">
              {formatCurrency(hourlyRate, currencySymbol, currencyCode)}
            </div>
          </div>
          <div className="card-stat mt-2">
            <div className="card-stat-label">{projectionYears}y 1hr value</div>
            <div className="card-stat-value font-mono text-[#0a3800]">{futureHourVal}</div>
          </div>
        </div>

        <div className="card-stats flex gap-4">
          <div className="card-stat">
            <div className="card-stat-label">Return Rate</div>
            <div className="card-stat-value font-mono">{expectedReturn}%</div>
          </div>
          <div className="card-stat">
            <div className="card-stat-label">Horizon</div>
            <div className="card-stat-value font-mono">{projectionYears}y</div>
          </div>
        </div>
      </div>
    </div>
  );
};
