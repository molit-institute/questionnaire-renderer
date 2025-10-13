import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';

import questionnaireResponseController from './questionnaireResponseController';

//TODO testen
export function buildBundle(questResp, task, questionnaireResponseStatus) {
  let bundle = createBundleResource();
  // questionnaireResponse clonen
  let questionnaireResponse = cloneDeep(questResp);
  // uuids generieren
  const questionnaireResponseUUID = 'urn:uuid:' + crypto.randomUUID();
  // questionnaireResponse bearbeiten
  if (this.questionnaireResponseStatus) {
    questionnaireResponse.status = questionnaireResponseStatus;
  } else {
    questionnaireResponse.status = 'completed';
  }
  questionnaireResponseController.removeQuestionnaireResponseDisplayQuestions(questionnaireResponse.item);
  // flachklopfen
  let questionnaireResponseItems = questionnaireResponseController.createItemList(questionnaireResponse);
  // durch questionnaireResponse item iterieren und nach type attachment suchen
  for (let i = 0; i < questionnaireResponseItems.length; i++) {
    let item = questionnaireResponseItems[i];
    // wenn antwort vorhanden
    if (item.answer && item.answer.length !== 0 && questionnaireResponseController.getAnswerType(item.answer) === 'attachment') {
      // uuids generieren
      const documentReferenceUUID = 'urn:uuid' + crypto.randomUUID();
      // DocumentReference erstellen
      let documentReference = createDocumentReferenceResource(item.answer[0].valueAttachment.contentType, item.answer[0].valueAttachment.title, documentReferenceUUID);
      // data aus answer entfernen
      item.answer[0].valueAttachment.data = null;
      // Resourcen in bundle pushen
      bundle.entry.push(createBundleEntry(documentReferenceUUID, documentReference, 'POST', documentReference.resourceType));
    }
  }
  // QuestionnaireResponse ins Bundle
  if (questResp && questResp.id) {
    bundle.entry.push(createBundleEntry(null, questionnaireResponse, 'PUT', questionnaireResponse.resourceType));
  } else {
    bundle.entry.push(createBundleEntry(questionnaireResponseUUID, questionnaireResponse, 'POST', questionnaireResponse.resourceType));
  }
  // wenn task vorhanden, dann bearbeiten
  if (task) {
    if (task.executionPeriod) {
      task.executionPeriod.start = dayjs(new Date()).format('YYYY-MM-DD');
      task.executionPeriod.end = new Date().toISOString();
    }
    let questionnaireResponseReference = null
    if(questResp && questResp.id){
      questionnaireResponseReference = "QuestionnaireResponse/"+ questResp.id
    }else
    task.output = [
      {
        type: {
          coding: [
            {
              system: 'http://hl7.org/fhir/ValueSet/resource-types',
              code: 'QuestionnaireResponse',
              display: 'QuestionnaireResponse',
            },
          ],
        },
        valueReference: {
          reference: questionnaireResponseUUID,
        },
      },
    ];
    task.status = 'completed';
    // task ins Bundle
    bundle.entry.push(createBundleEntry(null, task, 'PUT', 'Task/' + task.id));
  }
  return bundle;
}

function createBundleResource() {
  return { resourceType: 'Bundle', type: 'transaction', entry: [] };
}

function createDocumentReferenceResource(contentType, title, binaryUUID) {
  //TODO date checken
  return { resourceType: 'DocumentReference', status: 'current', type: { text: contentType }, date: dayjs(new Date()), content: { attachment: { contentType: contentType, title: title, url: binaryUUID } } };
}

function createBundleEntry(fullUrl, resource, method, methodUrl) {
  return { fullUrl: fullUrl, resource: resource, request: { method: method, url: methodUrl } };
}

export default {buildBundle};
