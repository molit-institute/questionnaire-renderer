export default {
  resourceType: "Questionnaire",
  id: "eq-5d-5l",
  url: "http://molit.eu/fhir/lion/Questionnaire/eq-5d-5l",
  version: "0.1.0",
  title: "EQ-5D-5L",
  status: "active",
  subjectType: ["Patient"],
  date: "2022-03-29T00:00:00+02:00",
  publisher: "MOLIT Institut",
  contact: [
    {
      name: "MOLIT Institut",
      telecom: [
        {
          system: "url",
          value: "http://example.org/example-publisher", //Muss hier noch ein Link auf unser Impressum rein?
        },
      ],
    },
  ],
  description: "Gesundheitsfragebogen der Euro QoL Research Foundation.",
  item: [
    {
      linkId: "0",
      text: "Bitte tippen Sie DAS Kästchen an, das Ihre Gesundheit HEUTE am besten beschreibt.",
      type: "group",
      item: [
        {
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
          linkId: "1",
          prefix: "1.",
          text: "BEWEGLICHKEIT/MOBILITÄT",
          type: "choice",
          required: true,
          answerValueSet: "http://molit.eu/fhir/lion/ValueSet/eq-5d-5l-answers1-vs",
        },
        {
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
          linkId: "2",
          prefix: "2.",
          text: "FÜR SICH SELBST SORGEN",
          type: "choice",
          required: true,
          answerValueSet: "http://molit.eu/fhir/lion/ValueSet/eq-5d-5l-answers2-vs",
        },
        {
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
          linkId: "3",
          prefix: "3.",
          text: "ALLTÄGLICHE TÄTIGKEITEN <i>(z.B. Arbeit, Studium, Hausarbeit, Familien- oder Freizeitaktivitäten)</i>", //Klein geschriebenes sollte noch als Subtitle hinzugefügt werden
          type: "choice",
          required: true,
          answerValueSet: "http://molit.eu/fhir/lion/ValueSet/eq-5d-5l-answers3-vs",
        },
        {
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
          linkId: "4",
          prefix: "4.",
          text: "SCHMERZEN/KÖRPERLICHE BESCHWERDEN",
          type: "choice",
          required: true,
          answerValueSet: "http://molit.eu/fhir/lion/ValueSet/eq-5d-5l-answers4-vs",
        },
        {
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
          linkId: "5",
          prefix: "5.",
          text: "ANGST/NIEDERGESCHLAGENHEIT",
          type: "choice",
          required: true,
          answerValueSet: "http://molit.eu/fhir/lion/ValueSet/eq-5d-5l-answers5-vs",
        },
      ],
    },

    {
      linkId: "6",
      text: "Wir wollen herausfinden, wie gut oder schlecht Ihre Gesundheit HEUTE ist.",
      type: "group",
      item: [
        {
          linkId: "6-subtitle",
          text: "<li> Diese Skala ist mit Zahlen von 0 bis 100 versehen. </br></br> <li> 100 ist die <u>beste</u> Gesundheit, die Sie sich vorstellen können. 0 (Null) ist die <u>schlechteste</u> Gesundheit, die Sie sich vorstellen können.",
          type: "display",
        },
        {
          linkId: "6.1",
          prefix: "6.",
          text: "Bitte tippen Sie den Punkt auf der Skala an, der Ihre Gesundheit HEUTE am besten beschreibt.",
          type: "integer",
          required: true,
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
              valueCodeableConcept: {
                coding: [
                  {
                    system: "http://hl7.org/fhir/questionnaire-item-control",
                    code: "slider",
                  },
                ],
              },
            },
            {
              url: "http://hl7.org/fhir/StructureDefinition/minValue",
              valueInteger: 0,
            },
            {
              url: "http://hl7.org/fhir/StructureDefinition/maxValue",
              valueInteger: 100,
            },
            {
              url: "http://hl7.org/fhir/StructureDefinition/questionnaire-sliderStepValue",
              valueInteger: 1,
            },
          ],
          item: [
            {
              linkId: "6.1.1",
              text: "Schlechteste Gesundheit, die Sie sich vorstellen können",
              type: "display",
              extension: [
                {
                  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
                  valueCodeableConcept: {
                    coding: [
                      {
                        system: "http://hl7.org/fhir/questionnaire-item-control",
                        code: "lower",
                        display: "Lower-bound",
                      },
                    ],
                  },
                },
              ],
            },
            {
              linkId: "6.1.2",
              text: "Beste Gesundheit, die Sie sich vorstellen kannst können",
              type: "display",
              extension: [
                {
                  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
                  valueCodeableConcept: {
                    coding: [
                      {
                        system: "http://hl7.org/fhir/questionnaire-item-control",
                        code: "upper",
                        display: "Upper-bound",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}