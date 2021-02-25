import { newE2EPage } from '@stencil/core/testing';

describe('url-question', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<url-question></url-question>');

    const element = await page.find('url-question');
    expect(element).toHaveClass('hydrated');
  });
});
