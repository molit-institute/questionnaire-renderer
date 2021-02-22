import { newSpecPage } from '@stencil/core/testing';
import { TimeQuestion } from '../time-question';

describe('time-question', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [TimeQuestion],
      html: `<time-question></time-question>`,
    });
    expect(page.root).toEqualHtml(`
      <time-question>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </time-question>
    `);
  });
});
