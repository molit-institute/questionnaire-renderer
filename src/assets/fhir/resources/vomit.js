const vomitQuestionnaire = {
  resourceType: "Questionnaire",
  id: "test",
  title: "demo questionnaire",
  status: "active",
  description: "This a short demo questionnaire showcasing different types of questions and functions",
  publisher: "MOLIT Institut gGmbH",
  item: [
    {
      linkId: "1",
      prefix: "1.",
      text: "Have you ever worked with HL7 FHIR?",
      type: "string"
    }
  ]
};
export default vomitQuestionnaire;