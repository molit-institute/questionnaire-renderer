import { QuestionnaireResponse, Item, Answer } from './questionnaireResponse';
import dateTimeController from './dateTimeController';
import { valueTypes } from './valueTypes';
import * as fhirApi from '@molit/fhir-util';

//#region CREATE QUESTIONNAIRE RESPONSE

/**
 * Gets a Questionnaire and returns a QuestionnaireResponse.
 * Parameter Questionnaire-may not be null or undefined
 * return QuestionnaireResponse
 *
 * @param {Object} questionnaire The Questionnaire
 * @param {Object} subject FHIR patient
 * @param {Object} questionnaireResponse FHIR questionnaireResponse
 */
export function createQuestionnaireResponse(questionnaire, subject, questionnaireResponse) {
  if (questionnaire) {
    const questResp = QuestionnaireResponse.create();
    //ID
    if(questionnaireResponse && questionnaireResponse.id){
      questResp.id = questionnaireResponse.id;
    }
    //QUESTIONNAIRE
    questResp.questionnaire = questionnaire.url;
    //STATUS
    questResp.status = 'in-progress';
    //SOURCE
    if (subject) {
      if (subject.name) {
        questResp.source = {
          reference: subject.resourceType + '/' + subject.id,
          display: fhirApi.getStringFromHumanName(subject.name),
        };
        questResp.subject = {
          reference: subject.resourceType + '/' + subject.id,
          display: fhirApi.getStringFromHumanName(subject.name),
        };
      } else {
        questResp.source = {
          reference: subject.resourceType + '/' + subject.id,
        };
        questResp.subject = {
          reference: subject.resourceType + '/' + subject.id,
        };
      }
    }

    //AUTHORED date when response created
    if(questionnaireResponse && questionnaireResponse.authored){
      questResp.authored = questionnaireResponse.authored;
    }else{
      questResp.authored = dateTimeController.getTimestamp();
    }
    //ITEMS | filling item with items
    if (questionnaire.item) {
      questResp.item = createItemArray(questionnaire.item);
    }
    return questResp;
  } else {
    throw new Error('Creating a Questionnaire Response failed because the given Questionnaire or Patient was null or undefined');
  }
}

//#endregion

//#region HANDLING DISPLAY-QUESTIONS
/**
   * Removes questions of the type "display" from the list.
   */
 async function removeQuestionnaireResponseDisplayQuestions(list){
  await list.reduceRight((_acc,question,index,object) => {
    if(question.type === "display"){
      object.splice(index,1)
    }
    if(question.item && question.item.length !== 0){
      this.removeQuestionnaireResponseDisplayQuestions(question.item)
    }
  }, []);
}
//#endregion

//#region HANDLING QUESTIONNAIRE ITEM TO RESPONSE ITEM

/**
 * Creates an Array with all the Items from the Questionnaire Item.
 *
 * @param {Object} questionnaireItem the current questionnaire item to be used
 */
function createItemArray(questionnaireItem) {
  let itemList = [];
  for (let i = 0; i < questionnaireItem.length; i++) {
    if (questionnaireItem[i].type === `group`) {
      itemList.push(createGroupItem(questionnaireItem[i]));
    } else if(questionnaireItem[i].type !=="display") {
      itemList.push(createQuestionItem(questionnaireItem[i]));
    }
  }
  return itemList;
}

/**
 * Creates a new Item for a Group-Question and calls the createItemArray-Method to create more Items in itself if needed
 *
 * @param {*} groupItem A item with the type "group"
 */
function createGroupItem(groupItem) {
  let item = Item.create();
  item.linkId = groupItem.linkId;
  item.definition = Object.assign({ reference: groupItem.definition });
  item.text = groupItem.text;
  item.answer = [];
  item.item = createItemArray(groupItem.item);
  return item;
}

/**
 * Creates a new QuestionItem
 * @param {*} questionItem A normal question Item with no Group in it
 */
function createQuestionItem(questionItem) {
  let item = Item.create();
  item.linkId = questionItem.linkId;
  item.definition = questionItem.definition;
  item.text = questionItem.text;
  if (questionItem.initial != null && questionItem.initial.length)
    item.answer = questionItem.initial
  else item.answer = [];
  item.item = null;
  return item;
}

//#endregion

//#region ANSWER-CREATION AND QUESTION-FINDING

