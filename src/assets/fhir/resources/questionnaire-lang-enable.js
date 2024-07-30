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
  description: '<b>Huhu</b> <br> dies ist ein Test',
  date: '2017-08-23T00:00:00+02:00',
  subjectType: ['Patient'],
  item: [
    // { linkId: 'bla', text: 'test display', type: 'display' },
    // {
    //   linkId: '1',
    //   prefix: '1',
    //   text: 'Geben sie bitte ihre Lieblingszahl ein',
    //   // required: true,
    //   type: 'integer',
    // },
    // {
    //   linkId: '123',
    //   prefix: '123',
    //   text: 'Group text',
    //   type: 'group',
    //   item: [
    //     {
    //       linkId: '123.2',
    //       text: '<b>Dies</b> ist eine Display-Frage 1',
    //       type: 'display',
    //     },
    //     {
    //       linkId: '2.22',
    //       prefix: '2.22',
    //       text: '<u>Test</u> gruppenfrage',
    //       type: 'choice',
    //       answerValueSet: "http://molit.eu/fhir/lion/ValueSet/eq-5d-5l-answers1-vs"
    //     },
    //     {
    //       linkId: '11231.2',
    //       text: 'Dies ist eine Display-Frage 2',
    //       type: 'display',
    //     },
    //   ],
    // },
    // {
    //   linkId: '1.2',
    //   prefix: '1',
    //   text: 'Dies ist eine Display-Frage',
    //   type: 'display',
    // },
    // {
    //   linkId: '1.3',
    //   prefix: '1.3',
    //   text: 'dateTime',
    //   type: 'dateTime',
    //   required: true,
    // },
    // {
    //   linkId: '1.4',
    //   prefix: '1.4',
    //   text: 'time',
    //   type: 'time',
    //   required: true,
    // },
    // {
    //   linkId: '1.5',
    //   prefix: '1.5',
    //   text: 'Hier bitte einen String eingeben',
    //   type: 'string',
    //   required: true,
    // },
    {
      linkId: '1.6',
      prefix: '1.6',
      text: 'Hier bitte einen Text eingeben',
      type: 'text',
      required: true,
    },
    // {
    //   linkId: '1.7',
    //   prefix: '1.7',
    //   text: 'Geben sie die Zahl 2 ein',
    //   type: 'integer',
    //   required: true,
    // },{
    //   linkId: '1.23',
    //   prefix: '1.2',
    //   text: 'Funktioniert die Variante?',
    //   type: 'boolean',
    //   required: true,
    // },
    // {
    //   linkId: '1.21',
    //   prefix: '1.21',
    //   text: 'Ist der Himmel blau?',
    //   type: 'boolean',
    // },
    // {
    //   linkId: '1.22',
    //   prefix: '1.22',
    //   text: 'Ist html toll?',
    //   type: 'boolean',
    // },
    // {
    //   linkId: '5.2.19',
    //   prefix: '5.2.19.',
    //   text: 'Single-Choice Frage 1',
    //   type: 'choice',
    //   answerValueSet: 'http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4',
    //   required: true
    // },
    // {
    //   linkId: '5.2.20',
    //   prefix: '5.2.20.',
    //   text: 'Single-Choice Frage 1',
    //   type: 'choice',
    //   answerValueSet: 'http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4',
    // },
    // {
    //   linkId: '2',
    //   prefix: '1.1',
    //   text: 'Enable when gruppe',
    //   type: 'group',
    //   enableWhen: [
    //     {
    //       question: '1',
    //       operator: '=',
    //       answerBoolean: '22',
    //     },
    //   ],
    //   item: [
    //     {
    //       linkId: '2.1',
    //       prefix: '2.1',
    //       text: 'Name',
    //       type: 'string',
    //       required: true,
    //     },
    //     {
    //       linkId: '2.11',
    //       prefix: '2.1',
    //       text: 'Enable when display',
    //       type: 'display',
    //     },
    //   ],
    // },
    //     {
    //       linkId: '2.2',
    //       prefix: '2.2',
    //       text: 'Alter',
    //       type: 'integer',
    //       required: true,
    //     },
    //     {
    //       linkId: '2.3',
    //       prefix: '2.3',
    //       text: 'Haare',
    //       type: 'group',
    //       item: [
    //         {
    //           linkId: '2.3.1',
    //           prefix: '2.3.1',
    //           text: 'Haben sie Haare auf dem Kopf',
    //           type: 'boolean',
    //           required: true,
    //         },
    //         {
    //           linkId: '2.3.2',
    //           prefix: '2.3.2',
    //           text: 'Wieviele Haare?',
    //           type: 'integer',
    //           required: true,
    //           enableWhen: [
    //             {
    //               question: '2.3.1',
    //               operator: '=',
    //               answerBoolean: true,
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   linkId: '3',
    //   prefix: '2',
    //   text: 'Wir sind zu weit',
    //   type: 'decimal',
    // },
    // {
    //   linkId: '4',
    //   prefix: '2.1',
    //   text: 'Persönliche Angaben',
    //   type: 'decimal',
    // },
  ],
};
export default enableQuestionnaire;
