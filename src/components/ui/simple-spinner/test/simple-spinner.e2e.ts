import { newE2EPage } from '@stencil/core/testing';

describe('simple-spinner', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<simple-spinner></simple-spinner>');

    const element = await page.find('simple-spinner');
    expect(element).toHaveClass('hydrated');
  });
});
