import { newE2EPage } from '@stencil/core/testing';

describe('choice-question', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<choice-question></choice-question>');

    const element = await page.find('choice-question');
    expect(element).toHaveClass('hydrated');
  });
});
