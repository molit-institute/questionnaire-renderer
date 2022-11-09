const dailyMovementQuestionnaire = {
  resourceType: 'Questionaire',
  id: 'dailyMovementQuestionnaire',
  title: 'Fragebogen zur täglichen Bewegung',
  status: "draft",
  subjectType: [ "Patient" ],
  date: "2022-11-02T00:00:00+02:00",
  publisher: "MOLIT Institut",
  description: "Fragebogen zum Einfluss der Erkrankung auf die tägliche Bewegung",
  item: [
      {
          linkId: '1',
          prefix: '1',
          text: 'Beeinflusst deine Erkrankung deine tägliche Bewegung?',
          type: 'boolean',
          required: true,
      },
      {
          linkId: "2",
          prefix: "2. ",
          text: "Weiterführende Fragen zum Thema Bewegung",
          type: "group",
          enableWhen: [
              {
                question: '1',
                operator: '=',
                answerBoolean: true,
              }
          ],
          item: [
              {
                  linkId: "2.1",
                  prefix: "2.1",
                  text: "Bereitet es Ihnen Schwierigkeiten sich körperlich anzustrengen (z.B. eine schwere Einkaufstasche oder einen Koffer zu tragen?)",
                  type: "choice",
                  extension: [
                      {
                        url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
                        valueCodeableConcept: {
                          coding: [
                            {
                              code: "radiobutton",
                            },
                          ],
                        },
                      },
                    ],
                  required: true,
                  answerValueSet : 'http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs',
                 
              },
              {
                  linkId: "2.2",
                  prefix: "2.2",
                  text: "Bereitet es Ihnen Schwierigkeiten, einen längeren Spaziergang zu machen?",
                  type: "choice",
                  extension: [
                      {
                        url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
                        valueCodeableConcept: {
                          coding: [
                            {
                              code: "radiobutton",
                            },
                          ],
                        },
                      },
                    ],
                  required: true,
                  answerValueSet : 'http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs',
                },
            {
              linkId: "2.3",
              prefix: "2.3",
              text: "Bereitet es Ihnen Schwierigkeiten, eine kurze Strecke außer Haus zu gehen?",
              type: "choice",
              extension: [
                  {
                    url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
                    valueCodeableConcept: {
                      coding: [
                        {
                          code: "radiobutton",
                        },
                      ],
                    },
                  },
                ],
              required: true,
              answerValueSet : 'http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs',
            },
          {
            linkId: "2.4",
            prefix: "2.4",
            text: "Müssen Sie tagsüber im Bett liegen oder im Sessel sitzen?",
            type: "choice",
            extension: [
                {
                  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
                  valueCodeableConcept: {
                    coding: [
                      {
                        code: "radiobutton",
                      },
                    ],
                  },
                },
              ],
            required: true,
            answerValueSet : 'http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs',
        },
        {
          linkId: "2.5",
          prefix: "2.5",
          text: "Brauchen Sie Hilfe beim Essen, Anziehen, Waschen oder Benutzen der Toilette?",
          type: "choice",
          extension: [
              {
                url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
                valueCodeableConcept: {
                  coding: [
                    {
                      code: "radiobutton",
                    },
                  ],
                },
              },
            ],
          required: true,
          answerValueSet : 'http://fhir.molit.eu/qlq-c30/ValueSet/qlq-c30-answer1-4-vs',
        },
          ]  
      },

  ]
};
export default dailyMovementQuestionnaire;