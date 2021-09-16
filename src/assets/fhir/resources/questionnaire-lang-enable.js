const enableQuestionnaire = {
  resourceType: 'Questionnaire',
  id: '977',
  meta: {
    versionId: '1',
    lastUpdated: '2017-08-23T12:15:33.776+02:00',
  },
  identifier: [
    {
      system: 'eu.molit.questionic',
      value: 'epidemiologischerFragebogenSLK',
    },
  ],
  title: 'Fragebogen Lang',
  publisher: 'SLK-Kliniken Heilbronn',
  status: 'active',
  description: ' ',
  date: '2017-08-23T00:00:00+02:00',
  subjectType: ['Patient'],
  item: [
    {
      linkId: '1',
      prefix: '1',
      text: 'Geben sie bitte ihre Lieblingszahl ein',
      type: 'integer',
    },
    {
      linkId: '1.3',
      prefix: '1.3',
      text: 'dateTime',
      type: 'dateTime',
    },
    {
      linkId: '1.4',
      prefix: '1.4',
      text: 'time',
      type: 'time',
    },
    {
      linkId: '1.5',
      prefix: '1.5',
      text: 'string',
      type: 'string',
    },
    {
      linkId: '1.6',
      prefix: '1.6',
      text: 'text',
      type: 'text',
    },
    {
      linkId: '1.7',
      prefix: '1.7',
      text: 'Geben sie die Zahl 2 ein',
      type: 'integer',
    },{
      linkId: '1.2',
      prefix: '1.2',
      text: 'Funktioniert die Variante?',
      type: 'boolean',
    },
    {
      linkId: '2',
      prefix: '1.1',
      text: 'Persönliche Angaben',
      type: 'group',
      enableWhen: [
        {
          question: '1',
          operator: '=',
          answerBoolean: '22',
        },
      ],
      item: [
        {
          linkId: '2.1',
          prefix: '2.1',
          text: 'Name',
          type: 'string',
          required: true,
        },
        {
          linkId: '2.2',
          prefix: '2.2',
          text: 'Alter',
          type: 'integer',
          required: true,
        },
        {
          linkId: '2.3',
          prefix: '2.3',
          text: 'Haare',
          type: 'group',
          item: [
            {
              linkId: '2.3.1',
              prefix: '2.3.1',
              text: 'Haben sie Haare auf dem Kopf',
              type: 'boolean',
              required: true,
            },
            {
              linkId: '2.3.2',
              prefix: '2.3.2',
              text: 'Wieviele Haare?',
              type: 'integer',
              required: true,
              enableWhen: [
                {
                  question: '2.3.1',
                  operator: '=',
                  answerBoolean: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      linkId: '3',
      prefix: '2',
      text: 'Wir sind zu weit',
      type: 'decimal',
    },
    {
      linkId: '4',
      prefix: '2.1',
      text: 'Persönliche Angaben',
      type: 'decimal',
    },
  ],
};
export default enableQuestionnaire;