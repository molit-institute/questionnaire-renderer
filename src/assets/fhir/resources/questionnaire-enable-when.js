const enableWhenQuestionnaire = {
  resourceType: 'Questionnaire',
  title: 'EnableWhen-Test',
  id: '3',
  item: [
    {
      linkId: '1',
      prefix: '1.',
      text: 'Bitte wählen Sie eine oder mehrere Untersuchungen aus',
      type: 'choice',
      repeats: true,
      answerOption: [
        {
          valueString: 'Behandlung 1',
        },
        {
          valueString: 'Behandlung 2',
        },
        {
          valueString: 'Behandlung 3',
        },
      ],
    },
    {
      linkId: '2',
      prefix: '2.',
      type: 'group',
      text: 'Ist das true wenn bei Frage 1 Behandlung 2 und Behandlung 3 ausgewählt wurde?',
      enableWhen: [
        {
          question: '1',
          operator: '=',
          answerString: 'Behandlung 1',
        },
        {
          question: '1',
          operator: '=',
          answerString: 'Behandlung 2',
        },
      ],
      enableBehavior: 'All',
      item: [
        {
          linkId: '5.2.19',
          prefix: '5.2.19.',
          text: 'Single-Choice Frage 1',
          type: 'choice',
          answerValueSet: 'http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4',
        },
        {
          linkId: '3',
          prefix: '3.',
          type: 'group',
          text: 'Ist das true wenn bei Frage 1 Behandlung 2 und Behandlung 3 ausgewählt wurde?',
          enableWhen: [
            {
              question: '2.1',
              operator: '=',
              answerDateTime: '22:22',
            },
          ],
          enableBehavior: 'Any',
          item: [
            {
              linkId: '3.1',
              prefix: '3.1',
              type: 'boolean',
              text: 'Boolean',
            },
          ],
        },
      ],
    },
  ],
};
export default enableWhenQuestionnaire;