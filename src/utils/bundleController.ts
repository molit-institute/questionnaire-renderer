import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';

import questionnaireResponseController from './questionnaireResponseController';

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
    let item = questionnaireResponseItems[i]
    // wenn antwort vorhanden
    if(item.answer && item.answer.length !== 0 && questionnaireResponseController.getAnswerType(item.answer) === 'attachment'){
        // uuids generieren
        const binaryUUID = 'urn:uuid'+ crypto.randomUUID()
        const DocumentReferenceUUID = 'urn:uuid'+ crypto.randomUUID()
        // BinaryResource erstellen
        let binary = createBinaryResource('Binary',item.answer[0].valueAttachment.data)

        // DocumentReference erstellen
        // let documentReference = createDocumentReferenceResource()
        // data aus answer entfernen
        // Referenz auf DocumentReference in url hinterlegen
        // Resourcen in bundle pushen
    }
  }
  // QuestionnaireResponse ins Bundle
  bundle.entry.push(createBundleEntry(questionnaireResponseUUID, questionnaireResponse, 'POST', questionnaireResponse.resourceType));
  // wenn task vorhanden, dann bearbeiten
  if (task) {
    if (task.executionPeriod) {
      task.executionPeriod.start = dayjs(new Date()).format('YYYY-MM-DD');
      task.executionPeriod.end = new Date().toISOString();
    }
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

function createBinaryResource(contentType, data) {
  return { resourceType: 'Binary', contentType: contentType, data: data };
}

function createDocumentReferenceResource(contentType, title, binaryUUID) {
  return { resourceType: 'DocumentReference', status: 'current', "type":{"text": contentType},"date":dayjs(new Date()),content: { attachment:{contentType:contentType, title: title, url: binaryUUID}} };
}

function createBundleEntry(fullUrl, resource, method, methodUrl) {
  return { fullUrl: fullUrl, resource: resource, request: { method: method, url: methodUrl } };
}

export default {};
