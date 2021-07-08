/**
 * This Component adds a Summary and reacts to the users input
 */
import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import { getLocaleComponentStrings } from '../../utils/locale';
import questionnaireResponseController from "../../utils/questionnaireResponseController";
import * as fhirApi from "@molit/fhir-api";

@Component({
  tag: 'questionnaire-summary',
  styleUrl: 'questionnaire-summary.css',
  shadow: false,
  scoped: true,
})
export class QuestionnaireSummary {
  @Element() element: HTMLElement;
  /**
   *  String containing the translations for the current locale
   */
  @State() strings: any;
  /**
   * Variable to store the value of the input
   */
  @State() selected: any = null;
  @Event() emitAnswer: EventEmitter;
  @Watch('selected')
  watchSelected() {
    if (this.allow_events) {
      if (this.selected !== null) {
        let object = {
          type: 'boolean',
          question: this.question,
          value: [this.selected],
        };
        this.emitAnswer.emit(object);
      }
    }
  }

  @Prop() question: any;
  @Watch('question')
  async watchQuestion() {
    this.allow_events = false;
    this.allow_events = true;
  }
  /**
   * FHIR Patient-Resource
   */
  @Prop() subject: Object;
  @Prop() FHIR_URL: string;
  @Prop() demoMode: Boolean;
  @Prop() task: Object;
  @Prop() mode: string;
  @Prop() questionnaire: Object = null;
  @Prop() questionnaireResponse: Object = null;
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

  /**
   * Allows events to be emitted if true
   */
  allow_events: boolean = false;

  /* computed */
  validate() {
    return this.selected || this.selected === [];
    // return false;
  }

  /* methods */
  onCardClick(selectedValue) {
    this.selected = selectedValue;
  }
  /**
     *
     */
   @Event() return: EventEmitter;
   returnToQuestionnaire() {
    this.return.emit("returnToQuestionnaire");
  }

  /**
   *
   * @param {Object} answersList
   */
  formatChoice(answersList) {
    let answer = "";
    answer = answersList[0].valueCoding.display;
    for (let i = 1; i < answersList.length; i++) {
      answer = answer + ", " + answersList[i].valueCoding.display;
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
      if (linkId === questionnaireItemList[i].linkId && questionnaireItemList[i].type === "display") {
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
    return "";
  }

  /**
     * Returns true if there is more than one patient with multiple tasks left.
     */
   async checkDemoMode() {
    if (this.demoMode) {
      let params = {
        "_has:Task:patient:status": "ready",
        "_has:Task:patient:code": "eQuestionnaire"
      };
      let patients = [];
      try {
        let response = await fhirApi.fetchResources(this.FHIR_URL, "Patient", params);
        patients = response.data.entry;

        if (patients.length === 1) {
          let taskParams = {
            subject: patients[0].resource.id,
            status: "ready"
          };

          let tasks = await fhirApi.fetchResources(this.FHIR_URL, "Task", taskParams);

          return tasks.data.entry.length !== 1 ? true : false;
        } else {
          return true;
        }
      } catch (error) {
        //
      }
    } else {
      return true;
    }
  }

  // async completeQuestionnaireResponse() {
  //   if (this.questionnaireResponse) {
  //     let demo = await this.checkDemoMode();
  //     let questResp = this.questionnaireResponse;
  //     let task = this.task;
  //     this.loading = true;
  //     let wrapper = {
  //       taskId: task.id,
  //       response: questResp
  //     };
  //     task.executionPeriod.end = new Date().toISOString();
  //     questResp.status = "completed";
  //     this.$refs.successPopover.show();
  //     try {
  //       if (this.connectionStatus) {
  //         // ONLINE
  //         let output = await fhirApi.submitResource(this.FHIR_URL, questResp);
  //         if (config.SHOW_QUESTIONAIRE_RESPONSE_URL) {
  //           // eslint-disable-next-line no-console
  //           console.info("Questionnaire Response ID: " + output.data.id, "Url: " + output.config.url + "/" + output.data.id);
  //         }

  //         if (demo) {
  //           task.status = "completed";
  //           await fhirApi.updateResource(this.FHIR_URL, task);
  //         }
  //         setTimeout(() => {
  //           this.loading = false;
  //         }, 250);
  //         if (!demo) {
  //           this.modalMessage.title = this.$t("thank-you-text");
  //           this.modalMessage.text = this.$t("demo");
  //         } else {
  //           this.modalMessage.title = this.$t("thank-you-text");
  //           this.modalMessage.text = this.$t("finish-text");
  //         }
  //       } else {
  //         //OFFLINE
  //         this.$emit("saveQuestionnaireResponse", wrapper);

  //         setTimeout(() => {
  //           this.loading = false;
  //         }, 250);
  //         if (!demo) {
  //           this.modalMessage.title = this.$t("thank-you-text");
  //           this.modalMessage.text = this.$t("demo");
  //         } else {
  //           this.modalMessage.title = this.$t("thank-you-text");
  //           this.modalMessage.text = this.$t("offline");
  //           this.modalMessage.subtext = this.$t("contactStaff");
  //         }
  //       }
  //     } catch (error) {
  //       // eslint-disable-next-line no-console
  //       console.error(error);
  //       this.$emit("saveQuestionnaireResponse", wrapper);

  //       setTimeout(() => {
  //         this.loading = false;
  //       }, 250);
  //       this.modalMessage.title = this.$t("thank-you-text");
  //       this.modalMessage.text = this.$t("offline");
  //       this.modalMessage.subtext = this.$t("contactStaff");
  //     }
  //   }
  // }
  // goToSelectedQuestion(question) {
  //   this.$emit("toSelectedQuestion", question);
  // }
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
        <div class="card">Summary</div>
      </div>
    );
  }
}
