import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import { getLocaleComponentStrings } from '../../../utils/locale';

@Component({
  tag: 'full-questionnaire',
  styleUrl: 'full-questionnaire.css',
  shadow: false,
  scoped: true,
})
export class FullQuestionnaire {
  @Element() element: HTMLElement;

  /**
   *  String containing the translations for the current locale
   */
  @State() strings: any;
  @Prop() variant: any = null;
  @Prop() filteredItemList: Array<any>;
  @Prop() questionnaire!: any;
  @Watch('questionnaire')
  validateQuestionnaire() {
    if (this.questionnaire == null) {
      throw new Error('questionnaire: required');
    }
  }
  @Prop() questionnaireResponse: Object = null;
  @Prop() requiredQuestionList: Array<any>;
  @Prop() valueSets: Array<any>;
  @Prop() baseUrl: string;
  @Prop() startCount: number;
  @Prop() enableInformalLocale: boolean;
  /**
   * Options for Visual Analog Scale
   */
  @Prop() vasVertical: boolean;
  @Prop() vasShowSelectedValue: boolean;
  @Prop() vasSelectedValueLabel: string;
  @Prop() enableFinishButton: boolean;
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
  @Prop() spinner: any;
  @Prop() locale: string = 'en';
  @Prop() enableErrorConsoleLogging: boolean;
  @Watch('locale')
  async watchLocale(newValue: string) {
    this.strings = await getLocaleComponentStrings(this.element, newValue, this.enableInformalLocale);
  }

  @Prop() enableReturn: boolean = true;
  @Prop() enableNext: boolean = true;
  @Prop() visibleBooleanNullOption: boolean;
  disabled: boolean = true;
  scrollToQuestion: boolean = true;

  @Event() finish: EventEmitter;

  /* computed */
  questionsList() {
    return this.filteredItemList.filter(question => question.type !== 'group');
  }
  /**
   * Returns the total Number of Required Questions
   */
  numberOfRequiredQuestions() {
    let totalNumber = 0;
    if (this.filteredItemList) {
      for (let i = 0; i < this.filteredItemList.length; i++) {
        if (this.filteredItemList[i].required && this.filteredItemList[i].type !== 'group') {
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

  /* methods */
  getGroupText(currentQuestion) {
    let groupQuestion = this.filteredItemList.find(element => element.linkId === currentQuestion.groupId);
    if (groupQuestion) {
      return groupQuestion.text;
    } else {
      return '';
    }
  }

  @Event() summary: EventEmitter;
  goToSummary() {
    this.summary.emit('summary');
  }

  @Event() return: EventEmitter;
  backToQuestionnaireList() {
    this.return.emit('return');
  }

  /**
   * returns the position number of the given question
   */
  getQuestionIndex(question) {
    return this.questionsList().indexOf(question);
  }

  /**
   * Emits an error-event
   */
  @Event() errorLog: EventEmitter;
  emitError(error) {
    this.errorLog.emit(error);
  }

  /**
   * Returns the Type of the current Question
   */
  getQuestionType(type) {
    return (
      type
        .split(/(?=[A-Z])/)
        .join('-')
        .toLowerCase() + '-question'
    );
  }

  /* Lifecycle Methods */
  componentDidUpdate() {
    //TODO Is this the correct lifecycle hook?
    if (this.startCount && this.scrollToQuestion) {
      this.scrollToQuestion = false;
      var elmnt = document.getElementById(this.startCount.toString());
      elmnt.scrollIntoView();
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
  }

  render() {
    return this.questionnaire ? (
      <div class="qr-fullQuestionnaire-container">
        {/* SPINNER */}
        {this.spinner.loading ? (
          <div class="card card-basic-margins qr-fullQuestionnaire-spinner">
            <div class="card-body">
              <simple-spinner message={this.spinner.message}></simple-spinner>
            </div>
          </div>
        ) : (
          <div>
            <transition-group name="list-complete" tag="p">
              {this.filteredItemList.map((question, index) => {
                const Tag = this.getQuestionType(question.type);

                return (
                  <span class="list-complete-item">
                    <div id={index.toString()} class={question.groupId ? 'card card-basic-margins qr-group-item' : 'card card-basic-margins'}>
                      {this.strings ? (
                        <div class="card-body">
                          {question.type !== 'group' && this.variant !== 'form' && this.variant !== 'compact' ? (
                            <div class="qr-fullQuestionnaire-progress-counter">
                              <span class="qr-fullQuestionnaire-questionIndex">
                                {this.strings.question} {this.getQuestionIndex(question) + 1}
                              </span>{' '}
                              <span class="qr-fullQuestionnaire-numberOfQuestions">
                                {this.strings.of} {this.questionsList().length}
                              </span>
                            </div>
                          ) : null}
                          {question.groupId && !question.item ? <div class="question-group-text">{this.getGroupText(question)}</div> : null}
                          <Tag
                            question={question}
                            questionnaireResponse={this.questionnaireResponse}
                            questionnaire={this.questionnaire}
                            valueSets={this.valueSets}
                            baseUrl={this.baseUrl}
                            primary={this.primary}
                            secondary={this.secondary}
                            danger={this.danger}
                            locale={this.locale}
                            variant={this.variant}
                            vasVertical={this.vasVertical}
                            vasShowSelectedValue={this.vasShowSelectedValue}
                            vasSelectedValueLabel={this.vasSelectedValueLabel}
                            enableInformalLocale={this.enableInformalLocale}
                            enableErrorConsoleLogging={this.enableErrorConsoleLogging}
                            visibleBooleanNullOption={this.visibleBooleanNullOption}
                            onErrorLog={event => this.emitError(event)}
                          ></Tag>
                        </div>
                      ) : null}
                    </div>
                  </span>
                );
              })}
            </transition-group>
            {/* BUTTONS */}
            <div class="card-margin-bottom ">
              {this.strings ? (
                <div class="qr-fullQuestionnaire-buttonContainer">
                  {this.enableReturn ? (
                    <button id="returnButton" type="button" class="btn button btn-outline-primary btn-lg qr-button-outline-primary qr-fullQuestionnaire-button-back" onClick={() => this.backToQuestionnaireList()}>
                      {this.strings.back}
                    </button>
                  ) : null}
                  {this.enableNext && !this.enableFinishButton ? (
                    <button
                      id="toSummaryNextButton"
                      type="button"
                      class="btn button btn-primary btn-lg qr-button-primary qr-fullQuestionnaire-button-next"
                      disabled={this.notAllRequiredQuestionsCompleted()}
                      onClick={() => this.goToSummary()}
                    >
                      {this.strings.next}
                    </button>
                  ) : null}
                  {this.enableNext && this.enableFinishButton ? (
                    <button
                      id="toSummaryFinishButton"
                      type="button"
                      class="btn button btn-primary btn-lg qr-button-primary qr-fullQuestionnaire-button-finish"
                      disabled={this.notAllRequiredQuestionsCompleted()}
                      onClick={() => this.goToSummary()}
                    >
                      {this.strings.finish}
                    </button>
                  ) : null}
                  {!this.enableNext && this.enableFinishButton ? (
                    <button
                      id="finishButton"
                      type="button"
                      class="btn button btn-primary btn-lg qr-button-primary qr-fullQuestionnaire-button-finish"
                      disabled={this.notAllRequiredQuestionsCompleted()}
                      onClick={() => this.finish.emit('finish')}
                    >
                      {this.strings.finish}
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    ) : null;
  }
}
