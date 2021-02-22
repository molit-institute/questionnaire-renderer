import { newE2EPage } from '@stencil/core/testing';

describe('vas-question', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<vas-question></vas-question>');

    const element = await page.find('vas-question');
    expect(element).toHaveClass('hydrated');
  });
});
