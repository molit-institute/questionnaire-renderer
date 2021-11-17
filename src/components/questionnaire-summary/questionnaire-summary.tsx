/**
 * This Component adds a Summary and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
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
   *
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
   * Returns the answer of of the given question if it contains any. If question.asnwer contains no answers
   * @param question
   * @returns
   */
  getAnswer(question) {
    let answer = null;
    if (!this.checkIfDisplay(question.linkId) && question.answer.length === 0 && !question.item && !question.answer[0]) {
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

  @Event() finishQuestionnaire: EventEmitter;
  @Event() finishTask: EventEmitter;
  @Event() error: EventEmitter;
  async completeQuestionnaireResponse() {
    if (this.questionnaireResponse) {
      this.spinner = { ...this.spinner, loading: true };
      this.spinner = { ...this.spinner, message: this.strings.summary.saveQuestionnaire };
      let questResp = this.questionnaireResponse;
      let task = this.task;

      questResp.status = 'completed';
      // Handle QuestionnaireResponse
      if (this.baseUrl) {
        try {
          console.log('SummaryPage', this.baseUrl, questResp, this.token, this.basicAuth);
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
      <div class="qr-summary-container">
        <div class="qr-summary-title">{this.editable ? <div>{this.strings.summary.title}</div> : <div>{this.questionnaire.title}</div>}</div>

        <div class="qr-summary-content">
          <div class="qr-summary-answeredQuestions">
            {this.strings.summary.youHave} {this.countAnsweredQuestions()} {this.strings.of} {this.numberOfQuestions()} {this.strings.summary.questionsAnswered}
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
                  item.hasOwnProperty('extension') && item.type === 'display' ? null : (
                    <div class="qr-summary-item">
                      <div class="qr-summary-item-prefix">
                        {!item.item ? this.strings.question : this.strings.group} {this.getPrefix(item.linkId)}{' '}
                      </div>
                      <div class="qr-summary-item-text">{item.text}</div>
                      <div>
                        {item && !item.item ? (
                          <div>
                            <span class="qr-summary-item-yourAnswer">{this.strings.summary.yourAnswer}:&nbsp;</span>
                            <span class="qr-summary-item-answer">{this.getAnswer(item)} &nbsp;</span>

                            {this.editable ? (
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
            </div>
          )}
        </div>
        <div class="qr-summary-buttonContainer">
          <button type="button" class="btn button btn-outline-primary btn-lg qr-button-outline-primary" onClick={() => this.returnToQuestionnaire()}>
            {this.strings.back}
          </button>
          <button type="button" class="btn button btn-primary btn-lg qr-button-primary" onClick={() => this.completeQuestionnaireResponse()}>
            {this.strings.summary.saveQuestionnaire}
          </button>
        </div>
      </div>
    );
  }
}
