"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import { Download, Plus, X } from "lucide-react";

interface Experience {
  role: string;
  company: string;
  dates: string;
  description: string;
}

const MARGIN = 14;
const PAGE_WIDTH = 210;

export function ResumeBuilder() {
  const [name, setName] = useState("Jordan Rivera");
  const [title, setTitle] = useState("Product Designer");
  const [contact, setContact] = useState("jordan@example.com · 555-0100 · San Francisco, CA");
  const [summary, setSummary] = useState(
    "Product designer with 6 years of experience shipping consumer apps end to end."
  );
  const [skills, setSkills] = useState("Figma, User Research, Prototyping, Design Systems");
  const [experience, setExperience] = useState<Experience[]>([
    { role: "Senior Designer", company: "Acme Corp", dates: "2022 – Present", description: "Led design for the core mobile app." },
  ]);

  function updateExp(index: number, patch: Partial<Experience>) {
    setExperience((prev) => prev.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  }

  function addExp() {
    setExperience((prev) => [...prev, { role: "", company: "", dates: "", description: "" }]);
  }

  function removeExp(index: number) {
    setExperience((prev) => prev.filter((_, i) => i !== index));
  }

  function generatePdf() {
    const doc = new jsPDF();
    let y = 20;
    const contentWidth = PAGE_WIDTH - MARGIN * 2;

    doc.setFontSize(22);
    doc.text(name, MARGIN, y);
    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(90);
    doc.text(title, MARGIN, y);
    y += 6;
    doc.setFontSize(9);
    doc.text(contact, MARGIN, y);
    doc.setTextColor(0);
    y += 10;

    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 8;

    if (summary) {
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(summary, contentWidth);
      doc.text(lines, MARGIN, y);
      y += lines.length * 5 + 6;
    }

    doc.setFontSize(13);
    doc.text("Experience", MARGIN, y);
    y += 7;

    experience.forEach((exp) => {
      doc.setFontSize(11);
      doc.text(exp.role || "Role", MARGIN, y);
      doc.setFontSize(9);
      doc.text(exp.dates, PAGE_WIDTH - MARGIN, y, { align: "right" });
      y += 5;
      doc.setFontSize(10);
      doc.setTextColor(90);
      doc.text(exp.company, MARGIN, y);
      doc.setTextColor(0);
      y += 6;
      if (exp.description) {
        const lines = doc.splitTextToSize(exp.description, contentWidth);
        doc.setFontSize(9.5);
        doc.text(lines, MARGIN, y);
        y += lines.length * 5;
      }
      y += 6;
    });

    if (skills) {
      doc.setFontSize(13);
      doc.text("Skills", MARGIN, y);
      y += 7;
      doc.setFontSize(9.5);
      const lines = doc.splitTextToSize(skills, contentWidth);
      doc.text(lines, MARGIN, y);
    }

    doc.save(`${name.replace(/\s+/g, "-").toLowerCase() || "resume"}.pdf`);
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
        />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Job title"
          className="rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
        />
      </div>
      <input
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="Email · Phone · Location"
        className="rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
      />
      <textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Short summary"
        className="h-20 resize-none rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
      />

      <div className="grid gap-3">
        <label className="font-mono text-xs uppercase tracking-wide text-ink-soft">
          Experience
        </label>
        {experience.map((exp, i) => (
          <div key={i} className="grid gap-2 rounded-lg border border-line bg-paper p-3">
            <div className="flex items-center gap-2">
              <input
                value={exp.role}
                onChange={(e) => updateExp(i, { role: e.target.value })}
                placeholder="Role"
                className="flex-1 rounded-md border border-line bg-paper-card px-3 py-2 text-sm text-ink outline-none focus:border-amber"
              />
              <button onClick={() => removeExp(i)} className="text-ink-soft hover:text-amber">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                value={exp.company}
                onChange={(e) => updateExp(i, { company: e.target.value })}
                placeholder="Company"
                className="rounded-md border border-line bg-paper-card px-3 py-2 text-sm text-ink outline-none focus:border-amber"
              />
              <input
                value={exp.dates}
                onChange={(e) => updateExp(i, { dates: e.target.value })}
                placeholder="2022 – Present"
                className="rounded-md border border-line bg-paper-card px-3 py-2 text-sm text-ink outline-none focus:border-amber"
              />
            </div>
            <textarea
              value={exp.description}
              onChange={(e) => updateExp(i, { description: e.target.value })}
              placeholder="What did you do?"
              className="h-16 resize-none rounded-md border border-line bg-paper-card px-3 py-2 text-sm text-ink outline-none focus:border-amber"
            />
          </div>
        ))}
        <button
          onClick={addExp}
          className="inline-flex w-fit items-center gap-1.5 rounded-md border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft hover:border-amber hover:text-ink transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add role
        </button>
      </div>

      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
          Skills (comma-separated)
        </label>
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber"
        />
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
