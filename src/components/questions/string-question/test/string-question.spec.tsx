import { newSpecPage } from '@stencil/core/testing';
import { StringQuestion } from '../string-question';

describe('string-question', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [StringQuestion],
      html: `<string-question></string-question>`,
    });
    expect(page.root).toEqualHtml(`
      <string-question>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </string-question>
    `);
  });
});
