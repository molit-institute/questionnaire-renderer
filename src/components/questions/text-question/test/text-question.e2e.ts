import { newE2EPage } from '@stencil/core/testing';

describe('text-question', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<text-question></text-question>');

    const element = await page.find('text-question');
    expect(element).toHaveClass('hydrated');
  });
});
