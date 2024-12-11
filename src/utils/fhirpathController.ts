import {evaluate} from 'fhirpath'

export function handleExpression(questionnaire, questionnaireResponse){
    //expressions in questionnaire finden
    // für jede gefundene expression 
    let expression = null
    let result = evaluate(questionnaireResponse,expression)
    //result in die zugehörige Antwort schreiben
}

export default {handleExpression}