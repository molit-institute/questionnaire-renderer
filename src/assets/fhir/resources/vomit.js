const vomitQuestionnaire = {
  resourceType: "Questionnaire",
  id: "test",
  url: "http://fhir.molit.eu/fhir/Questionnaire/test",
  title: "demo questionnaire",
  status: "active",
  description: "This a short demo questionnaire showcasing different types of questions and functions",
  publisher: "MOLIT Institut gGmbH",
  item: [
    {
      linkId: "1",
      prefix: "1.",
      text: "Have you ever worked with HL7 FHIR?",
      type: "boolean",
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
          hidden: true
        }
      ],
    },
    {
      linkId: "1.1",
      prefix: "1.1",
      text: "Have you ever",
      type: "boolean",
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
          hidden: true
        }
      ],
    },
    {
      linkId: "2",
      prefix: "2.",
      text: "Have you ever worked with HL7 FHIR?",
      type: "string",
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
          hidden: false
        }
      ],
    },
    {
      linkId: "3",
      prefix: "3.",
      text: "Have you ever worked with HL7 FHIR?",
      type: "string",
      enableBehavior: "Any",
      enableWhen: [
        {
          question: "1",
          operator: "=",
          answerInteger: 22
        },
        // {
        //   question: "1.1",
        //   operator: "=",
        //   answerBoolean: true
        // }
      ],
    },


  ]
};
export default vomitQuestionnaire;