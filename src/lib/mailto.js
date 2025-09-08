export const CONTACT_EMAIL = (window?.__SITE_CONTACT_EMAIL__) || 'contact@monfideleconseiller.ch';

export function openMailto(to = CONTACT_EMAIL, subject = '', body = '') {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);

  const href = `mailto:${to}${params.toString() ? `?${params.toString()}` : ''}`;

  try {
    // 1) redirection directe
    window.location.href = href;

    // 2) fallback (Safari/iOS/quelques navigateurs)
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = href;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }, 50);
  } catch (e) {
    // 3) dernier recours : copie l'email + alerte
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(to);
      alert(`J'ai copié l'adresse dans le presse-papiers : ${to}`);
    } else {
      alert(`Écris-nous à : ${to}`);
    }
  }
}