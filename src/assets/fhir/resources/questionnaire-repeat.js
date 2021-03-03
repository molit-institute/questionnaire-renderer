const repeatedQuestionnaire = {
  resourceType: 'Questionnaire',
  id: '11',
  meta: {
    versionId: '1',
    lastUpdated: '2020-11-26T22:09:41.408+01:00',
  },
  identifier: [
    {
      system: 'eu.molit.questionic',
      value: 'demo-questionnaire',
    },
  ],
  title: 'Test repeated question types',
  status: 'active',
  subjectType: ['Patient'],
  date: '2019-04-26T00:00:00+02:00',
  publisher: 'MOLIT Institut',
  description: 'Dieser Fragebogen wurde zu Testzwecken erstellt und sollte nicht außerhalb der Testumgebung genutzt werden.',
  item: [
    {
      linkId: '2.1',
      text: 'String-Gruppe',
      type: 'group',
      item: [
        {
          linkId: '2.1.1',
          prefix: '2.1.1',
          text: 'String Frage 1',
          type: 'string',
        },
        {
          linkId: '2.1.2',
          prefix: '2.1.2',
          text: 'String Frage 2',
          type: 'string',
        },
      ],
    },
    {
      linkId: '2.2',
      text: 'Text-Gruppe',
      type: 'group',
      item: [
        {
          linkId: '2.2.1',
          prefix: '2.2.1',
          text: 'Text Frage 1',
          type: 'text',
        },
        {
          linkId: '2.2.2',
          prefix: '2.2.2',
          text: 'Text Frage 2',
          type: 'text',
        },
      ],
    },
    {
      linkId: '2.3',
      text: 'Integer-Gruppe',
      type: 'group',
      item: [
        {
          linkId: '2.3.1',
          prefix: '2.3.1',
          text: 'Integer Frage 1',
          type: 'integer',
        },
        {
          linkId: '2.3.2',
          prefix: '2.3.2',
          text: 'Integer Frage 2',
          type: 'integer',
        },
      ],
    },
    {
      linkId: '2.4',
      text: 'Decimal-Gruppe',
      type: 'group',
      item: [
        {
          linkId: '2.4.1',
          prefix: '2.4.1',
          text: 'Decimal Frage 1',
          type: 'decimal',
        },
        {
          linkId: '2.4.2',
          prefix: '2.4.2',
          text: 'Decimal Frage 2',
          type: 'decimal',
        },
      ],
    },
    {
      linkId: '2.5',
      text: 'Date-Gruppe',
      type: 'group',
      item: [
        {
          linkId: '2.5.1',
          prefix: '2.5.1',
          text: 'Date Frage 1',
          type: 'date',
        },
        {
          linkId: '2.5.2',
          prefix: '2.5.2',
          text: 'Date Frage 2',
          type: 'date',
        },
      ],
    },
    {
      linkId: '2.6',
      text: 'DateTime-Gruppe',
      type: 'group',
      item: [
        {
          linkId: '2.6.1',
          prefix: '2.6.1',
          text: 'DateTime Frage 1',
          type: 'dateTime',
        },
        {
          linkId: '2.6.2',
          prefix: '2.6.2',
          text: 'DateTime Frage 2',
          type: 'dateTime',
        },
      ],
    },
    {
      linkId: '2.7',
      text: 'Time-Gruppe',
      type: 'group',
      item: [
        {
          linkId: '2.7.1',
          prefix: '2.7.1',
          text: 'Time Frage 1',
          type: 'time',
        },
        {
          linkId: '2.7.2',
          prefix: '2.7.2',
          text: 'Time Frage 2',
          type: 'time',
        },
      ],
    },
    {
      linkId: '2.8',
      text: 'Url-Gruppe',
      type: 'group',
      item: [
        {
          linkId: '2.8.1',
          prefix: '2.8.1',
          text: 'Url Frage 1',
          type: 'url',
        },
        {
          linkId: '2.8.2',
          prefix: '2.8.2',
          text: 'Url Frage 2',
          type: 'url',
        },
      ],
    },
    {
      linkId: '2.9',
      text: 'Boolean-Gruppe',
      type: 'group',
      item: [
        {
          linkId: '2.9.1',
          prefix: '2.9.1',
          text: 'Boolean Frage 1',
          type: 'boolean',
        },
        {
          linkId: '2.9.2',
          prefix: '2.9.2',
          text: 'Boolean Frage 2',
          type: 'boolean',
        },
      ],
    },
    {
      linkId: '2.10',
      text: 'SingleChoice-Gruppe',
      type: 'group',
      item: [
        {
          linkId: '2.10.1',
          prefix: '2.10.1.',
          text: 'Single-Choice Frage 1',
          type: 'choice',
          answerValueSet: 'http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4',
        },
        {
          linkId: '2.10.2',
          prefix: '2.10.2',
          text: 'Single-Choice Frage 2',
          type: 'choice',
          answerValueSet: 'http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4',
        },
      ],
    },
    {
      linkId: '2.11',
      text: 'MultipleChoice-Gruppe',
      type: 'group',
      item: [
        {
          linkId: '2.11.1',
          prefix: '2.11.1',
          text: 'Multiple-Choice Frage 1',
          type: 'choice',
          repeats: true,
          answerValueSet: 'http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4',
        },
        {
          linkId: '2.11.2',
          prefix: '2.11.2',
          text: 'Multiple-Choice Frage 2',
          type: 'choice',
          repeats: true,
          answerValueSet: 'http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4',
        },
      ],
    },
  ],
};
export default repeatedQuestionnaire;
