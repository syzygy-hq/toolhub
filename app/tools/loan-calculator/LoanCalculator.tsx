"use client";

import { useMemo, useState } from "react";

export function LoanCalculator() {
  const [principal, setPrincipal] = useState(300000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);

  const { emi, totalPayment, totalInterest, schedule } = useMemo(() => {
    const months = years * 12;
    const monthlyRate = rate / 100 / 12;
    const emi =
      monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);

    let balance = principal;
    const schedule: { month: number; principal: number; interest: number; balance: number }[] = [];
    for (let m = 1; m <= Math.min(12, months); m++) {
      const interest = balance * monthlyRate;
      const principalPaid = emi - interest;
      balance -= principalPaid;
      schedule.push({ month: m, principal: principalPaid, interest, balance: Math.max(balance, 0) });
    }

    return {
      emi,
      totalPayment: emi * months,
      totalInterest: emi * months - principal,
      schedule,
    };
  }, [principal, rate, years]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Loan amount">
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
          />
        </Field>
        <Field label="Annual interest rate %">
          <input
            type="number"
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value) || 0)}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
          />
        </Field>
        <Field label="Term (years)">
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Math.max(1, Number(e.target.value) || 1))}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Monthly payment" value={emi.toFixed(2)} highlight />
        <Stat label="Total interest" value={totalInterest.toFixed(2)} />
        <Stat label="Total payment" value={totalPayment.toFixed(2)} />
      </div>

      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
          First 12 months
        </p>
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line bg-paper font-mono uppercase tracking-wide text-ink-soft">
                <th className="px-3 py-2">Month</th>
                <th className="px-3 py-2 text-right">Principal</th>
                <th className="px-3 py-2 text-right">Interest</th>
                <th className="px-3 py-2 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => (
                <tr key={row.month} className="border-b border-line text-ink last:border-0">
                  <td className="px-3 py-2">{row.month}</td>
                  <td className="px-3 py-2 text-right">{row.principal.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right">{row.interest.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right">{row.balance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
        {label}
      </label>
      {children}
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${highlight ? "border-amber bg-amber-soft" : "border-line bg-paper"}`}>
      <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-1 font-display text-xl font-bold text-ink">{value}</p>
    </div>
  );
}
