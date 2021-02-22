import { newE2EPage } from '@stencil/core/testing';

describe('date-question', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<date-question></date-question>');

    const element = await page.find('date-question');
    expect(element).toHaveClass('hydrated');
  });
});
