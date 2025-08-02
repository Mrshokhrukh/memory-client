import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  parseISO,
} from 'date-fns';

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, formatStr);
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(parsedDate)) {
    return `Today at ${format(parsedDate, 'h:mm a')}`;
  }

  if (isYesterday(parsedDate)) {
    return `Yesterday at ${format(parsedDate, 'h:mm a')}`;
  }

  return formatDistanceToNow(parsedDate, { addSuffix: true });
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const generateInviteLink = (capsuleId, inviteCode) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/join/${capsuleId}?code=${inviteCode}`;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;

    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const getFileIcon = (fileType) => {
  const icons = {
    image: '🖼️',
    video: '🎥',
    audio: '🎵',
    text: '📝',
    voice: '🎤',
  };
  return icons[fileType] || '📄';
};

export const getThemeColors = (theme) => {
  const themes = {
    default: {
      primary: '#6366f1',
      secondary: '#f59e0b',
      accent: '#10b981',
      background: '#ffffff',
      surface: '#f9fafb',
    },
    vintage: {
      primary: '#92400e',
      secondary: '#d97706',
      accent: '#059669',
      background: '#fef7ed',
      surface: '#fed7aa',
    },
    modern: {
      primary: '#1f2937',
      secondary: '#6b7280',
      accent: '#3b82f6',
      background: '#ffffff',
      surface: '#f3f4f6',
    },
    nature: {
      primary: '#059669',
      secondary: '#10b981',
      accent: '#34d399',
      background: '#f0fdf4',
      surface: '#dcfce7',
    },
    space: {
      primary: '#4c1d95',
      secondary: '#7c3aed',
      accent: '#a78bfa',
      background: '#faf5ff',
      surface: '#e9d5ff',
    },
    ocean: {
      primary: '#0c4a6e',
      secondary: '#0284c7',
      accent: '#38bdf8',
      background: '#f0f9ff',
      surface: '#bae6fd',
    },
  };
  return themes[theme] || themes.default;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  );
};

export const isImageFile = (file) => {
  return file.type.startsWith('image/');
};

export const isVideoFile = (file) => {
  return file.type.startsWith('video/');
};

export const isAudioFile = (file) => {
  return file.type.startsWith('audio/');
};
