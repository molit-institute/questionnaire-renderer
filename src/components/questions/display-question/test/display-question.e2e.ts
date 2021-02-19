import { newE2EPage } from '@stencil/core/testing';

describe('display-question', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<display-question></display-question>');

    const element = await page.find('display-question');
    expect(element).toHaveClass('hydrated');
  });
});
