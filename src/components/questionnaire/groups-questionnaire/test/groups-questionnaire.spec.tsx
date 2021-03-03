import { newSpecPage } from '@stencil/core/testing';
import { GroupsQuestionnaire } from '../groups-questionnaire';

describe('groups-questionnaire', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [GroupsQuestionnaire],
      html: `<groups-questionnaire></groups-questionnaire>`,
    });
    expect(page.root).toEqualHtml(`
      <groups-questionnaire>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </groups-questionnaire>
    `);
  });
});
