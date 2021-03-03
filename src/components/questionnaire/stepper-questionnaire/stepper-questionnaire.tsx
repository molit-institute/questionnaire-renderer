import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import { getLocaleComponentStrings } from '../../../utils/locale';

@Component({
  tag: 'stepper-questionnaire',
  styleUrl: 'stepper-questionnaire.css',
  shadow: false,
  scoped: true,
})
export class StepperQuestionnaire {
  @Element() element: HTMLElement;

  /**
   *  String containing the translations for the current locale
   */
  @State() strings: any;
  /**
   * Number representing the index in the questions-list
   */
  @State() count: number = 0;
  @Watch('count')
  watchCount() {
    this.setDisabled();
  }

  @Prop() filteredItemList: Array<any>;
  @Watch('filteredItemList')
  watchFilteredList() {
    //TODO Make sure deep changes are noticed
    if (this.filteredItemList[this.count].type !== 'group' && this.count === 0) {
      // this.questionCount = 1;
      this.questionCount = this.getQuestionPositionNumber();
    }
    this.setDisabled();
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
  @Watch('locale')
  async watchLocale(newValue: string) {
    this.strings = await getLocaleComponentStrings(this.element, newValue);
  }

  /**
   * Number for visual count-representation
   */
  questionCount: number = 1;
  /**
   * If true disables the next-button
   */
  disabled: boolean = false;
  lastquestion: boolean = false;
  /**
   * If true enables the return button
   */
  enablereturn: boolean = true;

  /* computed */
  /**
   * Returns the Type of the current Question
   */
  getQuestionType() {
    let type = null;
    if (this.getQuestionFromItemList()) {
      type = this.getQuestionFromItemList().type.split(/(?=[A-Z])/).join("-").toLowerCase() + '-question';
    }
    return type;
  }

  /**
   *Returns the current Question
   */
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
    if (this.filteredItemList) {
      for (let i = 0; i < this.filteredItemList.length; i++) {
        if (this.filteredItemList[i].required) {
          totalNumber++;
        }
      }
    }
    return totalNumber;
  }

  /**
   * Checks if not all required Question have been completed
   */
  notAllRequiredQuestionsCompleted() {
    return this.requiredQuestionList.length !== this.numberOfRequiredQuestions();
  }

  /**
   * Counts all Questions from ItemList excluding Groups
   */
  numberOfQuestions() {
    let number = 0;
    for (let i = 0; i < this.filteredItemList.length; i++) {
      if (this.filteredItemList[i].type !== 'group') {
        number++;
      }
    }
    return number;
  }

  /* methods */
  getGroupText(currentQuestion) {
    let groupQuestion = this.filteredItemList.find(element => element.linkId === currentQuestion.groupId);
    if (groupQuestion) {
      return groupQuestion.text;
    } else {
      return '';
    }
  }

  @Event() summery: EventEmitter;
  goToSummary() {
    this.summery.emit('summary');
  }

  /**
   * Returns a Question from the itemList
   */
  getQuestionFromItemList() {
    return this.filteredItemList[this.count];
  }

