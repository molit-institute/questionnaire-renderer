import { evaluate } from 'fhirpath';
import questionnaireController from './questionnaireController';

export async function handleCalculatedExpressions(questionnaire, questionnaireResponse, valueSets) {
  if (questionnaire) {
    let questionnaireItems = questionnaire.item;
    if (questionnaireItems) {
      for (let i = 0; i < questionnaireItems.length; i++) {

        let calculatedExpression = questionnaireController.lookForExtension('http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression', questionnaireItems[i]);
        if (calculatedExpression) {
          let expression = calculatedExpression.valueExpression.expression;
          let result = evaluate(questionnaireResponse, expression);
          if(result){
            await addAnswersToQuestionnaireResponse(result, questionnaire, questionnaireItems[i], questionnaireResponse, valueSets);
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
        let option = await options.find(option => option.code === result[0] || option.display === result[0]);
        if(!option){
          console.error("The required option was not found in the available valueSet. The search result was: ", option)
        }
        questionnaireResponseItem.answer = [{valueCoding: option}];
      }else {
        console.error("The available valueSet-array was empty: ", valueSets)
      }
      break;
      //TODO: Add more question-types
    default:
      break;
  }
}
export default { handleCalculatedExpressions };
