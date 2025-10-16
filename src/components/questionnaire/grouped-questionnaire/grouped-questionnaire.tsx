import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import { getLocaleComponentStrings } from '../../../utils/locale';

import { Item } from '../../../utils/questionnaireResponse';

@Component({
  tag: 'grouped-questionnaire',
  styleUrl: 'grouped-questionnaire.css',
  shadow: false,
  scoped: true,
})
export class GroupedQuestionnaire {
  @Element() element: HTMLElement;

  /**
   *  String containing the translations for the current locale
   */
  @State() strings: any;

  @State() count: number = 0;
  @Watch('count')
  watchCount() {
    this.setDisabled();
  }
  @State() filteredList: any;
  @Watch('filteredList')
  watchFilteredList() {
    //TODO Make sure deep changes are noticed
    this.setDisabled();
  }
  @Prop() filteredItemList: Array<any>;
  @Watch('filteredItemList')
  watchFilteredItemList() {
    this.filteredList = this.getFilteredList();
  }

  @Prop() questionnaire!: any;
  @Watch('questionnaire')
  watchQuestionnaire() {
    //validate
    if (this.questionnaire == null) {
      throw new Error('questionnaire: required');
    }
    this.count = 0;
  }
  @Prop() questionnaireResponse: Object = null;
  @Watch('questionnaireResponse')
  watchQuestionnaireResponse() {
    this.setDisabled();
  }
  @Prop() requiredQuestionList: Array<any>;
  @Watch('requiredQuestionList')
  watchRequiredQuestionList() {
    this.setDisabled();
  }
  @Prop() valueSets: Array<any>;
  @Prop() baseUrl: string;
  @Prop() editMode: boolean = false;
  @Watch('editMode')
  watchEditMode() {
    if (this.editMode) {
      this.enablereturn = false;
    } else {
      this.enablereturn = true;
    }
  }
  @Prop() startCount: number;
  @Prop() lastQuestion: boolean = false;
  /**
   * Options for Visual Analog Scale
   */
  @Prop() vasVertical: boolean;
  @Prop() vasShowSelectedValue: boolean;
  @Prop() vasSelectedValueLabel: string;
  /**
   * Primary color
   */
  @Prop() primary: string;
  /**
   * Secondary color
   */
  @Prop() secondary: string;
  /**
   * Color used to symbolise danger
   */
  @Prop() danger: string;
  /**
   * Language property of the component. </br>
   * Currently suported: [de, en, es]
   */
  @Prop() enableReturn: boolean = true;
  @Prop() spinner: any;
  @Prop() locale: string = 'en';
  @Prop() enableInformalLocale: boolean;
  @Prop() enableErrorConsoleLogging: boolean;
  @Watch('locale')
  async watchLocale(newValue: string) {
    this.strings = await getLocaleComponentStrings(this.element, newValue, this.enableInformalLocale);
  }

  scrollToQuestion: boolean = true;
  questionCount: number = 1;
  disabled: boolean = false;
  currentQuestion: Object;
  lastquestion: boolean = false;
  enablereturn: boolean = true;

  /* computed */
  getFilteredList() {
    let newItemList = [];
    let lastMainGroupId = '';
    if (this.questionnaire && this.questionnaire.item && this.questionnaireResponse) {
      for (let i = 0; i < this.filteredItemList.length; i++) {
        if (this.filteredItemList && this.filteredItemList[i].type === 'group' && !this.filteredItemList[i].groupId) {
          lastMainGroupId = this.filteredItemList[i].linkId;
          let group = Item.create();
          group.linkId = this.filteredItemList[i].linkId;
          group.definition = this.filteredItemList[i].definition;
          group.text = this.filteredItemList[i].text;
          group.type = 'group';
          newItemList.push(group);
        } else if (!this.filteredItemList[i].groupId) {
          newItemList.push(this.filteredItemList[i]);
        } else if (this.filteredItemList[i].groupId) {
          let result = newItemList.findIndex(item => item.linkId === lastMainGroupId);
          if (result !== -1 && newItemList[result].item) {
            newItemList[result].item.push(this.filteredItemList[i]);
          }
        }
      }
    }
    return newItemList;
  }

  getQuestionType() {
    return (
      this.getQuestionFromItemList()
        .type.split(/(?=[A-Z])/)
        .join('-')
        .toLowerCase() + '-question'
    );
  }

  getQuestion() {
    return this.getQuestionFromItemList();
  }

  getLastQuestion() {
    return this.lastQuestion;
  }

