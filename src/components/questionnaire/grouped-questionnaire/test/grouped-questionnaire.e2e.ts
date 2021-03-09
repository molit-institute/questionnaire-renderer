import { newE2EPage } from '@stencil/core/testing';

describe('grouped-questionnaire', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<grouped-questionnaire></grouped-questionnaire>');

    const element = await page.find('grouped-questionnaire');
    expect(element).toHaveClass('hydrated');
  });
  
});