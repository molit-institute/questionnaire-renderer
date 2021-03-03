import { newSpecPage } from '@stencil/core/testing';
import { QuestionnaireRenderer } from '../questionnaire-renderer';

describe('questionnaire-renderer', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [QuestionnaireRenderer],
      html: `<questionnaire-renderer></questionnaire-renderer>`,
    });
    expect(page.root).toEqualHtml(`
      <questionnaire-renderer>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </questionnaire-renderer>
    `);
  });
});
