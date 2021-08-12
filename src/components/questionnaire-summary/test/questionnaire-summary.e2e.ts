import { newE2EPage } from '@stencil/core/testing';

describe('questionnaire-summary', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<questionnaire-summary></questionnaire-summary>');

    const element = await page.find('questionnaire-summary');
    expect(element).toHaveClass('hydrated');
  });
});
