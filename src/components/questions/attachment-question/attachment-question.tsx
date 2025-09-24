/**
 * This Component adds a Attachment-Question and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import questionnaireResponseController from '../../../utils/questionnaireResponseController';
import { getLocaleComponentStrings } from '../../../utils/locale';
import { textToHtml } from '../../../utils/textToHtml';

@Component({
  tag: 'attachment-question',
  styleUrl: 'attachment-question.css',
  shadow: false,
  scoped: true,
})
export class AttachmentQuestion {
  @Element() element: HTMLElement;
  @Prop() questionnaire: Object = null;
  @Prop() question: any;
  @State() selected: any = null;
  @State() strings: any;
  @Prop() enableInformalLocale: boolean;
  /**
   * Language property of the component. </br>
   * Currently suported: [de, en, es]
   */
  @Prop() locale: string = 'en';
  @Prop() enableErrorConsoleLogging: boolean;
  @Event() emitAnswer: EventEmitter;
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
  @State() reset: Boolean = false;
  /**
   * Allows events to be emitted if true
   */
  allow_events: boolean = false;
  @Prop() questionnaireResponse: Object = null;
  @Watch('questionnaireResponse')
  async watchQuestionnaireResponse() {
    this.allow_events = false;
    await this.setSelected();
    this.allow_events = true;
  }

  @Watch('question')
  async watchQuestion() {
    this.allow_events = false;
    await this.setSelected();
    this.allow_events = true;

    this.reset = true;
    setTimeout(() => {
      this.reset = false;
    }, 5);
  }
  @Watch('selected')
  watchSelected() {
      if (this.allow_events) {
        console.log('selected watch', this.selected);
      let object = null;
      if (this.selected !== null) {
        object = {
          type: 'attachment',
          question: this.question,
          value: [this.selected],
        };
        this.emitAnswer.emit(object);
      }
    }
  }

  /* computed */
  validate() {
    return this.selected ? true : false;
    // return false;
  }
  setSelected() {
    try {
      let value = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, 'attachment');
      console.log(value);
      //   TODO schaun was mit value gemacht werden soll
    } catch (error) {
      if (this.enableErrorConsoleLogging) {
        console.error(error);
      }
      this.emitError(error);
    }
  }

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Emits an error-event
   */
  @Event() errorLog: EventEmitter;
  emitError(error) {
    this.errorLog.emit(error);
  }

  async handleFileChange(event: Event) {
    console.log(this.selected)
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }
    const base64 = await this.fileToBase64(file);
    this.selected = base64;
  }
  async componentWillLoad(): Promise<void> {
    try {
      this.strings = await getLocaleComponentStrings(this.element, this.locale, this.enableInformalLocale);
      await this.setSelected();
      this.allow_events = true;
    } catch (e) {
      if (this.enableErrorConsoleLogging) {
        console.error(e);
      }
      this.emitError(e);
    }
  }
  render() {
    return (
      <div class="qr-question-container">
        <div class="qr-question qr-question-attachment">
          <div class="qr-question-head">
            <div class="qr-question-title">
              <div class={this.reset ? 'qr-question-hidden' : ''}>
                {this.question.prefix && this.question.prefix != '' ? <span class="qr-question-prefix">{this.question.prefix}</span> : null}
                <span class="qr-question-text" innerHTML={textToHtml(this.question.text)}></span>
              </div>
            </div>
            <div class="qr-question-mandatoryQuestion">
              {this.strings ? (
                <div style={{ color: this.danger }} class={this.validate() || !this.question.required ? 'qr-question-hidden' : ''}>
                  {this.strings.mandatory_question}
                </div>
              ) : null}
            </div>
          </div>
          <hr />
          <div class="qr-question-attachment-input">
            {this.question ? (
              <div class="form-group" id={'radio-attachment-' + this.question.linkId}>
                <input type="file" id="fileInput" onChange={e => this.handleFileChange(e)} />
              </div>
            ) : null}
          </div>
          <br />
        </div>
      </div>
    );
  }
}
