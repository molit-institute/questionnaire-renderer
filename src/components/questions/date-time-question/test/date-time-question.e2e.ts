import { newE2EPage } from '@stencil/core/testing';

describe('date-time-question', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<date-time-question></date-time-question>');

    const element = await page.find('date-time-question');
    expect(element).toHaveClass('hydrated');
  });
});
