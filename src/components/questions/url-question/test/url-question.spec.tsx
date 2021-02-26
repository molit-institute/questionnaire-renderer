import { newSpecPage } from '@stencil/core/testing';
import { UrlQuestion } from '../url-question';

describe('url-question', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [UrlQuestion],
      html: `<url-question></url-question>`,
    });
    expect(page.root).toEqualHtml(`
      <url-question>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </url-question>
    `);
  });
});
