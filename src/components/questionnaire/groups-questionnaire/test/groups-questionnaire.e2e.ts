import { newE2EPage } from '@stencil/core/testing';

describe('groups-questionnaire', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<groups-questionnaire></groups-questionnaire>');

    const element = await page.find('groups-questionnaire');
    expect(element).toHaveClass('hydrated');
  });
});
