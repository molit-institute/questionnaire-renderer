import { newE2EPage } from '@stencil/core/testing';

describe('integer-question', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<integer-question></integer-question>');

    const element = await page.find('integer-question');
    expect(element).toHaveClass('hydrated');
  });
});
