import DOMPurify from "dompurify";
import { marked } from "marked";
/**
 * Creates safe HTML from markdown by using DOMPurify and marked.js.
 *
 * @param {String} markdown - the markdown text
 * @param {boolean} [openLinksInNewTab=false] - whether to open generated links in new tab
 * @returns {String} - the generated HTML
 */
export function markdownToHtml(markdown,useMarkdown, openLinksInNewTab = false) {
  if (!markdown || typeof markdown !== "string") {
    return "";
  }
  let html = null
  if(useMarkdown){
    html = DOMPurify.sanitize(marked(markdown, { sanitize: true }),{ALLOWED_TAGS: ['u', '#text', 'br']});
  }else{
    html = DOMPurify.sanitize(markdown,{ALLOWED_TAGS: ['u', '#text', 'br']});
  }
  

  if (openLinksInNewTab) {
    html = html.replace(/<a /g, '<a target="_blank" rel="nofollow" ');
  }

  return html;
};