import { newSpecPage } from '@stencil/core/testing';
import { TextQuestion } from '../text-question';

describe('text-question', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [TextQuestion],
      html: `<text-question></text-question>`,
    });
    expect(page.root).toEqualHtml(`
      <text-question>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </text-question>
    `);
  });
});
