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
      prefix: "1. ",
      text: "Bereitet es Ihnen Schwierigkeiten sich körperlich anzustrengen? (z.B. eine schwere Einkaufsstasche oder einen Koffer zu tragen)",
      type: "choice",
      required: true,
      answerValueSet: "https://molit.eu/fhir/ValueSet/QLQC30-VS-answers4"
  },
    // {
    //   linkId: "1",
    //   prefix: "1.",
    //   text: "Have you ever worked with HL7 FHIR?",
    //   type: "boolean",
    //   extension: [
    //     {
    //       url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
    //       hidden: true
    //     }
    //   ],
    // },
    // {
    //   linkId: "1.1",
    //   prefix: "1.1",
    //   text: "Have you ever",
    //   type: "boolean",
    //   extension: [
    //     {
    //       url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
    //       hidden: true
    //     }
    //   ],
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
    //   enableBehavior: "Any",
    //   enableWhen: [
    //     {
    //       question: "1",
    //       operator: "=",
    //       answerBoolean: true
    //     },
    //   ],
    // },


  ]
};
export default vomitQuestionnaire;