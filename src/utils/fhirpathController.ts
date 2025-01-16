import { evaluate } from 'fhirpath';
import questionnaireController from './questionnaireController';
import questionnaireResponseController from './questionnaireResponseController';

export async function handleCalculatedExpressions(questionnaire, questionnaireResponse, valueSets) {
  console.log("handleCalculatedExpressions")
  if (questionnaire) {
    console.log("questionnaier")
    let questionnaireItems = questionnaireResponseController.createItemList(questionnaire);
    if (questionnaireItems) {
      for (let i = 0; i < questionnaireItems.length; i++) {
        console.log(questionnaireItems[i])
        let calculatedExpression = questionnaireController.lookForExtension('http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression', questionnaireItems[i]);
        console.log("CalculatedExpression", calculatedExpression)
        if (calculatedExpression) {
          let expression = calculatedExpression.valueExpression.expression;
          let result = evaluate(questionnaireResponse, expression);
          if (result) {
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
        if(options && options.length !== 0 && result && result.length !== 0){
          let option = await options.find(option => option.code.toLowerCase() === result[0].toLowerCase() || option.display.toLowerCase() === result[0].toLowerCase());
          if (!option) {
            console.error('The required option was not found in the available valueSet. The search result was: ', option);
            questionnaireResponseItem.answer = null;
          }
          questionnaireResponseItem.answer = [{ valueCoding: option }];
        }else{
          questionnaireResponseItem.answer = null;
        }
      } else {
        // console.error('The available valueSet-array was empty: ', valueSets);
      }
      break;
    case 'boolean':
      questionnaireResponseItem.answer = [{ valueBoolean: result }];
      break;
    case 'integer':
      questionnaireResponseItem.answer = [{ valueInteger: result }];
      break;
    case 'decimal':
      questionnaireResponseItem.answer = [{ valueDecimal: result }];
      break;
    case 'date':
      questionnaireResponseItem.answer = [{ valueDate: result }];
      break;
    case 'dateTime':
      questionnaireResponseItem.answer = [{ valueDateTime: result }];
      break;
    case 'string':
      questionnaireResponseItem.answer = [{ valueString: result }];
      break;
    case 'time':
      questionnaireResponseItem.answer = [{ valueTime: result }];
      break;
    case 'url':
      questionnaireResponseItem.answer = [{ valueUrl: result }];
      break;
    //TODO: Add more question-types
    default:
      break;
  }
}
export default { handleCalculatedExpressions };
