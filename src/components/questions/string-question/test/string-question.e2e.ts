import { newE2EPage } from '@stencil/core/testing';

describe('string-question', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<string-question></string-question>');

    const element = await page.find('string-question');
    expect(element).toHaveClass('hydrated');
  });
});
