const vomitQuestionnaire = {
  resourceType: "Questionnaire",
  id: "test",
  url: "http://fhir.molit.eu/fhir/Questionnaire/test",
  title: "demo questionnaire",
  status: "active",
  description: "This a short demo questionnaire showcasing different types of questions and functions",
  publisher: "MOLIT Institut gGmbH",
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
      linkId: "2",
      prefix: "3.",
      text: "Date Frage 2 ohne Extension",
      type: "url"
    },
    // {
    //   linkId: "1.1",
    //   prefix: "1.1",
    //   text: "Have you ever",
    //   type: "choice",
      //   extension: [
      //     {
      //       url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
      //       hidden: true
      //     }
      //   ],
      // answerValueSet: "https://molit.eu/fhir/ValueSet/vkh-VS-ecog"
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


  ]
};
export default vomitQuestionnaire;