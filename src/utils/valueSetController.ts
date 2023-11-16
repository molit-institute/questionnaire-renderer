import * as fhirApi from '@molit/fhir-api';
import questionnaireResponseController from './questionnaireResponseController';

/**
 * Returns all ValueSets needed for the currently stored questionnaires. This Method takes all Questionnaires
 * and gets all valueSet references. These references are then used to fetch the ValueSets.
 * @param {Array} questionnaireList
 * @param {*} FHIR_URL
 */
async function getNewValueSets(questionnaireList, FHIR_URL, token, basicAuth, expand) {
  if (questionnaireList) {
    let questionsValueSetList = [];
    let fullQuestionsList = [];
    let referenceList = [];

    //get flat itemList
    for (let i = 0; i < questionnaireList.length; i++) {
      fullQuestionsList.push(questionnaireResponseController.createItemList(questionnaireList[i]));
    }
    //get all questions with valueset
    questionsValueSetList = getQuestionsWithValueSet(fullQuestionsList);

    //put all References in Array, avoid doubles
    referenceList = getReferencesFromValueSets(questionsValueSetList);

    //load all ValueSets and return the List
    if (FHIR_URL) {
      return await getValueSetsWithReferences(FHIR_URL, referenceList, token, basicAuth, expand);
    } else {
      throw new Error('The given FHIR_URL was null or undefined');
    }
  } else {
    throw new Error('The given QuestionnaireList was null or undefined');
  }
}

/**
 * Returns alle Questions with a ValueSet
 * @param {Array} fullQuestionsList List with all questions
 */
function getQuestionsWithValueSet(fullQuestionsList) {
  let list = [];
  for (let e = 0; e < fullQuestionsList.length; e++) {
    let questions = fullQuestionsList[e];
    for (let l = 0; l < questions.length; l++) {
      let question = questions[l];
      if (question.answerValueSet && !question.answerValueSet.startsWith('#')) {
        list.push(question);
      }
    }
  }
  return list;
}

/**
 * Returns a list of References ,avoiding duplicates
 * @param {Array} questionsValueSetList List with all questions that contain ValueSets
 */
function getReferencesFromValueSets(questionsValueSetList) {
  let list = [];
  if (questionsValueSetList) {
    for (let u = 0; u < questionsValueSetList.length; u++) {
      let reference = questionsValueSetList[u].answerValueSet;
      let push = true;
      //check for doubles
      for (let h = 0; h < list.length; h++) {
        if (reference === list[h]) {
          push = false;
        }
      }
      if (push) {
        list.push(reference);
      }
    }
  }
  return list;
}

/**
 * Fetches all ValueSets with their references
 * @param {*} FHIR_URL baseUrl
 * @param {*} referenceList List of valueSet-references
 */
async function getValueSetsWithReferences(FHIR_URL, referenceList, token, basicAuth, expand) {
  let list = [];
  try {
    for (let o = 0; o < referenceList.length; o++) {
      let valueSetBundle = null;
      if (expand) {
        valueSetBundle = await fhirApi.fetchByUrl(FHIR_URL + '/ValueSet/$expand?url=' + referenceList[o], null, token, basicAuth);
      } else {
        valueSetBundle = await fhirApi.fetchByUrl(FHIR_URL + '/ValueSet?url=' + referenceList[o], null, token, basicAuth);
      }

      // LEERE LISTE !!!
      let valueSet = { valueSet: null, reference: referenceList[o] }
      if (valueSetBundle.data.entry) {
        valueSet.valueSet = valueSetBundle.data.entry[0].resource;
        list.push(valueSet);
      } else {
        valueSet.valueSet = valueSetBundle.data;
        list.push(valueSet);
      }

      //fetch codesystem if concept in the valueSet is empty/null
      if (!valueSet.valueSet.compose.include[0].concept && valueSet.valueSet.compose.include[0].system && !expand) {
        let codesystem = await getCodeSystem(FHIR_URL,valueSet.valueSet.compose.include[0].system,token,basicAuth)
        valueSet.valueSet = addCodeSystemToValueSet(valueSet.valueSet, codesystem)
      }
    }
    return list;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Adds the concepts of a CodeSystem to a ValueSet
 * @param {Object} valueSet 
 * @param {Object} codesystem 
 */
function addCodeSystemToValueSet(valueSet, codesystem) {
  let newValueSet = valueSet;
  let concepts = codesystem.concept;
  newValueSet.expansion = { contains: [] }
  for (let i = 0; i < concepts.length; i++) {
    let concept = {
      system: codesystem.url,
      code: concepts[i].code,
      display: concepts[i].display
    }
    newValueSet.expansion.contains.push(concept)
  }
  return newValueSet
}

/**
 * Fetches a CodeSystem from the FHIR Server using its url
 * @param FHIR_URL baseUrl
 * @param reference the url stored in the ValueSet
 * @param token 
 * @param basicAuth 
 * @returns
 */
async function getCodeSystem(FHIR_URL, reference, token, basicAuth) {
  let codesystem = null;
  try {
    codesystem = await fhirApi.fetchByUrl(FHIR_URL + '/CodeSystem?url=' + reference, null, token, basicAuth);
  } catch (error) {
    throw new Error(error.message);
  }
  return codesystem.data.entry[0].resource;
}

export default {
  getNewValueSets,
  getQuestionsWithValueSet,
  getReferencesFromValueSets,
  getValueSetsWithReferences,
};
