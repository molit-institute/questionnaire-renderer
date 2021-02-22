import { newE2EPage } from '@stencil/core/testing';

describe('decimal-question', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<decimal-question></decimal-question>');

    const element = await page.find('decimal-question');
    expect(element).toHaveClass('hydrated');
  });
});
