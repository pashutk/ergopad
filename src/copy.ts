const isiOs = () => globalThis.navigator.userAgent.match(/ipad|iphone/i);

export const copy = (s: string): Promise<void> => {
  if (globalThis.navigator.clipboard) {
    return globalThis.navigator.clipboard.writeText(s);
  }

  const textarea = globalThis.document.createElement('textarea');
  textarea.value = s;
  textarea.readOnly = true;
  globalThis.document.body.appendChild(textarea);

  if (isiOs()) {
    const range = globalThis.document.createRange();
    range.selectNodeContents(textarea);
    const selection = globalThis.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    textarea.setSelectionRange(0, 999999);
  } else {
    textarea.select();
  }

  globalThis.document.execCommand('copy');
  globalThis.document.body.removeChild(textarea);
  return Promise.resolve();
};
