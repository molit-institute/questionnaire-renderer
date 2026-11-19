import { Questionnaire, QuestionnaireResponse, Task } from '@/types';

const QUESTIONNAIRE_VERSION_EXTENSION_URL = 'http://molit.eu/fhir/Task/questionnaireVersion';

export function getQuestionnaireReferenceFromTask(task: Task | null | undefined): string | null {
  if (!task) {
    return null;
  }
  if (task.focus && typeof task.focus.reference === 'string' && task.focus.reference.startsWith('Questionnaire/')) {
    return task.focus.reference;
  }
  if (task.input && Array.isArray(task.input)) {
    for (let i = 0; i < task.input.length; i++) {
      let entry = task.input[i];
      if (entry && entry.type && entry.type.coding && entry.type.coding.some(coding => coding.code === 'questionnaire') && entry.valueReference && entry.valueReference.reference) {
        return entry.valueReference.reference;
      }
    }
  }
  return null;
}

export function getQuestionnaireVersionFromTask(task: Task | null | undefined): string | null {
  if (!task || !task.extension || !Array.isArray(task.extension)) {
    return null;
  }
  let extension = task.extension.find(extension => extension.url === QUESTIONNAIRE_VERSION_EXTENSION_URL);
  if (extension && extension.valueString) {
    return extension.valueString;
  }
  return null;
}

export function questionnaireMatchesReference(questionnaire: Questionnaire | null | undefined, reference: string, expectedVersion?: string | null): boolean {
  if (!questionnaire || !reference) {
    return false;
  }
  let questionnaireRef = reference.split('|')[0];
  if (questionnaireRef.startsWith('Questionnaire/')) {
    questionnaireRef = questionnaireRef.substring('Questionnaire/'.length);
  }
  let matchesReference = questionnaireRef === questionnaire.url || questionnaireRef === questionnaire.id;
  if (!matchesReference && questionnaire.identifier && Array.isArray(questionnaire.identifier)) {
    matchesReference = questionnaire.identifier.some(identifier => identifier.value === questionnaireRef);
  }
  if (!matchesReference) {
    return false;
  }
  if (expectedVersion && questionnaire.version !== expectedVersion) {
    return false;
  }
  return true;
}

export function taskMatchesQuestionnaireResponse(task: Task | null | undefined, questionnaireResponse: QuestionnaireResponse | null | undefined): boolean | null {
  if (!task || !task.partOf || !Array.isArray(task.partOf) || !task.partOf[0] || !task.partOf[0].reference) {
    return null;
  }
  let reference = task.partOf[0].reference;
  if (!reference.startsWith('QuestionnaireResponse/')) {
    return null;
  }
  if (!questionnaireResponse || !questionnaireResponse.id) {
    return null;
  }
  return reference === 'QuestionnaireResponse/' + questionnaireResponse.id;
}

export default { getQuestionnaireReferenceFromTask, getQuestionnaireVersionFromTask, questionnaireMatchesReference, taskMatchesQuestionnaireResponse };
