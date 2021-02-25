import { newE2EPage } from '@stencil/core/testing';

describe('full-questionnaire', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<full-questionnaire></full-questionnaire>');

    const element = await page.find('full-questionnaire');
    expect(element).toHaveClass('hydrated');
  });
});