  /**
   * Returns the total Number of Required Questions
   */
  numberOfRequiredQuestions() {
    let totalNumber = 0;
    for (let i = 0; i < this.filteredList.length; i++) {
      if (this.filteredList[i].required) {
        totalNumber++;
      }
    }
    return totalNumber;
  }

  /**
   * Counts all Questions from ItemList excluding Groups
   */
  numberOfQuestions() {
    return this.filteredList.length;
  }

  /**
   * Checks if not all required Question have been completed
   */
  notAllRequiredQuestionsCompleted() {
    return this.requiredQuestionList.length !== this.numberOfRequiredQuestions();
  }

  /* methods */
  @Event() summary: EventEmitter;
  goToSummary() {
    this.summary.emit('summary');
  }

  /**
   *
   */
  scrollToTop() {
    window.scrollTo(0, 0);
  }

  /**
   * Returns the number of all required questions in the given list
   */
  numberOfRequiredQuestionsInItem(question) {
    let flatList = question.item;
    let totalNumber = 0;
    for (let i = 0; i < flatList.length; i++) {
      if (flatList[i].required) {
        totalNumber++;
      }
    }
    return totalNumber;
  }

  /**
   * Returns the positionnumber of the current question without groups
   */
  getQuestionPositionNumber() {
    let positionnumber = 1;
    for (let i = 0; i < this.count; i++) {
      // if (this.itemList[i].type !== "group") {
      positionnumber++;
      // }
    }
    return positionnumber;
  }

  /**
   * Returns a Question from the itemList
   */
  getQuestionFromItemList() {
    return this.filteredList[this.count];
  }

  /**
   * Counts up the Question-Number
   */
  @Event() finish: EventEmitter;
  countUp() {
    if (this.count < this.filteredList.length - 1 && !this.disabled && !this.editMode) {
      this.count++;
      this.questionCount = this.getQuestionPositionNumber();
      this.scrollToTop();
    } else if (this.count === this.filteredList.length - 1 && !this.disabled && !this.editMode) {
      this.finish.emit('finish');
    } else if (this.startCount !== null && this.editMode) {
      this.finish.emit('finish');
    }
  }

  /**
   * Counts down the Question-Number
   */
  @Event() return: EventEmitter;
  countDown() {
    //If count bigger than 0 and startCount is null
    if (this.count > 0 && !this.editMode) {
      this.count--;
      //update questionPositionNumber
      this.questionCount = this.getQuestionPositionNumber();
      this.scrollToTop();
      //if count = 0 go back to Metadata
    } else if (this.count === 0) {
      this.return.emit('return');
    }
  }

  /**
   *
   */
  setDisabled() {
    this.disabled = false;
    let currentQuestion: any = this.getQuestion();
    let numberOfAnsweredRequiredQuestionsInItem = 0;
    if (currentQuestion) {
      if (currentQuestion.required || (currentQuestion.type === 'group' && this.numberOfRequiredQuestionsInItem(currentQuestion) > 0)) {
        this.disabled = true;
      }
      for (let i = 0; i < this.requiredQuestionList.length; i++) {
        if (currentQuestion.type === 'group') {
          for (let e = 0; e < currentQuestion.item.length; e++) {
            if (this.requiredQuestionList[i].groupId && this.requiredQuestionList[i].groupId === currentQuestion.item[e].groupId) {
              if (currentQuestion.item[e].required) {
                this.disabled = true;
              }
              if (this.requiredQuestionList[i] === currentQuestion.item[e]) {
                this.disabled = false;
                numberOfAnsweredRequiredQuestionsInItem++;
              }
            }
          }
          //TODO check if all questions are answered, else set disabled to true
          if (numberOfAnsweredRequiredQuestionsInItem !== this.numberOfRequiredQuestionsInItem(currentQuestion)) {
            this.disabled = true;
          } else {
            this.disabled = false;
          }
        } else if (this.requiredQuestionList[i] === currentQuestion) {
          this.disabled = false;
        }
      }
    }
  }

  /**
   * Emits an error-event
   */
  @Event() errorLog: EventEmitter;
  emitError(error) {
    this.errorLog.emit(error);
  }

