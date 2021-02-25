import { newSpecPage } from '@stencil/core/testing';
import { SimpleSpinner } from '../simple-spinner';

describe('simple-spinner', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SimpleSpinner],
      html: `<simple-spinner></simple-spinner>`,
    });
    expect(page.root).toEqualHtml(`
      <simple-spinner>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </simple-spinner>
    `);
  });
});
