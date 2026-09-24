const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const esc = value => String(value).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const shell = (title, body, script = '') => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:flex;flex-direction:column;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#F8FAFC;color:#0F172A}
header{display:flex;align-items:center;gap:14px;padding:16px 20px;background:#fff;border-bottom:1px solid #E2E8F0;flex-wrap:wrap}
.badge{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;font-size:20px;font-weight:800;background:#ECFDF5;color:#047857;flex:none}
h1{font-size:16px;margin:0;font-weight:700;line-height:1.3}p{margin:3px 0 0;font-size:12px;color:#64748B}
.actions{margin-left:auto;display:flex;gap:8px;flex-wrap:wrap}
.btn{height:42px;padding:0 18px;border-radius:999px;border:1px solid #E2E8F0;background:#fff;color:#0F172A;font:inherit;font-weight:600;font-size:13px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:6px;transition:all .15s}
.btn.primary{background:#2563EB;border-color:#2563EB;color:#fff}.btn:hover{filter:brightness(.94);transform:translateY(-1px)}
.btn.success{background:#059669;border-color:#059669;color:#fff}
iframe{flex:1;border:0;width:100%;background:#E2E8F0}
.center{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:32px;gap:16px}
.center h2{margin:0;font-size:22px}.center p{font-size:14px;max-width:360px;color:#475569}.center .btn{height:54px;padding:0 28px;font-size:15px;border-radius:14px}
.spinner{width:34px;height:34px;border-radius:50%;border:3px solid #DBEAFE;border-top-color:#2563EB;animation:spin .8s linear infinite}
.status-msg{font-size:13px;color:#64748B;margin-top:4px}
@keyframes spin{to{transform:rotate(360deg)}}
@media print{header,.center{display:none}}
</style></head><body>${body}${script ? `<script>${script}</script>` : ''}</body></html>`;

export function openPrintWindow(label = 'your document') {
  const win = window.open('', '_blank');
  if (!win) return null;
  win.document.open();
  win.document.write(shell(`Preparing ${label}…`, `<div class="center"><div class="spinner"></div><h2>Preparing ${esc(label)}…</h2><p>Hold on a second while we fetch the PDF.</p></div>`));
  win.document.close();
  return win;
}

export function fillPrintWindow(win, url, filename, title) {
  const mobile = isMobile();
  const header = (state, hint) => `<header><div class="badge">✓</div><div><h1 data-testid="print-ready-title">${state} — ${esc(title)}</h1><p>${hint}</p></div><div class="actions"><button class="btn primary" onclick="doPrint()">🖨 Print</button><a class="btn" href="${url}" download="${esc(filename)}">Download</a><button class="btn" onclick="window.close()">Close</button></div></header>`;
  const body = mobile
    ? `${header('PDF Ready', 'Open the PDF, then use your phone\'s share or print option.')}<div class="center"><h2>📄 ${esc(title)}</h2><p>Your document is ready. Tap the button below to open the PDF. From the viewer you can print, save, or share it.</p><a class="btn success" href="${url}" target="_blank" rel="noopener">Open PDF</a><a class="btn" href="${url}" download="${esc(filename)}">Download PDF</a><p class="status-msg">Tip: Use your phone's Share → Print to send to a printer.</p></div>`
    : `${header('Print Ready ✓', 'Click the Print button above, or use Ctrl+P to print this document.')}<iframe id="pdf" src="${url}" title="${esc(title)}"></iframe>`;
  // IMPORTANT: On desktop, do NOT auto-trigger print — it can leak the print dialog to the
  // parent/opener window in some browsers. The user clicks the Print button in the new tab instead.
  // On mobile, just let them open/download the PDF.
  const script = mobile
    ? `function doPrint(){window.open(${JSON.stringify(url)},'_blank')}`
    : [
      'function doPrint(){',
      '  var f=document.getElementById("pdf");',
      '  if(!f)return;',
      '  try{f.contentWindow.focus();f.contentWindow.print();}',
      '  catch(e){window.print();}',
      '}',
    ].join('\n');
  win.document.open();
  win.document.write(shell(`${mobile ? 'PDF Ready' : 'Print Ready'} · ${title}`, body, script));
  win.document.close();
  win.focus();
}
