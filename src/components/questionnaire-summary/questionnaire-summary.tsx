/**
 * This Component adds a Summary and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter, getAssetPath } from '@stencil/core';
import { getLocaleComponentStrings } from '../../utils/locale';
import questionnaireResponseController from '../../utils/questionnaireResponseController';
import * as fhirApi from '@molit/fhir-api';

@Component({
  tag: 'questionnaire-summary',
  styleUrl: 'questionnaire-summary.css',
  shadow: false,
  scoped: true,
  assetsDirs: ['assets'],
})
export class QuestionnaireSummary {
  @Element() element: HTMLElement;
  /**
   *  String containing the translations for the current locale
   */
  @State() strings: any;
  @State() spinner: any = {
    loading: false,
    message: '',
  };
  /**
   * Variable to store the value of the input
   */

  /**
   * FHIR Patient-Resource
   */
  @Prop() subject: Object;
  @Prop() baseUrl: string;
  @Prop() demoMode: Boolean;
  @Prop() task: any;
  @Prop() mode: string;
  @Prop() questionnaire: Object = null;
  @Prop() questionnaireResponse: any = null;
  @Prop() summary_text: string;
  // @Watch('questionnaireResponse')
  // async watchQuestionnaireResponse() {
  //   this.allow_events = false;
  //   this.allow_events = true;
  // }

  /**
   * Language property of the component. </br>
   * Currently suported: [de, en, es]
   */
  @Prop() locale: string = 'en';
  @Watch('locale')
  async watchLocale(newValue: string) {
    this.strings = await getLocaleComponentStrings(this.element, newValue);
  }

  /* computed */

  /* methods */
  /**
   *
   */
  @Event() toQuestionnaireRenderer: EventEmitter;
  returnToQuestionnaire() {
    this.toQuestionnaireRenderer.emit('returnToQuestionnaire');
  }

  /**
   *
   */
  @Event() editQuestion: EventEmitter;
  editSelectedQuestion(question) {
    this.editQuestion.emit(question);
  }

  /**
   *
   * @param {Object} answersList
   */
  formatChoice(answersList) {
    let answer = '';
    answer = answersList[0].valueCoding.display;
    for (let i = 1; i < answersList.length; i++) {
      answer = answer + ', ' + answersList[i].valueCoding.display;
    }
    return answer;
  }
  /**
   *
   */
  getType(question) {
    return questionnaireResponseController.getAnswerType(question.answer);
  }
  /**
   *
   */
  formatDateTime(dateTime) {
    if (dateTime) {
      // return this.$d(new Date(dateTime), "long");
    }
  }
  checkIfDisplay(linkId) {
    let questionnaireItemList = questionnaireResponseController.createItemList(this.questionnaire);
    for (let i = 0; i < questionnaireItemList.length; i++) {
      if (linkId === questionnaireItemList[i].linkId && questionnaireItemList[i].type === 'display') {
        return true;
      }
    }
    return false;
  }
  /**
   *
   */
  getPrefix(linkId) {
    let questionnaireItemList = questionnaireResponseController.createItemList(this.questionnaire);
    for (let i = 0; i < questionnaireItemList.length; i++) {
      if (linkId === questionnaireItemList[i].linkId) {
        return questionnaireItemList[i].prefix;
      }
    }
    return '';
  }

  getItemList(object) {
    return questionnaireResponseController.createItemList(object);
  }

  getAnswer(question) {
    let answer = null;
    if (!this.checkIfDisplay(question.linkId) && question.answer.length === 0 && !question.item && !question.answer[0]) {
      answer = this.strings.noAnswer;
      return answer;
    } else {
      switch (this.getType(question)) {
        case 'boolean':
          if (question.answer[0].valueBoolean === true) {
            answer = this.strings.yes;
          } else if (question.answer[0].valueBoolean === false) {
            answer = this.strings.no;
          }
          break;
        case 'decimal':
          answer = question.answer[0].valueDecimal;
          break;
        case 'integer':
          answer = question.answer[0].valueInteger;
          break;
        case 'date':
          answer = question.answer[0].valueDate;
          break;
        case 'dateTime':
          answer = question.answer[0].valueDateTime;
          break;
        case 'time':
          answer = question.answer[0].valueTime;
          break;
        case 'string':
          answer = question.answer[0].valueString;
          break;
        case 'url':
          if (question.answer[0].valueUri !== '') {
            answer = question.answer[0].valueUri;
          } else {
            answer = this.strings.noAnswer;
          }
          break;
        case 'attachment':
          answer = question.answer[0].valueAttachment;
          break;
        case 'coding':
          answer = this.formatChoice(question.answer);
          break;
        case 'quantity':
          answer = question.answer[0].valueQuantity;
          break;

        default:
          break;
      }
      return answer;
    }
  }

  /**
   * Counts all Questions from ItemList excluding Groups
   */
   numberOfQuestions() {
    let itemList = questionnaireResponseController.createItemList(this.questionnaireResponse);
    let number = 0;
    for (let i = 0; i < itemList.length; i++) {
      if (itemList[i].type !== 'group' && !itemList[i].item) {
        number++;
      }
    }
    return number;
  }

  countAnsweredQuestions(){
    let itemList = questionnaireResponseController.createItemList(this.questionnaireResponse);
    let number = 0;
    for (let i = 0; i< itemList.length; i++){
      if (itemList[i].type !== 'group') {
        if(itemList[i].answer && itemList[i].answer.length !== 0){
          number++;
        }
      }
    }
    return number;
  }

  @Event() finishQuestionnaire: EventEmitter;
  @Event() finishTask: EventEmitter;
  async completeQuestionnaireResponse() {
    if (this.questionnaireResponse) {
      this.spinner.loading =true;
      let questResp = this.questionnaireResponse;
      let task = this.task;

      questResp.status = 'completed';
      // Handle QuestionnaireResponse
      if (this.baseUrl) {
        try {
          // let output = await fhirApi.submitResource(this.baseUrl, questResp);
        } catch (error) {}
      }
      // Handle Task
      if (this.task) {
        task.executionPeriod.end = new Date().toISOString();
        task.status = 'completed';
        this.finishTask.emit(task);
        if (this.baseUrl) {
          try {
            // await fhirApi.updateResource(this.baseUrl, task);
          } catch (error) {}
        }
      }
      this.spinner.loading = false;
      this.finishQuestionnaire.emit('finishQuestionnaire');
    }
  }
  /* Lifecycle Methods */

  async componentWillLoad(): Promise<void> {
    try {
      this.strings = await getLocaleComponentStrings(this.element, this.locale);
      // this.itemList = questionnaireResponseController.createItemList(this.questionnaireResponse);
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <div>
        <div></div>
        <div>{this.strings.summary}</div>
        <div>{this.countAnsweredQuestions()} von {this.numberOfQuestions()}</div>
        <div>{this.summary_text}</div>
        {this.spinner.loading ? (
          <div class="card card-basic-margins">
            <div class="card-body">
              <simple-spinner message={this.spinner.message}></simple-spinner>
            </div>
          </div>
        ) : (
          <div>
            <div>
              {this.getItemList(this.questionnaireResponse).map(item =>
                item.hasOwnProperty('extension') && item.type === 'display' ? null : (
                  <div>
                    <div>
                      {!item.item ? this.strings.question : this.strings.group} {this.getPrefix(item.linkId)}{' '}
                    </div>
                    <div>{item.text}</div>
                    <div>
                      {item && !item.item ? (
                        <div>
                          {this.strings.yourAnswer}:&nbsp;
                          {this.getAnswer(item)} &nbsp;
                          <span style={{ cursor: 'pointer' }} onClick={() => this.editSelectedQuestion(item)}>
                            <img src={getAssetPath('./../assets/icons/pencil.svg')} />
                          </span>
                        </div>
                      ) : null}
                    </div>
                    <hr />
                  </div>
                ),
              )}
            </div>
            <button onClick={() => this.returnToQuestionnaire()}>{this.strings.back}</button>
            <button onClick={() => this.completeQuestionnaireResponse()}>Fragebogen speichern</button>
          </div>
        )}
      </div>
    );
  }
}
