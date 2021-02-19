import { newE2EPage } from '@stencil/core/testing';

describe('boolean-question', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<boolean-question></boolean-question>');

    const element = await page.find('boolean-question');
    expect(element).toHaveClass('hydrated');
  });
});
