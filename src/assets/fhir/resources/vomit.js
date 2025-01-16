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
          linkId: "2",
          text: "Gruppe",
          type: "group",
          item:[
            {
              linkId: "2.13",
              text: "TNM T-Wert",
              type: "choice",
              answerValueSet: "http://molit.eu/fhir/vitu/ValueSet/tnm-t",
              extension: [
                {
                  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
                  valueCodeableConcept: {
                    coding: [
                      {
                        system: "http://hl7.org/fhir/questionnaire-item-control",
                        code: "drop-down"
                      }
                    ]
                  }
                }
              ]
            },
            {
              linkId: "2.14",
              text: "TNM N-Wert",
              type: "choice",
              answerValueSet: "http://molit.eu/fhir/vitu/ValueSet/tnm-n",
              extension: [
                {
                  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
                  valueCodeableConcept: {
                    coding: [
                      {
                        system: "http://hl7.org/fhir/questionnaire-item-control",
                        code: "drop-down"
                      }
                    ]
                  }
                }
              ]
            },
            {
              linkId: "2.15",
              text: "TNM M-Wert",
              type: "choice",
              answerValueSet: "http://molit.eu/fhir/vitu/ValueSet/tnm-m",
              extension: [
                {
                  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
                  valueCodeableConcept: {
                    coding: [
                      {
                        system: "http://hl7.org/fhir/questionnaire-item-control",
                        code: "drop-down"
                      }
                    ]
                  }
                }
              ]
            },
            {
              linkId: "5",
              text: "UICC-Stadium",
              type: "choice",
              answerValueSet: "http://molit.eu/fhir/vitu/ValueSet/uiic-stage-extended",
              readOnly: true,
              extension: [
                {
                  url: "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression",
                  valueExpression : {
                    description : "UICC-Status",
                    language : "text/fhirpath",
                    expression : "iif(item.where(linkId = '2').item.where(linkId ='2.15').answer.valueCoding.code .toString().startsWith('M1'),'IV',iif(item.where(linkId = '2').item.where(linkId ='2.14').answer.valueCoding.code .toString().startsWith('N3') and item.where(linkId = '2').item.where(linkId ='2.15').answer.valueCoding.code .toString().startsWith('M0'),'IIIc',iif(item.where(linkId = '2').item.where(linkId ='2.13').answer.valueCoding.code .toString().startsWith('T4') and item.where(linkId = '2').item.where(linkId ='2.15').answer.valueCoding.code .toString().startsWith('M0'),'IIIb',iif(item.where(linkId = '2').item.where(linkId ='2.13').answer.valueCoding.code .toString().startsWith('T3') and item.where(linkId = '2').item.where(linkId ='2.14').answer.valueCoding.code .toString().startsWith('N2') and item.where(linkId = '2').item.where(linkId ='2.15').answer.valueCoding.code .toString().startsWith('M0'),'IIIa',iif(item.where(linkId = '2').item.where(linkId ='2.13').answer.valueCoding.code .toString().startsWith('T3') and item.where(linkId = '2').item.where(linkId ='2.14').answer.valueCoding.code .toString().startsWith('N1') and item.where(linkId = '2').item.where(linkId ='2.15').answer.valueCoding.code .toString().startsWith('M0'),'IIIa', iif(item.where(linkId = '2').item.where(linkId ='2.13').answer.valueCoding.code .toString().startsWith('T2') and item.where(linkId = '2').item.where(linkId ='2.14').answer.valueCoding.code .toString().startsWith('N2') and item.where(linkId = '2').item.where(linkId ='2.15').answer.valueCoding.code .toString().startsWith('M0'),'IIIa',iif(item.where(linkId = '2').item.where(linkId ='2.13').answer.valueCoding.code .toString().startsWith('T1') and item.where(linkId = '2').item.where(linkId ='2.14').answer.valueCoding.code .toString().startsWith('N2') and item.where(linkId = '2').item.where(linkId ='2.15').answer.valueCoding.code .toString().startsWith('M0'),'IIIa', iif(item.where(linkId = '2').item.where(linkId ='2.13').answer.valueCoding.code .toString().startsWith('T0') and item.where(linkId = '2').item.where(linkId ='2.14').answer.valueCoding.code .toString().startsWith('N2') and item.where(linkId = '2').item.where(linkId ='2.15').answer.valueCoding.code .toString().startsWith('M0'),'IIIa',iif(item.where(linkId = '2').item.where(linkId ='2.13').answer.valueCoding.code .toString().startsWith('T3') and item.where(linkId = '2').item.where(linkId ='2.14').answer.valueCoding.code .toString().startsWith('N0') and item.where(linkId = '2').item.where(linkId ='2.15').answer.valueCoding.code .toString().startsWith('M0'),'IIb', iif(item.where(linkId = '2').item.where(linkId ='2.13').answer.valueCoding.code .toString().startsWith('T2') and item.where(linkId = '2').item.where(linkId ='2.14').answer.valueCoding.code .toString().startsWith('N1') and item.where(linkId = '2').item.where(linkId ='2.15').answer.valueCoding.code .toString().startsWith('M0'),'IIb', iif(item.where(linkId = '2').item.where(linkId ='2.13').answer.valueCoding.code .toString().startsWith('T2') and item.where(linkId = '2').item.where(linkId ='2.14').answer.valueCoding.code .toString().startsWith('N0') and item.where(linkId = '2').item.where(linkId ='2.15').answer.valueCoding.code .toString().startsWith('M0'),'IIa', iif(item.where(linkId = '2').item.where(linkId ='2.13').answer.valueCoding.code .toString().startsWith('T1') and item.where(linkId = '2').item.where(linkId ='2.14').answer.valueCoding.code .toString().startsWith('N1') and item.where(linkId = '2').item.where(linkId ='2.15').answer.valueCoding.code .toString().startsWith('M0'),'Ib/IIa', iif(item.where(linkId = '2').item.where(linkId ='2.13').answer.valueCoding.code .toString().startsWith('T0') and item.where(linkId = '2').item.where(linkId ='2.14').answer.valueCoding.code .toString().startsWith('N1') and item.where(linkId = '2').item.where(linkId ='2.15').answer.valueCoding.code .toString().startsWith('M0'),'Ib/IIa', iif(item.where(linkId = '2').item.where(linkId ='2.13').answer.valueCoding.code .toString().startsWith('T1') and item.where(linkId = '2').item.where(linkId ='2.14').answer.valueCoding.code .toString().startsWith('N0') and item.where(linkId = '2').item.where(linkId ='2.15').answer.valueCoding.code .toString().startsWith('M0'),'0/Ia', null))))))))))))))"
                  }         
                },
                {
                  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
                  valueCodeableConcept: {
                    coding: [
                      {
                        system: "http://hl7.org/fhir/questionnaire-item-control",
                        code: "drop-down"
                      }
                    ]
                  }
                }
              ]
            }
          ]
        },

      
    // {
    //   linkId: "2.15",
    //   text: "TNM M-Wert",
    //   type: "integer"
    // },
    // {
    //   linkId: "5",
    //   text: "UICC-Stadium",
    //   type: "integer",
    //   extension: [
    //     {
    //       url : "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression",
    //       valueExpression : {
    //         description : "UICC Score Derivation",
    //         language : "text/fhirpath",
    //         expression : "item.where(linkId = '2.15').answer.valueInteger"
    //       }
    //     }
    //   ],
    //   readOnly: true
    // }
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