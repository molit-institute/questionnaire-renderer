import { newE2EPage } from '@stencil/core/testing';

describe('group-question', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<group-question></group-question>');

    const element = await page.find('group-question');
    expect(element).toHaveClass('hydrated');
  });
});
