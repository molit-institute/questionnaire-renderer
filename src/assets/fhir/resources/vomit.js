const vomitQuestionnaire = {
  resourceType: 'Questionnaire',
  id: 'test',
  url: 'http://fhir.molit.eu/fhir/Questionnaire/test',
  title: 'demo questionnaire',
  status: 'active',
  description: 'This a short demo questionnaire showcasing different types of questions and functions',
  publisher: 'MOLIT Institut gGmbH',
  item: [
    // {
    //   linkId: "3",
    //   prefix: "1.",
    //   text: "Date Frage 1 ohne Extension",
    //   type: "date"
    // },
    // {
    //   linkId: "1",
    //   prefix: "2.",
    //   text: "Frage mit maxValue Extension",
    //   type: "date",
    //   extension : [{
    //     url : "http://molit-service.de/fhir/isMaxValueCurrentDate",
    //     valueBoolean : true
    //   }],
    // },
    {
      linkId: "2.5",
      prefix: "1.",
      text: "Date Frage 1 ohne Extension",
      type: "group",
      item:[]
    },
    {
      extension: [
        {
          url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
          valueCodeableConcept: {
            coding: [
              {
                system: 'http://hl7.org/fhir/questionnaire-item-control',
                code: 'drop-down',
              },
            ],
          },
        },
      ],
      linkId: '2.5',
      text: 'ECOG-Stadium',
      type: 'choice',
      answerValueSet: 'http://loinc.org/vs/LL529-9',
    },
    // {
    //   linkId: '2',
    //   prefix: '3.',
    //   text: 'Beantworten Sie bitte die folgende Frage unabhängig davon, inwieweit Sie zurzeit sexuell aktiv sind. Wenn Sie die Frage lieber nicht beantworten möchten, fahren Sie mit dem nächsten Abschnitt fort.<br><br>Ich bin mit meinem Sexualleben zufrieden',
    //   type: 'url',
    // },
    // {
    //   linkId: '1.1',
    //   prefix: '1.1 ',
    //   text: 'Beantworten Sie bitte die folgende Frage unabhängig davon, inwieweit Sie zurzeit sexuell aktiv sind. Wenn Sie die Frage lieber nicht beantworten möchten, fahren Sie mit dem nächsten Abschnitt fort.<br><br><i><u>Ich bin mit meinem Sexualleben zufrieden</u></i>',
    //   type: 'boolean',
    //   extension: [
    //     {
    //       url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
    //       hidden: true
    //     }
    //   ],
    //   answerValueSet: '',
    // },
    // {
    //   linkId: "2",
    //   prefix: "2.",
    //   text: "Frage 2",
    //   type: "string",
    // extension: [
    //   {
    //     url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
    //     hidden: true
    //   }
    // ],
    // },
    // {
    //   linkId: "3",
    //   prefix: "3.",
    //   text: "Fraaaaage 3",
    //   type: "string",
    //   enableWhen: [
    //     {
    //       question: "1.1",
    //       operator: "=",
    //       answerCoding: {
    //         code: "A2",
    //         display: "2"
    //     }
    //     },
    //   ],
    // },
  ],
};
export default vomitQuestionnaire;
