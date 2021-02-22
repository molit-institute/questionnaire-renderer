import { newSpecPage } from '@stencil/core/testing';
import { VasQuestion } from '../vas-question';

describe('vas-question', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VasQuestion],
      html: `<vas-question></vas-question>`,
    });
    expect(page.root).toEqualHtml(`
      <vas-question>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </vas-question>
    `);
  });
});
