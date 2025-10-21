import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import * as fhirApi from '@molit/fhir-util';

import questionnaireResponseController from './questionnaireResponseController';

export function buildBundle(questResp, task, status, questionnaireResponseStatus, subject) {
  let subjectReference = null;
  if (subject) {
    subjectReference = { reference: 'Patient/' + subject.id, display: fhirApi.getStringFromHumanName(subject.name) };
  }
  let bundle = createBundleResource();
  let questionnaireResponse = cloneDeep(questResp);

  if (this.questionnaireResponseStatus) {
    questionnaireResponse.status = questionnaireResponseStatus;
  } else {
    questionnaireResponse.status = status;
  }
  questionnaireResponseController.removeQuestionnaireResponseDisplayQuestions(questionnaireResponse.item);
  // create flat itemlist
  let questionnaireResponseItems = questionnaireResponseController.createItemList(questionnaireResponse);
  // iterate through flat itemlist and search for questions of type attachment
  for (let i = 0; i < questionnaireResponseItems.length; i++) {
    let item = questionnaireResponseItems[i];
    // if item has answer
    if (item.answer && item.answer.length !== 0 && questionnaireResponseController.getAnswerType(item.answer) === 'attachment') {
      const documentReferenceUUID = 'urn:uuid:' + uuidv4();
      let documentReference = createDocumentReferenceResource(item.answer[0].valueAttachment.contentType, item.answer[0].valueAttachment.title, item.answer[0].valueAttachment.data, subjectReference);
      // remove data from answer after it has been stored in the documentReference
      item.answer[0].valueAttachment.data = null;
      item.answer[0].valueAttachment.url = documentReferenceUUID;
      bundle.entry.push(createBundleEntry(documentReferenceUUID, documentReference, 'POST', documentReference.resourceType));
    }
  }
  const questionnaireResponseUUID = 'urn:uuid:' + uuidv4();
  // if questionnaireResponse already has an id, dont use the uuid as the resource already exists and needs to be updated
  if (questResp && questResp.id) {
    bundle.entry.push(createBundleEntry(null, questionnaireResponse, 'PUT', questionnaireResponse.resourceType));
  } else {
    bundle.entry.push(createBundleEntry(questionnaireResponseUUID, questionnaireResponse, 'POST', questionnaireResponse.resourceType));
  }

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

    task.status = status;

    bundle.entry.push(createBundleEntry(null, task, 'PUT', 'Task/' + task.id));
  }
  return bundle;
}

function createBundleResource() {
  return { resourceType: 'Bundle', type: 'transaction', entry: [] };
}

function createDocumentReferenceResource(contentType, title, data, subjectReference) {
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