  /* Lifecycle Methods */
  componentDidUpdate() {
    //TODO Is this the correct lifecycle hook?
    if (this.lastquestion && this.filteredList && this.filteredList.length > 0) {
      this.count = this.filteredList.length - 1;
      this.lastquestion = false;
      this.questionCount = this.getQuestionPositionNumber();
    }
    if (this.startCount && this.editMode && this.filteredList && this.filteredList.length > 0) {
      this.count = this.startCount;
      this.questionCount = this.getQuestionPositionNumber();
    }
  }
  async componentWillLoad(): Promise<void> {
    try {
      this.strings = await getLocaleComponentStrings(this.element, this.locale, this.enableInformalLocale);
    } catch (e) {
      if (this.enableErrorConsoleLogging) {
        console.error(e);
      }
      this.emitError(e);
    }
    this.filteredList = this.getFilteredList();
    if (this.startCount && this.filteredList && this.filteredList.length > 0) {
      this.count = this.startCount;
      this.questionCount = this.getQuestionPositionNumber();
    }
    this.lastquestion = this.lastQuestion;
    this.setDisabled();
  }

  render() {
    const Tag = this.getQuestionType();
    return this.questionnaire ? (
      <div class="card">
        
          <div>
            {/* if Questiontype is Group */}
            {this.getQuestionType() === 'group-question' ? (
              <div class="component-container container">
                <Tag
                  question={this.getQuestion()}
                  mode="GROUPS"
                  filteredItemList={this.filteredItemList}
                  questionnaireResponse={this.questionnaireResponse}
                  questionnaire={this.questionnaire}
                  valueSets={this.valueSets}
                  baseUrl={this.baseUrl}
                  primary={this.primary}
                  secondary={this.secondary}
                  danger={this.danger}
                  locale={this.locale}
                  enableInformalLocale={this.enableInformalLocale}
                  enableErrorConsoleLogging={this.enableErrorConsoleLogging}
                  onErrorLog={event => this.emitError(event)}
                ></Tag>
              </div>
            ) : (
              <div class="container">
                <div class="column card card-body">
                  <Tag
                    question={this.getQuestion()}
                    mode="GROUPS"
                    questionnaireResponse={this.questionnaireResponse}
                    questionnaire={this.questionnaire}
                    valueSets={this.valueSets}
                    baseUrl={this.baseUrl}
                    primary={this.primary}
                    secondary={this.secondary}
                    danger={this.danger}
                    locale={this.locale}
                    vasVertical={this.vasVertical}
                    vasShowSelectedValue={this.vasShowSelectedValue}
                    vasSelectedValueLabel={this.vasSelectedValueLabel}
                    enableInformalLocale={this.enableInformalLocale}
                    enableErrorConsoleLogging={this.enableErrorConsoleLogging}
                    onErrorLog={event => this.emitError(event)}
                  ></Tag>
                </div>
              </div>
            )}
            <div class="bottom-container margin-bottom-container">
              {/* <div> <b-progress :max="numberOfQuestions" :value="questionCount"></b-progress> </div> */}
              {this.strings ? (
                <div class="button-container">
                  {/* <!-- Button Back --> */}
                  {(!this.editMode && this.count !== 0) || (!this.editMode && this.enableReturn && this.count === 0) ? (
                    <button type="button" class="btn button btn-outline-primary btn-lg" onClick={() => this.countDown()}>
                      {this.strings.back}
                    </button>
                  ) : null}
                  {this.editMode || (this.count === 0 && !this.enablereturn) ? (
                    <button type="button" class="btn button btn-outline-secondary btn-lg" disabled>
                      {this.strings.back}
                    </button>
                  ) : null}

                  {/* <!-- Progress Counter --> */}
                  <div class="progress-counter large">
                    {this.strings.page} {this.questionCount} {this.strings.of}
                    {this.numberOfQuestions()}
                  </div>
                  <div class="progress-counter small">
                    {this.questionCount} {this.strings.of} {this.numberOfQuestions()}
                  </div>

                  {/* <!-- Button Next --> */}
                  <span>
                    {this.count <= this.filteredList.length - 1 && !this.disabled && !this.editMode ? (
                      <button id="return-button" type="button" class="button button btn-primary btn-lg" onClick={() => this.countUp()}>
                        {this.strings.next}
                      </button>
                    ) : null}
                    {this.disabled ? (
                      <button id="disabed-return-button" type="button" class="button btn-secondary btn-lg" disabled>
                        {this.strings.next}
                      </button>
                    ) : null}
                    {this.editMode && !this.disabled ? (
                      <button id="summary-button" type="button" class="button btn-primary btn-lg" onClick={() => this.goToSummary()}>
                        {this.strings.accept}
                      </button>
                    ) : null}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
      </div>
    ) : null;
  }
}
