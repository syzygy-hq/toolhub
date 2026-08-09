"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

export function MetaTagGenerator() {
  const [title, setTitle] = useState("Toolbox — small, useful tools");
  const [description, setDescription] = useState(
    "A free, open-source workshop of small utilities. No accounts, no tracking, no paywalls."
  );
  const [url, setUrl] = useState("https://example.com");
  const [image, setImage] = useState("https://example.com/og-image.png");
  const [siteName, setSiteName] = useState("Toolbox");
  const [twitterHandle, setTwitterHandle] = useState("@toolbox");

  const markup = useMemo(() => {
    return `<title>${title}</title>
<meta name="description" content="${description}" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${image}" />
<meta property="og:site_name" content="${siteName}" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${image}" />
<meta name="twitter:site" content="${twitterHandle}" />`;
  }, [title, description, url, image, siteName, twitterHandle]);

  let host = "example.com";
  try {
    host = new URL(url).hostname;
  } catch {
    // keep fallback
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Title">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </Field>
        <Field label="URL">
          <input value={url} onChange={(e) => setUrl(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Description" full>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} h-20 resize-none`}
          />
        </Field>
        <Field label="Image URL">
          <input value={image} onChange={(e) => setImage(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Site name">
          <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Twitter handle">
          <input value={twitterHandle} onChange={(e) => setTwitterHandle(e.target.value)} className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
            Google search preview
          </p>
          <div className="rounded-lg border border-line bg-white p-4">
            <p className="text-xs text-green-700">{host}</p>
            <p className="text-lg text-blue-700">{title}</p>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>

        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
            Social card preview
          </p>
          <div className="max-w-md overflow-hidden rounded-lg border border-line bg-paper-card">
            <div className="flex h-40 items-center justify-center bg-paper text-xs text-ink-soft">
              {image ? "Image preview (loads from your image URL)" : "No image set"}
            </div>
            <div className="p-3">
              <p className="truncate font-mono text-[10px] uppercase tracking-wide text-ink-soft">{host}</p>
              <p className="truncate text-sm font-semibold text-ink">{title}</p>
              <p className="truncate text-xs text-ink-soft">{description}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex justify-end">
          <CopyButton value={markup} label="Copy tags" />
        </div>
        <pre className="h-64 w-full overflow-auto whitespace-pre-wrap rounded-lg border border-line bg-paper p-3 font-mono text-xs text-ink">
          {markup}
        </pre>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-amber";

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft">
        {label}
      </label>
      {children}
    </div>
  );
}
