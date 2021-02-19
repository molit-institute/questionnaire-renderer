import { newSpecPage } from '@stencil/core/testing';
import { DisplayQuestion } from '../display-question';

describe('display-question', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DisplayQuestion],
      html: `<display-question></display-question>`,
    });
    expect(page.root).toEqualHtml(`
      <display-question>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </display-question>
    `);
  });
});
