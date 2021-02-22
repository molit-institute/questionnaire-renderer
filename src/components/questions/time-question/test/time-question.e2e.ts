import { newE2EPage } from '@stencil/core/testing';

describe('time-question', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<time-question></time-question>');

    const element = await page.find('time-question');
    expect(element).toHaveClass('hydrated');
  });
});