/**
 * Creates a new Answer-Object with the given value
 *
 * @param {*} data
 * @param {*} type type of the answer
 */
export function createAnswer(data, type) {
  //create answer
  let answer = Answer.create();
  //create value
  let value = null;
  let coding = null;
  //fill value depending on type
  if (data && type) {
    switch (type) {
      case valueTypes.BOOLEAN:
        if (data === 'yes') {
          data = true;
        } else if (data === 'no') {
          data = false;
        }
        value = Object.assign({ valueBoolean: data });
        break;
      case valueTypes.STRING:
        value = Object.assign({ valueString: data });
        break;
      case valueTypes.CODING:
        coding = Object.assign({ display: data.display, code: data.code });
        value = Object.assign({ valueCoding: coding });
        break;
      case valueTypes.INTEGER:
        //TODO Check if number causes issues in Integer and Decimal
        // value = Object.assign({ valueInteger: '' + data });
        value = Object.assign({ valueInteger: data });
        break;
      case valueTypes.DECIMAL:
        value = Object.assign({ valueDecimal: '' + data });
        break;
      case valueTypes.DATE:
        value = Object.assign({ valueDate: data });
        break;
      case valueTypes.DATETIME:
        value = Object.assign({ valueDateTime: data });
        break;
      case valueTypes.TIME:
        value = Object.assign({ valueTime: data });
        break;
      case valueTypes.TEXT:
        value = Object.assign({ valueString: data });
        break;
      case valueTypes.URI:
        value = Object.assign({ valueUri: data });
        break;
      case valueTypes.QUANTITY:
        value = Object.assign({ valueQuantity:{value: data.value,unit: data.unit, code: data.code, system: data.system}})
      default:
    }
  }
  //add value to answer
  answer = value;
  //return answer
  return answer;
}

/**
 * Creates an Array with Answers
 *
 * @param {Array} array Array containing the given answers
 * @param {String} type
 */
export function createAnswers(array, type) {
  const newArray = [];

  if (array && type) {
    for (let i = 0; i < array.length; i++) {
      newArray.push(createAnswer(array[i], type));
    }
  }

  return newArray;
}

/**
 * Adds an Array of Answers to the questionnaireResponse
 *
 * @param {Object} questionnaireResponse
 * @param {String} linkId Question linkId
 * @param {Array} array Array with one or more Answers
 * @param {String} type type of the question
 */
export function addAnswersToQuestionnaireResponse(questionnaireResponse, linkId, array, type) {
  let questResp = questionnaireResponse;
  try {
    if (questResp && linkId && type && array !== null) {
      questResp = { ...questResp, item: addAnswersToQuestion(questResp.item, linkId, array, type) };
      if (!questionnaireResponse.item) {
        throw new Error('Adding Answers to Question did not work, the QuestionnaireResponse items were null or undefined');
      }
    }
    return questResp;
  } catch (error) {
    throw new Error('Adding Answers to questionnaireResponse failed, because the given parameters were null or undefined');
  }
}

/**
 * Looks for the linkId of a question and adds the answers
 *
 * @param {Object} varitem
 * @param {String} linkId Question linkId
 * @param {Array} array Array with one or more Answers
 * @param {String} type type of the question
 */
function addAnswersToQuestion(varitem, linkId, array, type) {
  for (let i = 0; i < varitem.length; i++) {
    if (varitem[i].item) {
      varitem[i].item = addAnswersToQuestion(varitem[i].item, linkId, array, type);
    } else {
      if (varitem[i].linkId === linkId) {
        varitem[i].answer = createAnswers(array, type);
      }
    }
  }
  return varitem;
}
//#endregion

//#region GETTING ANSWER VALUE

/**
 * Returns all the given Answers of a specific Item in a QuestionnaireResponse
 *
 * @param {Object} questionnaireResponse
 * @param {String} linkId
 * @param {String} type
 */
