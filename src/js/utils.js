export const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'Bilinmiyor';
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const generateYears = (start = 1980, end = new Date().getFullYear()) => {
  const years = [];
  for (let y = end; y >= start; y--) {
    years.push(y);
  }
  return years;
};