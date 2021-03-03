const everyTypeQuestionnaire = {
  resourceType: 'Questionnaire',
  id: '5',
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
  title: 'Test question types',
  status: 'active',
  subjectType: ['Patient'],
  date: '2019-04-26T00:00:00+02:00',
  publisher: 'MOLIT Institut',
  description: 'Dieser Fragebogen wurde zu Testzwecken erstellt und sollte nicht außerhalb der Testumgebung genutzt werden.',
  item: [
    // {
    //   linkId: '1',
    //   text: 'Wählen sie den Testfokus aus. Es sind mehrere Antworten möglich',
    //   type: 'choice',
    //   repeats: true,
    //   answerOption: [
    //     {
    //       valueString: 'Pflichtfragen',
    //     },
    //     {
    //       valueString: 'Nope',
    //     },
    //   ],
    // },
    // {
    //   linkId: '3',
    //   text: 'Pflichfragen',
    //   type: 'group',
    //   enableWhen: [
    //     {
    //       question: '1',
    //       operator: '=',
    //       answerString: 'Pflichtfragen',
    //     },
    //   ],
    //   item: [
        // {
        //   linkId: '3.1',
        //   prefix: '3.1',
        //   text: 'Url Required',
        //   type: 'url',
        //   required: true,
        // },
        // {
        //   linkId: '3.2',
        //   prefix: '3.2',
        //   text: 'Text Required',
        //   type: 'text',
        //   required: true,
        // },
        // {
        //   linkId: '3.3',
        //   prefix: '3.3',
        //   text: 'String Required',
        //   type: 'string',
        //   required: true,
        // },
        // {
        //   linkId: '3.4',
        //   prefix: '3.4',
        //   text: 'Decimal Required',
        //   type: 'decimal',
        //   required: true,
        // },
        // {
        //   linkId: '3.5',
        //   prefix: '3.5',
        //   text: 'Integer Required',
        //   type: 'integer',
        //   required: true,
        // },
        // {
        //   linkId: '3.6',
        //   prefix: '3.6',
        //   text: 'Date Required',
        //   type: 'date',
        //   required: true,
        // },
        // {
        //   linkId: '3.7',
        //   prefix: '3.7',
        //   text: 'Time Required',
        //   type: 'time',
        //   required: true,
        // },
        // {
        //   linkId: '3.8',
        //   prefix: '3.8',
        //   text: 'DateTime Required',
        //   type: 'dateTime',
        //   required: true,
        // },
        // {
        //   linkId: '3.9',
        //   prefix: '3.9',
        //   text: 'Boolean Required',
        //   type: 'boolean',
        //   required: true,
        // },
        {
          linkId: '3.9',
          prefix: '3.9',
          text: 'first buffer question',
          type: 'string',
        },
        {
          linkId: '3.11',
          prefix: '3.11',
          text: 'Multiple-Choice Required?',
          type: 'choice',
          required: true,
          repeats: true,
          answerValueSet: 'http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4',
        },
        {
          linkId: '3.10',
          prefix: '3.10',
          text: 'Single-Choice Required',
          type: 'choice',
          required: true,
          answerValueSet: 'http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4',
        },
        {
          linkId: '3.12',
          prefix: '3.12',
          text: 'second buffer question',
          type: 'string',
        },
      // ],
    // },
    // {
    //   linkId: '6',
    //   text: 'Visual Analog Scale',
    //   type: 'group',
    //   item: [
    //     {
    //       extension: [
    //         {
    //           url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
    //           valueCodeableConcept: {
    //             coding: [
    //               {
    //                 system: 'http://molit.eu/fhir/CodeSystem/questionnaire-codes-tbd',
    //                 code: 'slider',
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           url: 'http://hl7.org/fhir/StructureDefinition/minValue',
    //           valueInteger: 0,
    //         },
    //         {
    //           url: 'http://hl7.org/fhir/StructureDefinition/maxValue',
    //           valueInteger: 100,
    //         },
    //         {
    //           url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-sliderStepValue',
    //           valueInteger: 1,
    //         },
    //       ],
    //       linkId: '6.1',
    //       prefix: '6.1',
    //       text: 'Bitte geben Sie über die analoge Skala an, wie stark Ihre Schmerzen sind.',
    //       type: 'integer',
    //       item: [
    //         {
    //           extension: [
    //             {
    //               url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
    //               valueCodeableConcept: {
    //                 coding: [
    //                   {
    //                     system: 'http://hl7.org/fhir/questionnaire-item-control',
    //                     code: 'lower',
    //                     display: 'Lower-bound',
    //                   },
    //                 ],
    //                 text: "Text is displayed to the left of the set of answer choices or a scaling control for the parent question item to indicate the meaning of the 'lower' bound. E.g. 'Strongly disagree'",
    //               },
    //             },
    //           ],
    //           linkId: '6.1.1',
    //           text: 'No pain',
    //           type: 'display',
    //         },
    //         {
    //           extension: [
    //             {
    //               url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
    //               valueCodeableConcept: {
    //                 coding: [
    //                   {
    //                     system: 'http://hl7.org/fhir/questionnaire-item-control',
    //                     code: 'upper',
    //                     display: 'Upper-bound',
    //                   },
    //                 ],
    //                 text: "Text is displayed to the right of the set of answer choices or a scaling control for the parent question item to indicate the meaning of the 'upper' bound. E.g. 'Strongly agree'",
    //               },
    //             },
    //           ],
    //           linkId: '6.1.2',
    //           text: 'Worst pain ever',
    //           type: 'display',
    //         },
    //       ],
    //     },
    //   ],
    // },
  ],
};
export default everyTypeQuestionnaire;
