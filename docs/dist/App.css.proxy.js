// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".app {\n  display: flex;\n  flex-direction: column;\n  height: 100vh;\n  background-color: #353535;\n  color: #ccc;\n}\n\n.topbar {\n  min-height: 3rem;\n  border-bottom: 1px solid #ccc;\n  padding: 1rem 2rem;\n  display: flex;\n  align-items: center;\n}\n\n.touchytouchy {\n  background-color: rgba(255, 255, 255, 0.3);\n  width: 100%;\n  flex-grow: 1;\n  display: flex;\n}\n\n.columnButtons {\n  display: flex;\n  gap: 1rem;\n}\n\n.button {\n  border: 1px solid;\n  padding: 1rem;\n}\n\n.columnButtonActive {\n  background-color: rgba(255, 255, 255, 0.3);\n}\n\n.columnButtonColor {\n  height: 0.5rem;\n  margin-top: 0.5rem;\n  border: 1px solid;\n}\n\n.boo {\n  display: flex;\n  width: 100%;\n}\n\n.columnButton {\n  border: 1px solid;\n  padding: 1rem;\n}\n\n.buttonGroup {\n  display: flex;\n  gap: 1rem;\n}\n\n.resetButton {\n  display: block;\n  background: transparent;\n  color: #ccc;\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}