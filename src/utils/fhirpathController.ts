import { evaluate } from 'fhirpath';
import questionnaireController from './questionnaireController';

export function handleCalculatedExpressions(questionnaire, questionnaireResponse, valueSets) {
  console.log(questionnaire, questionnaireResponse, valueSets);
  if (questionnaire) {
    let questionnaireItems = questionnaire.item;
    if (questionnaireItems) {
      for (let i = 0; i < questionnaireItems.length; i++) {

        let calculatedExpression = questionnaireController.lookForExtension('http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression', questionnaireItems[i]);
        if (calculatedExpression) {
          let expression = calculatedExpression.valueExpression.expression;
          let result = evaluate(questionnaireResponse, expression);
          console.log("result",result[0])
          if(result){
            addAnswersToQuestionnaireResponse(result, questionnaire, questionnaireItems[i], questionnaireResponse, valueSets);
          }
        }
      }
    }
  }
}

async function addAnswersToQuestionnaireResponse(result, questionnaire, question, questionnaireResponse, valueSets) {
  let questionnaireResponseItem = questionnaireResponse.item.find(item => item.linkId === question.linkId);
  switch (question.type) {
    case 'choice':
      if (valueSets.length !== 0) {
        let options = await questionnaireController.getChoiceOptions(questionnaire, question, valueSets);
        console.log(options)
        let option = await options.find(option => option.code === result[0] || option.display === result[0]);
        console.log("option", option)
        // put valueSet in correct answer
        questionnaireResponseItem.answer = [option];
      }
      break;
    case 'integer':
      questionnaireResponseItem.answer = [{ valueInteger: result }];
    default:
      break;
  }
}
export default { handleCalculatedExpressions };
