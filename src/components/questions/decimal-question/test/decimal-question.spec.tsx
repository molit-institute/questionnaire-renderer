import { newSpecPage } from '@stencil/core/testing';
import { DecimalQuestion } from '../decimal-question';

describe('decimal-question', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DecimalQuestion],
      html: `<decimal-question></decimal-question>`,
    });
    expect(page.root).toEqualHtml(`
      <decimal-question>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </decimal-question>
    `);
  });
});
