const dropdown_test_questionnaire = {
  resourceType: 'Questionnaire',
  title: 'Dropdown Extension',
  url: 'https://molit.eu/fhir/Questionnaire/Dropdown-Extension',
  publisher: 'MOLIT Service GmbH',
  version: '0.1.0',
  status: 'active',
  item: [
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
      linkId: '3',
      prefix: '3',
      text: 'DropDown Short',
      type: 'choice',
      answerValueSet: 'https://molit.eu/fhir/ValueSet/QLQC30-VS-answers4',
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
      linkId: '4',
      prefix: '4',
      text: 'DropDown Short',
      type: 'choice',
      repeats: true,
      answerValueSet: 'https://molit.eu/fhir/ValueSet/QLQC30-VS-answers4',
    },
    // {
    //   extension: [
    //     {
    //       url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
    //       valueCodeableConcept: {
    //         coding: [
    //           {
    //             system: 'http://hl7.org/fhir/questionnaire-item-control',
    //             code: 'drop-down',
    //           },
    //         ],
    //       },
    //     },
    //   ],
    //   linkId: '1',
    //   prefix: '1.',
    //   text: 'Wählen Sie eine Diagnose aus.',
    //   type: 'choice',
    //   answerValueSet: 'http://molit.eu/fhir/vitu/ConceptMap/icd10-to-subtype',
    // },
    // {
    //   extension: [
    //     {
    //       url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
    //       valueCodeableConcept: {
    //         coding: [
    //           {
    //             system: 'http://hl7.org/fhir/questionnaire-item-control',
    //             code: 'drop-down',
    //           },
    //         ],
    //       },
    //     },
    //   ],
    //   linkId: '2',
    //   prefix: '2.',
    //   text: 'Wählen Sie eine oder mehrere Diagnosen aus.',
    //   type: 'choice',
    //   repeats: true,
    //   answerValueSet: 'http://molit.eu/fhir/vitu/ConceptMap/icd10-to-subtype',
    // },
  ],
};

export default dropdown_test_questionnaire;
