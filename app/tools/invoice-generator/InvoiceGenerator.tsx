"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import { Download, Plus, X } from "lucide-react";

interface LineItem {
  description: string;
  qty: number;
  price: number;
}

export function InvoiceGenerator() {
  const [from, setFrom] = useState("Your Company\n123 Main St\nyou@example.com");
  const [to, setTo] = useState("Client Name\n456 Client Ave\nclient@example.com");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-0001");
  const [date, setDate] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [items, setItems] = useState<LineItem[]>([{ description: "Design work", qty: 1, price: 500 }]);

  function updateItem(index: number, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function addItem() {
    setItems((prev) => [...prev, { description: "", qty: 1, price: 0 }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  function generatePdf() {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(20);
    doc.text("Invoice", 14, y);
    doc.setFontSize(10);
    doc.text(invoiceNumber, 196, y, { align: "right" });
    y += 6;
    if (date) doc.text(date, 196, y, { align: "right" });

    y += 14;
    doc.setFontSize(10);
    from.split("\n").forEach((line) => {
      doc.text(line, 14, y);
      y += 5;
    });

    let toY = y - from.split("\n").length * 5;
    to.split("\n").forEach((line) => {
      doc.text(line, 130, toY);
      toY += 5;
    });

    y += 10;
    doc.setDrawColor(200);
    doc.line(14, y, 196, y);
    y += 8;

    doc.setFontSize(9);
    doc.text("Description", 14, y);
    doc.text("Qty", 130, y, { align: "right" });
    doc.text("Price", 160, y, { align: "right" });
    doc.text("Amount", 196, y, { align: "right" });
    y += 4;
    doc.line(14, y, 196, y);
    y += 6;

    items.forEach((item) => {
      doc.text(item.description || "-", 14, y);
      doc.text(String(item.qty), 130, y, { align: "right" });
      doc.text(item.price.toFixed(2), 160, y, { align: "right" });
      doc.text((item.qty * item.price).toFixed(2), 196, y, { align: "right" });
      y += 7;
    });

    y += 4;
    doc.line(120, y, 196, y);
    y += 8;
    doc.text("Subtotal", 160, y, { align: "right" });
    doc.text(subtotal.toFixed(2), 196, y, { align: "right" });
    y += 6;
    doc.text(`Tax (${taxRate}%)`, 160, y, { align: "right" });
    doc.text(tax.toFixed(2), 196, y, { align: "right" });
    y += 8;
    doc.setFontSize(12);
    doc.text("Total", 160, y, { align: "right" });
    doc.text(total.toFixed(2), 196, y, { align: "right" });

    doc.save(`${invoiceNumber || "invoice"}.pdf`);
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            From
          </label>
          <textarea
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="h-24 w-full resize-none rounded-lg border border-line bg-paper p-3 text-sm text-ink outline-none focus:border-amber"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            Bill to
          </label>
          <textarea
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="h-24 w-full resize-none rounded-lg border border-line bg-paper p-3 text-sm text-ink outline-none focus:border-amber"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            Invoice #
          </label>
          <input
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            Date
          </label>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="2026-01-01"
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
            Tax rate (%)
          </label>
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
          Line items
        </label>
        {items.map((item, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <input
              value={item.description}
              onChange={(e) => updateItem(i, { description: e.target.value })}
              placeholder="Description"
              className="min-w-40 flex-1 rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
            />
            <input
              type="number"
              value={item.qty}
              onChange={(e) => updateItem(i, { qty: Number(e.target.value) || 0 })}
              className="w-16 rounded-md border border-line bg-paper px-2 py-2 text-sm text-ink outline-none focus:border-amber"
            />
            <input
              type="number"
              value={item.price}
              onChange={(e) => updateItem(i, { price: Number(e.target.value) || 0 })}
              className="w-24 rounded-md border border-line bg-paper px-2 py-2 text-sm text-ink outline-none focus:border-amber"
            />
            <button onClick={() => removeItem(i)} className="text-ink-soft hover:text-amber">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          onClick={addItem}
          className="inline-flex w-fit items-center gap-1.5 rounded-md border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-amber hover:text-ink transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add item
        </button>
      </div>

      <div className="flex justify-end">
        <div className="w-56 space-y-1 font-mono text-sm">
          <div className="flex justify-between text-ink-soft">
            <span>Subtotal</span>
            <span>{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-ink-soft">
            <span>Tax ({taxRate}%)</span>
            <span>{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-ink">
            <span>Total</span>
            <span>{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={generatePdf}
        className="inline-flex w-fit items-center gap-2 rounded-md border border-amber bg-amber-soft px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink"
      >
        <Download className="h-4 w-4" /> Download PDF
      </button>
    </div>
  );
}
