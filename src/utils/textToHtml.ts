import DOMPurify from 'dompurify';
/**
 * Creates safe HTML from a given text by using DOMPurify.
 *
 * @param {String} text - the string text
 * @param {boolean} [openLinksInNewTab=false] - whether to open generated links in new tab
 * @returns {String} - the generated HTML
 */
export function textToHtml(text, openLinksInNewTab = false) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let html = DOMPurify.sanitize(text, { ALLOWED_TAGS: ['u', '#text', 'br', 'b', 'i', 'li', 'ul', 'ol'] });

  if (openLinksInNewTab) {
    html = html.replace(/<a /g, '<a target="_blank" rel="nofollow" ');
  }

  return html;
}
