const vomitQuestionnaire = {
  resourceType: 'Questionnaire',
  id: 'test',
  url: 'http://fhir.molit.eu/fhir/Questionnaire/test',
  title: 'demo questionnaire',
  status: 'active',
  description: 'This a short demo questionnaire showcasing different types of questions and functions',
  publisher: 'MOLIT Institut gGmbH',
  item: [
    {
      linkId: '3',
      prefix: '1.',
      text: 'boolean',
      type: 'boolean',
    },
    // {
    //   linkId: "4",
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
      linkId: '2',
      prefix: '3.',
      text: 'Attachment Frage',
      type: 'attachment',
    },
    {
      linkId: '1',
      prefix: '3.',
      required: true,
      text: 'Attachment Frage 2',
      type: 'attachment',
    },
    {
      linkId: '4',
      text: 'Gruppe',
      type: 'group',
      item: [
        {
          linkId: '41',
          prefix: '3.',
          text: 'Attachment Frage 3',
          type: 'attachment',
        },
      ],
    },
    {
      linkId: '6',
      text: 'Wir wollen herausfinden, wie gut oder schlecht Ihre Gesundheit HEUTE ist.',
      type: 'group',
      item: [
        {
          linkId: '6-subtitle',
          text: '<li> Diese Skala ist mit Zahlen von 0 bis 100 versehen. </br></br> <li> 100 ist die <u>beste</u> Gesundheit, die Sie sich vorstellen können. 0 (Null) ist die <u>schlechteste</u> Gesundheit, die Sie sich vorstellen können.',
          type: 'display',
        },
        {
          extension: [
            {
              url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
              valueCodeableConcept: {
                coding: [
                  {
                    system: 'http://hl7.org/fhir/questionnaire-item-control',
                    code: 'slider',
                  },
                ],
              },
            },
            {
              url: 'http://hl7.org/fhir/StructureDefinition/minValue',
              valueInteger: 0,
            },
            {
              url: 'http://hl7.org/fhir/StructureDefinition/maxValue',
              valueInteger: 100,
            },
            {
              url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-sliderStepValue',
              valueInteger: 1,
            },
          ],
          linkId: '6.1',
          prefix: '6.',
          text: 'Bitte tippen Sie den Punkt auf der Skala an, der Ihre Gesundheit HEUTE am besten beschreibt.',
          type: 'integer',
          item: [
            {
              extension: [
                {
                  url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                  valueCodeableConcept: {
                    coding: [
                      {
                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                        code: 'lower',
                        display: 'Lower-bound',
                      },
                    ],
                  },
                },
              ],
              linkId: '6.1.1',
              text: 'Schlechteste Gesundheit, die Sie sich vorstellen können',
              type: 'display',
            },
            {
              extension: [
                {
                  url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
                  valueCodeableConcept: {
                    coding: [
                      {
                        system: 'http://hl7.org/fhir/questionnaire-item-control',
                        code: 'upper',
                        display: 'Upper-bound',
                      },
                    ],
                  },
                },
              ],
              linkId: '6.1.2',
              text: 'Beste Gesundheit, die Sie sich vorstellen können',
              type: 'display',
            },
          ],
        },
      ],
    },
    // {
    //   linkId: "1.1",
    //   prefix: "1.1 ",
    //   text: "Beantworten Sie bitte die folgende Frage unabhängig davon, inwieweit Sie zurzeit sexuell aktiv sind. Wenn Sie die Frage lieber nicht beantworten möchten, fahren Sie mit dem nächsten Abschnitt fort.<br><br><i><u>Ich bin mit meinem Sexualleben zufrieden</u></i>",
    //   type: "boolean",
    //     extension: [
    //       {
    //         url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
    //         hidden: true
    //       }
    //     ],
    //   answerValueSet: ""
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
