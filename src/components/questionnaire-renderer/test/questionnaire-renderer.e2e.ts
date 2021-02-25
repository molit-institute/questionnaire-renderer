import { newE2EPage } from '@stencil/core/testing';

describe('questionnaire-renderer', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<questionnaire-renderer></questionnaire-renderer>');

    const element = await page.find('questionnaire-renderer');
    expect(element).toHaveClass('hydrated');
  });
});
