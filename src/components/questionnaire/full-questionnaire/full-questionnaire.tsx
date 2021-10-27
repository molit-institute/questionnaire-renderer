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
  @Watch('locale')
  async watchLocale(newValue: string) {
    this.strings = await getLocaleComponentStrings(this.element, newValue);
  }

  @Prop() enableReturn: boolean = true;
  @Prop() enableNext: boolean = true;
  disabled: boolean = true;
  scrollToQuestion: boolean = true;

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
      this.strings = await getLocaleComponentStrings(this.element, this.locale);
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return this.questionnaire ? (
      <div>
        {/* SPINNER */}
        {this.spinner.loading ? (
          <div class="card card-basic-margins">
            <div class="card-body">
              <simple-spinner message={this.spinner.message}></simple-spinner>
            </div>
          </div>
        ) : (
          <div>
            <transition-group name="list-complete" tag="p">
              {this.filteredItemList.map((question, index) => {
                const Tag = question.type + '-question';
                return (
                  <span class="list-complete-item">
                    <div id={index.toString()} class="card card-basic-margins">
                      {this.strings ? (
                        <div class="card-body">
                          {question.type !== 'group' && this.variant !== "form" && this.variant !== "compact" ? (
                            <div>
                              {this.strings.question} {this.getQuestionIndex(question) + 1} {this.strings.of} {this.questionsList().length}
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
                          ></Tag>
                        </div>
                      ) : null}
                    </div>
                  </span>
                );
              })}
            </transition-group>
            {/* BUTTONS */}
            <div class="card-margin-bottom">
              {this.strings ? (
                <div class="summary-button">
                  {this.enableReturn ? (
                    <button type="button" class="btn button btn-outline-primary btn-lg" onClick={() => this.backToQuestionnaireList()}>
                      {this.strings.back}
                    </button>
                  ) : null}
                  {this.enableNext ? (
                    <button type="button" class="btn button btn-primary btn-lg" disabled={this.notAllRequiredQuestionsCompleted()} onClick={() => this.goToSummary()}>
                      {this.strings.next}
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