  /**
   * Returns the positionnumber of the current question without groups
   */
  getQuestionPositionNumber() {
    let positionnumber = 1;
    for (let i = 0; i < this.count; i++) {
      if (this.filteredItemList[i].type !== 'group') {
        positionnumber++;
      }
    }
    return positionnumber;
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  /**
   * Counts up the Question-Number
   */
  @Event() finish: EventEmitter;
  countUp() {
    if (this.count < this.filteredItemList.length - 1 && !this.disabled && !this.editMode) {
      //next button
      this.count++;
      if (this.filteredItemList[this.count].type !== 'group') {
        this.questionCount = this.getQuestionPositionNumber();
      }
      this.scrollToTop();
    } else if (this.count === this.filteredItemList.length - 1 && !this.disabled && !this.editMode) {
      this.finish.emit('finish');
    } else if (this.startCount !== null && this.editMode) {
      this.finish.emit('finish');
    }
  }

  /**
   * Counts down the Question-Number
   */
  @Event() back: EventEmitter;
  countDown() {
    //If count bigger than 0 and startCount is null
    if (this.count > 0 && !this.editMode) {
      this.count--;
      //update questionPositionNumber
      if (this.filteredItemList[this.count].type !== 'group') {
        this.questionCount = this.getQuestionPositionNumber();
      } else if (this.filteredItemList[this.count].type === 'group' && this.questionCount === 1) {
        this.questionCount = 0;
      }
      this.scrollToTop();
      //if count = 0 go back to Metadata
    } else if (this.count === 0) {
      this.back.emit('return');
    }
  }

  setDisabled() {
    //Set questionCount to 1 if first Question is not a group
    if (this.filteredItemList) {
      if (this.filteredItemList[this.count] && this.filteredItemList[this.count].type !== 'group' && this.count === 0) {
        this.questionCount = 1;
      }
      this.disabled = false;
      let currentQuestion: any = this.getQuestion();
      if (currentQuestion && currentQuestion.required) {
        this.disabled = true;
        for (let i = 0; i < this.requiredQuestionList.length; i++) {
          if (
            // this.requiredQuestionList[i] === currentQuestion
            JSON.stringify(this.requiredQuestionList[i]) === JSON.stringify(currentQuestion)
          ) {
            this.disabled = false;
          }
        }
      }
    }
  }

  /* Lifecycle Methods */
  componentDidUpdate() {
    //TODO Is this the correct lifecycle hook?
    if (this.lastquestion && this.filteredItemList && this.filteredItemList.length > 0) {
      this.count = this.filteredItemList.length - 1;
      this.lastquestion = false;
      this.questionCount = this.getQuestionPositionNumber();
    }
    if (this.startCount && this.editMode && this.filteredItemList && this.filteredItemList.length > 0) {
      this.count = this.startCount;
      this.questionCount = this.getQuestionPositionNumber();
    }
  }

  async componentWillLoad(): Promise<void> {
    try {
      this.strings = await getLocaleComponentStrings(this.element, this.locale);
    } catch (e) {
      console.error(e);
    }
    //sets count if startcount was given from the summarypage through the questionnaire.view
    if (this.startCount && this.filteredItemList && this.filteredItemList.length > 0) {
      this.count = this.startCount;
      this.questionCount = this.getQuestionPositionNumber();
    } else if (this.lastquestion === true && this.filteredItemList && this.filteredItemList.length > 0) {
      this.count = this.filteredItemList.length - 1;
      this.lastquestion = false;
      this.questionCount = this.getQuestionPositionNumber();
    }
    this.lastquestion = this.lastQuestion;
    this.setDisabled();
  }

  render() {
    const Tag = this.getQuestionType();
    return (
      <div class="card">
        <div class="column card-body">
          {/* SPINNER */}
          {this.spinner.loading && this.filteredItemList && this.count !== null ? (
            <div class="center-vertical">
              <simple-spinner message={this.spinner.message}></simple-spinner>
            </div>
          ) : null}
          {!this.spinner.loading ? (
            <div>
              {/* PROGRESS */}
              <div class="progress">
                <div class="progress-bar" role="progressbar" aria-valuenow={this.questionCount} aria-valuemin="1" aria-valuemax={this.numberOfQuestions()} style={{ width: (this.questionCount / this.numberOfQuestions()) * 100 + '%' }}></div>
              </div>
              {/* Progress Counter */}
              {this.strings ? (
                <div class="progress-counter title">
                  <span style={{ color: this.primary }}>
                    {this.strings.question} {this.questionCount}
                  </span>
                  <span class="color-grey">
                    {this.strings.of} {this.numberOfQuestions()}
                  </span>
                </div>
              ) : null}
              {this.getQuestion().groupId && !this.getQuestion().item ? <div class="question-group-text">{this.getGroupText(this.getQuestion())}</div> : null}
            </div>
          ) : null}
          <br />
          {!this.spinner.loading && this.count !== null && this.filteredItemList ? (
            <div>
              <Tag
                key={this.getQuestion().id}
                question={this.getQuestion()}
                mode="STEPPER"
                questionnaireResponse={this.questionnaireResponse}
                questionnaire={this.questionnaire}
                valueSets={this.valueSets}
                baseUrl={this.baseUrl}
                primary={this.primary}
                secondary={this.secondary}
                danger={this.danger}
                locale={this.locale}
                onEmitNext={() => this.countUp()}
              ></Tag>
            </div>
          ) : null}
          {!this.spinner.loading ? <div class="spacer"></div> : null}
          {!this.spinner.loading && this.strings ? (
            <div class="button-container">
              {/* Button Back */}
              {(!this.editMode && this.count !== 0) || (!this.editMode && this.enableReturn && this.count === 0) ? (
                <button type="button" class="btn button btn-outline-primary btn-lg" onClick={() => this.countDown()}>
                  {this.strings.back}
                </button>
              ) : null}
              {this.editMode || (this.count === 0 && !this.enableReturn) ? (
                <button type="button" class="btn button btn-outline-secondary btn-lg" disabled>
                  {this.strings.back}
                </button>
              ) : null}

              {/* Button Next */}
              <span>
                {this.count <= this.filteredItemList.length - 1 && !this.disabled && !this.editMode ? (
                  <button id="next-button" type="button" class="button btn-primary btn-lg" onClick={() => this.countUp()}>
                    {this.strings.next}
                  </button>
                ) : null}
                {this.count < this.filteredItemList.length && this.disabled ? (
                  <button id="disabled-next-button" type="button" class="button btn-secondary btn-lg" disabled>
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
    );
  }
}
