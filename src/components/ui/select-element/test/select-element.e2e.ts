import { newE2EPage } from '@stencil/core/testing';

describe('select-element', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<select-element></select-element>');

    const element = await page.find('select-element');
    expect(element).toHaveClass('hydrated');
  });
});
