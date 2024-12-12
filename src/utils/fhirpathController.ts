import {evaluate} from 'fhirpath'
import questionnaireController from './questionnaireController';

export function handleExpression(questionnaire, questionnaireResponse, valueSets){
    //expressions in questionnaire finden
    let questionnaireItems = questionnaire.item;
    for(let i = 0; i< questionnaireItems.length; i++){

        let extension = questionnaireController.lookForExtension("http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression",questionnaireItems[i])
        if(extension){
            let expression = extension.valueExpression.expression
            let result = evaluate(questionnaireResponse,expression)
            //add to qr
            addAnswersToQuestionnaireResponse(questionnaireItems[i].type,questionnaireResponse, valueSets)
            
        }
    }
}

function addAnswersToQuestionnaireResponse(questionType,questionnaireResponse, valueSets){
    switch (questionType) {
        case "choice":
            //find correct valueSet
            //put valueSet in correct answer
            break;
    
        default:
            break;
    }
}
export default {handleExpression}