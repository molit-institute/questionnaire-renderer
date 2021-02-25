import { newE2EPage } from '@stencil/core/testing';

describe('stepper-questionnaire', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<stepper-questionnaire></stepper-questionnaire>');

    const element = await page.find('stepper-questionnaire');
    expect(element).toHaveClass('hydrated');
  });
});
