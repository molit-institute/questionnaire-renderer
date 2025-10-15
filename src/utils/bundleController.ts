import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import * as fhirApi from '@molit/fhir-util';

import questionnaireResponseController from './questionnaireResponseController';

export function buildBundle(questResp, task, questionnaireResponseStatus, subject) {
  let subjectReference = null;
  if (subject) {
    subjectReference = {reference: 'Patient/' + subject.id, display: fhirApi.getStringFromHumanName(subject.name)};
  }
  let bundle = createBundleResource();
  // questionnaireResponse clonen
  let questionnaireResponse = cloneDeep(questResp);
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
      const documentReferenceUUID = 'urn:uuid:' + uuidv4();
      // DocumentReference erstellen
      let documentReference = createDocumentReferenceResource(item.answer[0].valueAttachment.contentType, item.answer[0].valueAttachment.title, item.answer[0].valueAttachment.data, subjectReference);
      // data aus answer entfernen
      item.answer[0].valueAttachment.data = null;
      item.answer[0].valueAttachment.url = documentReferenceUUID;
      // Resourcen in bundle pushen
      bundle.entry.push(createBundleEntry(documentReferenceUUID, documentReference, 'POST', documentReference.resourceType));
    }
  }
  // uuids generieren
  const questionnaireResponseUUID = 'urn:uuid:' + uuidv4();
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
    let questionnaireResponseReference = null;
    if (questResp && questResp.id) {
      questionnaireResponseReference = 'QuestionnaireResponse/' + questResp.id;
    } else {
      questionnaireResponseReference = questionnaireResponseUUID;
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
          reference: questionnaireResponseReference,
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

function createDocumentReferenceResource(contentType, title, data, subjectReference) {
  //TODO date checken
  return {
    resourceType: 'DocumentReference',
    status: 'current',
    type: { text: contentType },
    date: dayjs(new Date()),
    content: { attachment: { contentType: contentType, title: title, data: data } },
    focus: subjectReference,
  };
}

function createBundleEntry(fullUrl, resource, method, methodUrl) {
  return { fullUrl: fullUrl, resource: resource, request: { method: method, url: methodUrl } };
}

export default { buildBundle };
