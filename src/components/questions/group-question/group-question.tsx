/**
 * This Component adds a Group-Question
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import { getLocaleComponentStrings } from '../../../utils/locale';
import { textToHtml } from '../../../utils/textToHtml';

@Component({
  tag: 'group-question',
  styleUrl: 'group-question.css',
  shadow: false,
  scoped: true,
})
export class GroupQuestion {
  @Element() element: HTMLElement;
  @Prop() variant: any = null;
  /**
   *  String containing the translations for the current locale
   */
  @State() strings: any;

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
  @Prop() question: any;
  @Prop() lastQuestion: boolean = false;
  @Prop() valueSets: Array<any>;
  @Prop() baseUrl: string;
  @Prop() editMode: boolean = false;
  @Prop() startCount: Number;
  @Prop() enableReturn: boolean = true;
  @Prop() mode: string;
  @Prop() enableInformalLocale: boolean;
  @Prop() enableErrorConsoleLogging:boolean;
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
  @Prop() locale: string = 'en';
  @Watch('locale')
  async watchLocale(newValue: string) {
    this.strings = await getLocaleComponentStrings(this.element, newValue, this.enableInformalLocale);
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

  getQuestionType(question) {
    return question.type + '-question';
  }

  /**
   * Emits new Event to give the required Question to Parent-Component
   * to be removed from the List of answered Questions
   */
  @Event() emitRemoveRequiredAnswer: EventEmitter;
  removeRequiredQuestionEvent(question) {
    this.emitRemoveRequiredAnswer.emit(question);
  }

  /**
   * Emits new Event to give the required Question to Parent-Component
   * to be added to the List of answered Questions
   */
  @Event() addRequiredAnswer: EventEmitter;
  addRequiredQuestionEvent(question) {
    this.addRequiredAnswer.emit(question);
  }

  /**
   * Emits an error-event
   */
   @Event() errorLog: EventEmitter;
   emitError(error) {
     this.errorLog.emit(error);
   }

  /* Lifecycle Methods */
  async componentWillLoad(): Promise<void> {}
  render() {
    return (
      <div class="qr-question-container">
        {this.mode !== 'GROUPS' ? (
          <div style={{ color: this.primary }}>
            <svg class="material-design-icon__svg" style={{ width: '80px', height: '80px' }} viewBox="0 0 24 24">
              <path fill="#000000" d="M19,7H9V5H19M15,15H9V13H15M19,11H9V9H19M20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M4,6H2V20A2,2 0 0,0 4,22H18V20H4V6Z"></path>
            </svg>
            {this.strings ? (
              <div class="qr-groupQuestion-subtitle">
                {this.strings.questionGroup} {this.question.prefix}
              </div>
            ) : null}
            {this.question.prefix ? <div class="qr-groupQuestion-title" innerHTML={textToHtml(this.question.prefix + ' ' + this.question.text)}></div> : <div class="qr-groupQuestion-title" innerHTML={textToHtml(this.question.text)}></div>}

            {/* TODO Liste mit allen Displayfragen in dieser Gruppe anzeigen */}
            <div class="qr-groupQuestion-display-container">
              {this.question.displays.map(question => {
                return <display-question class="qr-groupQuestion-display-text" question={question} locale={this.locale} enableInformalLocale={this.enableInformalLocale}></display-question>;
              })}
            </div>
          </div>
        ) : (
          <div>
            <div class="card">
              <div class="card-body">
                <svg class="material-design-icon__svg" style={{ width: '80px', height: '80px' }} viewBox="0 0 24 24">
                  <path fill="#000000" d="M19,7H9V5H19M15,15H9V13H15M19,11H9V9H19M20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M4,6H2V20A2,2 0 0,0 4,22H18V20H4V6Z"></path>
                </svg>
                {this.strings ? (
                  <div class="qr-groupQuestion-subtitle">
                    {this.strings.questionGroup} {this.question.prefix}
                  </div>
                ) : null}
                <div class="qr-groupQuestion-title">
                  {this.question.prefix} {this.question.text}
                </div>
              </div>
            </div>

            <transition-group name="list-complete" tag="p">
              {this.question.item.map(groupquestion => {
                const Tag = this.getQuestionType(groupquestion);
                return (
                  <div class="card-margin-top">
                    {groupquestion.type == 'group' ? (
                      <div class="card">
                        <div class="card-body">
                          <svg class="material-design-icon__svg" style={{ width: '80px', height: '80px' }} viewBox="0 0 24 24">
                            <path fill="#000000" d="M19,7H9V5H19M15,15H9V13H15M19,11H9V9H19M20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M4,6H2V20A2,2 0 0,0 4,22H18V20H4V6Z"></path>
                          </svg>
                          {this.strings ? (
                            <div class="qr-groupQuestion-subtitle">
                              {this.strings.questionGroup} {groupquestion.prefix}
                            </div>
                          ) : null}
                          <div class="qr-groupQuestion-title">
                            {groupquestion.prefix} {groupquestion.text}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {groupquestion.type !== 'group' && groupquestion.type !== 'display' ? (
                      <div class="card">
                        <div class="card-body">
                          {groupquestion.groupId && !groupquestion.item ? <div class="qr-groupQuestion-text">{this.getGroupText(groupquestion)}</div> : null}
                          <Tag
                            is={this.getQuestionType(groupquestion)}
                            question={groupquestion}
                            mode="ITEMS"
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
                            onError={event => this.emitError(event)}
                          ></Tag>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </transition-group>
          </div>
        )}
      </div>
    );
  }
}