export function getAnswersFromQuestionnaireResponse(questionnaireResponse, linkId, type) {
  let answerValue = null;
  let codingValue = [];
  try {
    if (questionnaireResponse && linkId && type) {
      let itemList = this.createItemList(questionnaireResponse);
      //Iterating through all items in the list checking types
      for (let i = 0; i < itemList.length; i++) {
        if (itemList[i].linkId === linkId && itemList[i].answer[0]) {
          switch (type) {
            case valueTypes.BOOLEAN:
              answerValue = itemList[i].answer[0].valueBoolean;
              break;
            case valueTypes.STRING:
              answerValue = itemList[i].answer[0].valueString;
              break;
            case valueTypes.CODING:
              for (let a = 0; a < itemList[i].answer.length; a++) {
                // codingValue.push(
                //   Object.assign({
                //     display: itemList[i].answer[a].valueCoding.display,
                //     code: itemList[i].answer[a].valueCoding.code
                //   })
                // );
                codingValue = [
                  ...codingValue,
                  {
                    display: itemList[i].answer[a].valueCoding.display,
                    code: itemList[i].answer[a].valueCoding.code,
                  },
                ];
              }
              break;
            case valueTypes.INTEGER:
              answerValue = itemList[i].answer[0].valueInteger;
              break;
            case valueTypes.DECIMAL:
              answerValue = itemList[i].answer[0].valueDecimal;
              break;
            case valueTypes.DATE:
              answerValue = itemList[i].answer[0].valueDate;
              break;
            case valueTypes.DATETIME:
              answerValue = itemList[i].answer[0].valueDateTime;
              break;
            case valueTypes.TIME:
              answerValue = itemList[i].answer[0].valueTime;
              break;
            case valueTypes.TEXT:
              answerValue = itemList[i].answer[0].valueString;
              break;
            case valueTypes.URI:
              answerValue = itemList[i].answer[0].valueUri;
              break;
            case valueTypes.QUANTITY:
              answerValue = itemList[i].answer[0].valueQuantity;
            default:
          }
        }
      }
    } else {
      throw new Error('The given questionnaireResponse, linkId or type was null, undefined, 0 or false');
    }
  } catch (error) {
    answerValue = null;
  }
  if (type && type === valueTypes.CODING) {
    return codingValue;
  } else {
    return answerValue;
  }
}
//#endregion

//#region CREATE ITEMLIST
/**
 * Creates a flat List of all Items
 * @param {Object} questionnaire
 */
export function createItemList(object) {
  if (object) {
    let itemList = [];
    getGroupsAndItems(object, itemList);
    return itemList;
  } else {
    throw new Error('Creating an ItemList failed, because the given object was null or undefined');
  }
}
/**
 *
 */
function getGroupsAndItems(varitem, itemList) {
  if (varitem && varitem.item && itemList) {
    for (let i = 0; i < varitem.item.length; i++) {
      if (varitem.item[i].item) {
        itemList.push(varitem.item[i]);
        getGroupsAndItems(varitem.item[i], itemList);
      } else {
        itemList.push(varitem.item[i]);
      }
    }
  } else {
    throw new Error('Getting Groups and Items for the ItemList failed, because the given parameters were null or undefined');
  }
}

//#endregion

//#region GET QUESTIONTYPE FROM Answer IN ITEM

/**
 *Takes the given answers and returns the type
 *
 * @param {Object} answer
 */
export function getAnswerType(answer) {
  if (answer && answer.length !== 0) {
    if (answer[0].valueBoolean || answer[0].valueBoolean === false) {
      return valueTypes.BOOLEAN;
    } else if (answer[0].valueDecimal || answer[0].valueDecimal === 0) {
      return valueTypes.DECIMAL;
    } else if (answer[0].valueInteger || answer[0].valueInteger === 0) {
      return valueTypes.INTEGER;
    } else if (answer[0].valueDate) {
      return valueTypes.DATE;
    } else if (answer[0].valueDateTime) {
      return valueTypes.DATETIME;
    } else if (answer[0].valueTime) {
      return valueTypes.TIME;
    } else if (answer[0].valueString) {
      return valueTypes.STRING;
    } else if (answer[0].valueUri) {
      return valueTypes.URI;
    } else if (answer[0].valueAttachment) {
      return valueTypes.ATTACHMENT;
    } else if (answer[0].valueCoding) {
      return valueTypes.CODING;
    } else if (answer[0].valueQuantity) {
      return valueTypes.QUANTITY;
    } else {
      return 'notype';
    }
  }else if(answer && answer.length === 0){
    return 'notype';
  }else {
    throw new Error('Getting the AnswerType failed because the given answer object was null or undefined');
  }
}

//#endregion

export default {
  createQuestionnaireResponse,
  addAnswersToQuestionnaireResponse,
  getAnswersFromQuestionnaireResponse,
  createItemList,
  getAnswerType,
  removeQuestionnaireResponseDisplayQuestions
};
