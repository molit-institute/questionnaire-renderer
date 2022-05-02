/**
 * This Component adds a Summary and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import { getLocaleComponentStrings } from '../../utils/locale';
import questionnaireResponseController from '../../utils/questionnaireResponseController';
import * as fhirApi from '@molit/fhir-api';
import questionnaireController from '../../utils/questionnaireController';
import { cloneDeep } from 'lodash';

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
  @State() spinner: { [k: string]: any } = {
    loading: false,
    message: '',
  };

  /**
   * FHIR Patient-Resource
   */
  @Prop() subject: Object;
  @Prop() baseUrl: string;
  @Prop() demoMode: Boolean;
  @Prop() task: any;
  @Prop() mode: string;
  @Prop() questionnaire: any = null;
  @Prop() questionnaireResponse: any = null;
  @Prop() summary_text: string;
  @Prop() token: string;
  @Prop() basicAuth: boolean;
  @Prop() editable: boolean;
  @Prop() showSummaryRemarks: boolean;
  @Prop() enableSendQuestionnaireResponse: boolean;
  @Prop() enableInformalLocale: boolean;
  @Prop() trademarkText: string = null;
  /**
   * Language property of the component. </br>
   * Currently suported: [de, en, es]
   */
  @Prop() locale: string = 'en';
  @Watch('locale')
  async watchLocale(newValue: string) {
    this.strings = await getLocaleComponentStrings(this.element, newValue, this.enableInformalLocale);
  }

  /* computed */

  /* methods */

  /**
   * Emits an event to return to the questionnaire renderer
   */
  @Event() toQuestionnaireRenderer: EventEmitter;
  returnToQuestionnaire() {
    this.toQuestionnaireRenderer.emit('returnToQuestionnaire');
  }

  /**
   * Emits an event to return to the questionnaire renderer to edit a question
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

  /**
   * Returns true if question has the type "display"
   * @param linkId
   * @returns
   */
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
   * Returns the Prefix using the given linkId
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

  /**
   * Returns a flat itemList of the given object. This object can either be a questionnaire or a questionnaireResponse
   * @param object
   * @returns
   */
  getItemList(object) {
    return questionnaireResponseController.createItemList(object);
  }

  /**
   * Returns the answer of the given question if it contains any. If question.answer contains no answers
   * @param question
   * @returns
   */
  getAnswer(question) {
    let answer = null;
    if (question.answer) {
      if (this.checkIfDisplay(question.linkId) && question.answer.length === 0 && !question.item && !question.answer[0]) {
        answer = this.strings.summary.noAnswer;
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
              answer = this.strings.summary.noAnswer;
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
    } else {
      answer = this.strings.summary.noAnswer;
      return answer;
    }
  }

  /**
   *
   * @param item
   * @returns
   */
  getGroupDisplayQuestionsFromQuestionnaire(item) {
    let displays = [];
    let itemList = questionnaireResponseController.createItemList(this.questionnaire);
    for (let i = 0; i < itemList.length; i++) {
      if (itemList && itemList[i].linkId === item.linkId) {
        displays = itemList[i].displays;
      }
    }
    return displays;
  }

  /**
   * Returns the count of all questions that contain answers
   * @returns
   */
  countAnsweredQuestions() {
    let itemList = questionnaireResponseController.createItemList(this.questionnaireResponse);
    let number = 0;
    for (let i = 0; i < itemList.length; i++) {
      if (itemList[i].type !== 'group') {
        if (itemList[i].answer && itemList[i].answer.length !== 0) {
          number++;
        }
      }
    }
    return number;
  }

  /**
   * Adds answers with type display to the questionnaireResponse
   */
  async addDisplaysToQuestionnaireResponse(){
    let itemList = this.questionnaire.item;
    let questRespList = this.questionnaireResponse.item
    for(let i=0;i < itemList.length; i++ ){
      if(itemList[i].type === "display"){
        let idBefore = itemList[i-1].linkId
        await questRespList.reduceRight((_acc,answer,index,object) => {
          if(answer.linkId===idBefore){
            object.splice(index+1,0,{linkId:itemList[i].linkId,text:itemList[i].text,answer:[],type:"display"})
          }
        }, []);
      }
    }
  }

  @Event() finishQuestionnaire: EventEmitter;
  @Event() finishTask: EventEmitter;
  @Event() error: EventEmitter;
  async completeQuestionnaireResponse() {
    if (this.questionnaireResponse) {
      this.spinner = { ...this.spinner, loading: true };
      this.spinner = { ...this.spinner, message: this.strings.summary.saveQuestionnaire };
      this.questionnaireResponse.status = 'completed';
      let questResp = cloneDeep(this.questionnaireResponse);
      let task = this.task;

      questionnaireResponseController.removeQuestionnaireResponseDisplayQuestions(questResp.item);
      
      // Handle QuestionnaireResponse
      if (this.baseUrl && this.enableSendQuestionnaireResponse) {
        try {
          let output = await fhirApi.submitResource(this.baseUrl, questResp, this.token, this.basicAuth);
          console.info('Questionnaire Response ID: ' + output.data.id, 'Url: ' + output.config.url + '/' + output.data.id);
        } catch (e) {
          this.error.emit(e);
        }
      }
      // Handle Task
      if (this.task) {
        task.executionPeriod.end = new Date().toISOString();
        task.status = 'completed';
        this.finishTask.emit(task);
        if (this.baseUrl) {
          try {
            await fhirApi.updateResource(this.baseUrl, task, this.token, this.basicAuth);
          } catch (e) {
            this.error.emit(e);
          }
        }
      }
      setTimeout(() => {
        this.spinner = { ...this.spinner, loading: false };
      }, 250);
      this.finishQuestionnaire.emit('finishQuestionnaire');
    }
  }

  @Event() addRemarks: EventEmitter;
  addAdditionalRemarks() {
    this.addRemarks.emit('addRemarks');
  }

  @Event() closeSummary: EventEmitter;
  buttonOkSummary() {
    this.closeSummary.emit('closeSummary');
  }

  checkIfGroupQuestion(item){
    console.log(this.questionnaire)
    let list = questionnaireResponseController.createItemList(this.questionnaire)
    for(let i = 0; i < list.length;i++){
      if(item.linkId === list[i].linkId){
        if(list[i].groupId){
          return true;
        }else{
          return false;
        }
      }
    }
    return false;
  }
  /* Lifecycle Methods */

  async componentWillLoad(): Promise<void> {
    try {
      this.strings = await getLocaleComponentStrings(this.element, this.locale, this.enableInformalLocale);
      this.addDisplaysToQuestionnaireResponse();
      // this.itemList = questionnaireResponseController.createItemList(this.questionnaireResponse);
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <div class="qr-summary-container">
        <div class="qr-summary-title">{this.editable ? <div>{this.strings.summary.title}</div> : <div>{this.questionnaire.title}</div>}</div>

        <div class="qr-summary-content">
          <div class="qr-summary-answeredQuestions">
            {this.strings.summary.youHave} {this.countAnsweredQuestions()} {this.strings.of} {questionnaireController.getNumberOfQuestions(this.questionnaireResponse, null)} {this.strings.summary.questionsAnswered}
          </div>
          <div class="qr-summary-information">{this.summary_text}</div>
          {this.spinner.loading ? (
            <div class="card card-basic-margins qr-summary-card">
              <div class="card-body">
                <simple-spinner message={this.spinner.message} class="qr-summary-spinner"></simple-spinner>
              </div>
            </div>
          ) : (
            <div>
              <div class="qr-summary-items">
                {this.getItemList(this.questionnaireResponse).map(item =>
                  item.hasOwnProperty('extension') ? null : (
                    <div class={!this.checkIfGroupQuestion(item) ? 'qr-summary-item ' : 'qr-summary-group-item'}>
                      <div class="qr-summary-item-prefix">
                        {!item.item ? this.strings.question : this.strings.group} {this.getPrefix(item.linkId)}{' '}
                      </div>
                      <div class="qr-summary-item-text">{item.text}</div>
                      {item && item.item ? (
                        <div class="qr-summary-group-container">
                          {this.getGroupDisplayQuestionsFromQuestionnaire(item).map(display => {
                            return <display-question class="qr-groupQuestion-display-text" question={display} locale={this.locale} enableInformalLocale={this.enableInformalLocale}></display-question>;
                          })}
                        </div>
                      ) : null}
                      <div>
                        {item && !item.item && item.type !== 'display' ? (
                          <div>
                            <span class="qr-summary-item-yourAnswer">{this.strings.summary.yourAnswer}:&nbsp;</span>
                            <span class="qr-summary-item-answer">{this.getAnswer(item)} &nbsp;</span>

                            {this.editable && item.type !== 'group'  ? (
                              <span style={{ cursor: 'pointer' }} class="qr-summary-item-editIcon" onClick={() => this.editSelectedQuestion(item)}>
                                <svg class="material-design-icon__svg" style={{ width: '30px', height: '30px' }} viewBox="0 0 24 24">
                                  <path fill="#000000" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"></path>
                                </svg>
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                      <hr />
                    </div>
                  ),
                )}
              </div>
              {this.showSummaryRemarks ? (
                <div class="qr-summary-remarks" onClick={() => this.addAdditionalRemarks()}>
                  <div class="qr-summary-remarks-title">{this.strings.summary.remarks}</div>
                  <div class="qr-summary-remarks-content">
                    <span class="qr-summary-remarks-text">{this.strings.summary.remarksText}</span>
                    <span class="qr-summary-remarks-icon">
                      <svg class="material-design-icon__svg " style={{ width: '30px', height: '30px' }} viewBox="0 0 24 24">
                        <path
                          fill="#000000"
                          d="M6 2C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H10V20.1L20 10.1V8L14 2H6M13 3.5L18.5 9H13V3.5M20.1 13C20 13 19.8 13.1 19.7 13.2L18.7 14.2L20.8 16.3L21.8 15.3C22 15.1 22 14.7 21.8 14.5L20.5 13.2C20.4 13.1 20.3 13 20.1 13M18.1 14.8L12 20.9V23H14.1L20.2 16.9L18.1 14.8Z"
                        ></path>
                      </svg>
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
        <div class="qr-summary-buttonContainer">
          {this.editable ? (
            <div class="qr-summary-buttons">
              <button type="button" class="btn button btn-outline-primary btn-lg qr-button-outline-primary" onClick={() => this.returnToQuestionnaire()}>
                {this.strings.back}
              </button>
              <button type="button" class="btn button btn-primary btn-lg qr-button-primary" onClick={() => this.completeQuestionnaireResponse()}>
                {this.strings.summary.saveQuestionnaire}
              </button>
            </div>
          ) : (
            <div class="qr-summary-ok-button">
              <button type="button" class="btn button btn-primary btn-lg qr-button-primary qr-summary-ok-button" onClick={() => this.buttonOkSummary()}>
                Ok
              </button>
            </div>
          )}
        </div>
        {this.trademarkText ? <div class="qr-summary-trademark">{this.trademarkText}</div> : null}
      </div>
    );
  }
}
