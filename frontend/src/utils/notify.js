import { toast as hotToast } from 'react-hot-toast';

const activeIds = new Set();

function _getId(opts, message) {
  if (!opts) return message;
  if (opts.id) return opts.id;
  return message;
}

function show(type, message, opts = {}) {
  const id = _getId(opts, message);
  if (activeIds.has(id)) return;
  activeIds.add(id);
  const duration = opts.duration || 5000;
  // Use react-hot-toast under the hood
  if (type === 'success') hotToast.success(message, { ...opts, id });
  else if (type === 'error') hotToast.error(message, { ...opts, id });
  else if (type === 'info') hotToast(message, { ...opts, id });
  else if (type === 'warn' || type === 'warning') hotToast(message, { ...opts, id });
  else hotToast(message, { ...opts, id });

  setTimeout(() => {
    activeIds.delete(id);
  }, duration + 200);
}

export default {
  success: (msg, opts) => show('success', msg, opts),
  error: (msg, opts) => show('error', msg, opts),
  info: (msg, opts) => show('info', msg, opts),
  warn: (msg, opts) => show('warn', msg, opts),
  raw: (msg, opts) => show('raw', msg, opts),
};
