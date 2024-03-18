import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import * as fhirApi from '@molit/fhir-api';
import { getLocaleComponentStrings } from '../../utils/locale';
import questionnaireController from '../../utils/questionnaireController';
import questionnaireResponseController from '../../utils/questionnaireResponseController';
import valueSetController from '../../utils/valueSetController';
import { cloneDeep } from 'lodash';

@Component({
  tag: 'questionnaire-renderer',
  styleUrl: 'questionnaire-renderer.css',
  shadow: false,
  scoped: true,
})
export class QuestionnaireRenderer {
  @Element() element: HTMLElement;

  /**
   *  String containing the translations for the current locale
   */
  @State() strings: any;
  @State() currentQuestionnaireResponse: any = null;
  /**
   * The "updated"-event is thrown everytime if the internal questionnaireResponse changes (every time an answer value has changed) and contains the current questionnaireResponse with status "in-progress"
   */
  @Event() updated: EventEmitter;
  @Watch('currentQuestionnaireResponse')
  async watchCurrentQuestionnaireResponse() {
    this.filterItemList();
    this.handleAnsweredQuestionsList();
    this.updated.emit(this.filterQuestionnaireResponse(this.currentQuestionnaireResponse));
  }
  @State() spinner: Object = {
    loading: true,
    message: '',
  };
  @State() filteredItemList: Array<any> = [];

  /**
   * FHIR-Resource Questionnaire
   */
  @Prop() questionnaire: any = null;
  @Watch('questionnaire')
  watchQuestionnaire() {
    this.handleQuestionnaireResponse();
  }
  /**
   * FHIR-Resource QuestionnaireResponse
   */
  @Prop() questionnaireResponse: any = null;
  @Watch('questionnaireResponse')
  async watchQuestionnaireResponse() {
    await this.handleQuestionnaireResponse();
  }
  /**
   * Current type of Questionnaire-Style to display
   * Available: stepper-questionnaire, grouped-questionnaire, full-questionnaire
   */
  @Prop() mode: string = 'stepper-questionnaire';
  @Watch('mode')
  watchMode() {
    if (this.currentMode && this.mode !== this.currentMode) {
      this.handleStartQuestion(this.lastAnsweredQuestion);
    }
    this.currentMode = this.mode;
    this.handleVariants();
  }

  @Prop() variant: any = 'Touch';
  @Watch('variant')
  watchVariant() {
    this.handleVariants();
  }
  /**
   * FHIR-Resource Patient
   */
  @Prop() subject: any = null;
  /**
   * FHIR-Resource Task
   */
  @Prop() task: any = null;
  /**
   * Array of ValueSets that are needed to display the given questionnaire
   */
  @Prop() valueSets: Array<any> = null;
  /**
   * FHIR-Base Url
   */
  @Prop() baseUrl: string;
  /**
   * If true the Renderer will return a QuestionnaireResponse with all items, even if some items have been deactivated by enableWhen
   */
  @Prop() enableFullQuestionnaireResponse: boolean = false;
  /**
   * Enable the summary. The summary will be shown if enableSummary is true
   */
  @Prop() enableSummary: boolean = false;
  /**
   * The Url to fetch the Questionnaire from
   */
  @Prop() questionnaireUrl: string = null;
  /**
   * The question where in the list of questions the renderer should start. Expects the question as an object.
   */
  @Prop() startQuestion: Object = null;
  @Watch('startQuestion')
  watchStartQuestion() {
    if (!this.enableSummary) {
      this.start_question = this.startQuestion;
    }
  }
  /**
   * If true the render will show the button to exit the renderer. It can be used in combination with the summary to edit answers.
   */
  @Prop() editMode: boolean = false;
  @Watch('editMode')
  watchEditMode() {
    if (!this.enableSummary) {
      this.edit_mode = this.editMode;
    }
  }
  /**
   * Enable the return-button to exit the render-view. This will also enable the "exit"-Event to be thrown if the information-page is deactivated.
   */
  @Prop() enableReturn: boolean = true;

  /**
   * Enable the button that can be used to show the summary or end the questionnaire. 
   */
  @Prop() enableNext: boolean = true;

  /**
   * If true, the Renderer will start with the last question
   */
  @Prop() lastQuestion: boolean = false;
  @Watch('lastQuestion')
  watchLastQuestion() {
    if (!this.enableSummary) {
      this.last_question = this.lastQuestion;
    }
  }

  /**
   * Options for Visual Analog Scale
   */
  @Prop() vasVertical: boolean = false;
  /**
   * If true shows the selected value for the vas scale
   */
  @Prop() vasShowSelectedValue: boolean = false;
  /**
   * Text for the label of the selected value
   */
  @Prop() vasSelectedValueLabel: string = null;
  /**
   * The text shown in the top half of the Summary
   */
  @Prop() summaryText: string = null;
  /**
   * Text shown in the top half of the information page
   */
  @Prop() informationPageText: string = null;
  /**
   * if true shows the remarks at the bottom of the summary
   */
  @Prop() showSummaryRemarks: boolean = false;
  /**
   * If true, enables the summary to send QuestionnaireResponses to the FHIR Server. Needs the fhir-base url to be able send to the server
   */
  @Prop() enableSendQuestionnaireResponse: boolean = true;
  /**
   * If true enables the use of the informalLocal - only available for german translation
   */
  @Prop() enableInformalLocale: boolean = false;
  /**
   * If true enables the renderer to show the informationPage
   */
  @Prop() enableInformationPage: boolean = false;
  /**
   * Shows a trademark/copyright text at the bottom of the renderer
   */
  @Prop() trademarkText: string = null;
  /**
   * If true, shows the description of the group for every question thats part of the group
   */
  @Prop() enableGroupDescription: boolean = true;
  /**
   * If true, enables the renderer to expand valueSets to also load included code systems
   */
  @Prop() enableExpand: boolean = true;
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
   * If showOnlySummary is true, the questionnaire-renderer will only show the summary
   */
  @Prop() showOnlySummary: boolean = false;
  /**
   * A token that can be send with server-requests
   */
  @Prop() token: string;
  /**
   * If basicAuth is true, the authorization header in server requests will be set to "Basic "
   */
  @Prop() basicAuth: boolean = false;
  /**
   * Allows the renderer to show errors in the console while emitting error-events
   */
  @Prop() enableErrorConsoleLogging: boolean = false;
  /**
   * Shows a finish-button instead of next at the last question
   */
  @Prop() enableFinishButton: boolean = false;
  /**
   * If set, will change the status of the questionnaireResponse to the given string value
   */
  @Prop() questionnaireResponseStatus: string;

  /**
   * Text for back-button
   */
  back: string;
  /**
   * Text for next-button
   */
  next: string;
  edit_mode: boolean = false;
  start_question: Object = null;
  /**
   * Language property of the component. </br>
   * Currently suported: [de, en, es]
   */
  @Prop() locale: string = 'en';
  @Watch('locale')
  async watchLocale(newValue: string) {
    this.strings = await getLocaleComponentStrings(this.element, newValue, this.enableInformalLocale);
  }

  answeredRequiredQuestionsList: Array<any> = [];
  @State() currentMode: string = null;
  currentQuestionnaire: any = null;
  currentValueSets: Array<any> = [];
  currentStartCount: number = null;
  lastAnsweredQuestion: any = null;
  @State() show_questionnaire: boolean = false;
  @State() show_summary: boolean = false;
  @State() show_informationPage: boolean = true;
  @State() last_question: boolean = false;

  /* computed */
  /**
   * Checks if there are already Answers in the QuestionnaireResponse
   */
  wasStarted() {
    let returnValue = false;
    if (this.questionnaireResponse) {
      for (let i = 0; i < this.questionnaireResponse.item.length; i++) {
        if (this.questionnaireResponse.item[i]) {
          returnValue = true;
        }
      }
    }
    return returnValue;
  }

  /* methods */

  /**
   * Removes all disabled and hidden Questions, aswell as Questions of type display
   * @param questionnaireResponse 
   * @returns 
   */
  filterQuestionnaireResponse(questionnaireResponse) {
    let filteredQuestionnaireResponse = cloneDeep(questionnaireResponse);
    questionnaireResponseController.removeQuestionnaireResponseDisplayQuestions(filteredQuestionnaireResponse.item);
    filteredQuestionnaireResponse.item = this.filterQuestionnaireResponseItems(this.filteredItemList, filteredQuestionnaireResponse.item);
    return filteredQuestionnaireResponse;
  }

  /**
   * Compares and removes all Items from a given ItemList, that are not in the filteredList
   * @param filteredQuestionnaireItemList - the itemList created from questionnaire.item
   * @param itemList
   */
  filterQuestionnaireResponseItems(filteredQuestionnaireItemList, itemList) {
    itemList = itemList.filter(element => {
      return filteredQuestionnaireItemList.find(item => item.linkId === element.linkId)
    })
    itemList.forEach((element) => {
      if (element.item && element.item.length > 0) {
        element.item = this.filterQuestionnaireResponseItems(filteredQuestionnaireItemList, element.item);
      }
    })

    return itemList;
  }

  /**
   * The "finished"-event is thrown once the next button is pressed or in case of the summary the save-button. It contains the current questionnaireResponse with the status "completed"
   */
  @Event() finished: EventEmitter;
  backToSummary() {
    if (this.enableFullQuestionnaireResponse) {
      if (this.enableSummary) {
        this.show_questionnaire = false;
        this.show_summary = true;
        this.last_question = false;
        this.edit_mode = false;
        this.start_question = null;
      }
    } else {
      if (this.enableSummary) {
        this.show_questionnaire = false;
        this.show_summary = true;
        this.last_question = false;
        this.edit_mode = false;
        this.start_question = null;
      }
    }
  }

  /**
   *
   */
  toQuestionnaire(lastQuestion) {
    this.show_informationPage = false;
    this.lastAnsweredQuestion = null;
    this.currentStartCount = null;
    this.start_question = null;
    this.edit_mode = false;
    this.last_question = lastQuestion;
    this.show_summary = false;
    this.show_questionnaire = true;
  }

  /**
   *
   * @param question
   */
  async editQuestion(question) {
    this.edit_mode = true;
    this.start_question = question.detail;
    await this.handleStartQuestion(this.start_question);
    this.show_summary = false;
    this.last_question = false;
    this.show_questionnaire = true;
  }

  /**
   * Emits an Event wich includes the finished Questionnaire Response
   */
  async finishQuestionnaire(questionnaireResponse) {
    if (this.enableFullQuestionnaireResponse) {
      if (this.enableSummary) {
        this.edit_mode = false;
        this.show_questionnaire = false;
        this.show_summary = true;
        this.start_question = null;
      }
      this.finished.emit(questionnaireResponse);
    } else {
      if (this.enableSummary) {
        this.edit_mode = false;
        this.show_questionnaire = false;
        this.show_summary = true;
        this.start_question = null;
      }

      if(this.questionnaireResponseStatus){
        questionnaireResponse.status = this.questionnaireResponseStatus
      }else{
        questionnaireResponse.status = 'completed';
      }
      this.finished.emit(await this.filterQuestionnaireResponse(questionnaireResponse));
    }
  }

  /**
   * Shows InformationPage if showOnlySummary is false and enableInformationPage is true
   */
  handleInformationPage() {
    if (!this.showOnlySummary) {
      if (this.enableInformationPage) {
        this.show_informationPage = true;
        this.show_questionnaire = false;
        this.show_summary = false;
      } else if (!this.enableInformationPage) {
        this.show_informationPage = false;
        this.show_questionnaire = true;
        this.show_summary = false;
      }
    }
  }

  /**
   * Takes the given object, adds new answers to the current QuestionnaireRespons and saves the question as the last answered Question
   */
  async handleQuestionnaireResponseEvent(object) {
    this.lastAnsweredQuestion = object.detail.question;
    this.currentQuestionnaireResponse = await questionnaireResponseController.addAnswersToQuestionnaireResponse(this.currentQuestionnaireResponse, object.detail.question.linkId, object.detail.value, object.detail.type);
    this.handleAnsweredQuestionsList();
  }

  /**
   * Creates a new QuestionnaireResponse
   */
  createQuestionnaireResponse() {
    this.currentQuestionnaireResponse = questionnaireResponseController.createQuestionnaireResponse(this.questionnaire, this.subject, this.questionnaireResponse);
  }

  /**
   * Adds an Answer to a QuestionnaireResponse
   */
  addAnswerToQuestionnaireResponse(linkId, type, answers) {
    if (linkId && type && answers !== null) {
      this.currentQuestionnaireResponse = questionnaireResponseController.addAnswersToQuestionnaireResponse(this.currentQuestionnaireResponse, linkId, answers, type);
    }
  }

  /**
   * adds a required answered Question to the requiredAnsweredQuestionsList
   */
  addQuestionToRequiredAnsweredQuestionsList(question) {
    if (question) {
      let requiredAnsweredQuestionsList = this.answeredRequiredQuestionsList;
      if (question.required) {
        let addQuestion = true;
        for (let i = 0; i < requiredAnsweredQuestionsList.length; i++) {
          if (JSON.stringify(requiredAnsweredQuestionsList[i]) === JSON.stringify(question)) {
            addQuestion = false;
          }
        }
        if (addQuestion) {
          requiredAnsweredQuestionsList.push(question);
        }
      }
      this.answeredRequiredQuestionsList = requiredAnsweredQuestionsList;
    } else {
      throw new Error('The given Question was ' + question);
    }
  }

  /**
   * Removes a Question from the List of answered Questions
   * @param {Object} question Required Question that needs to be removed from the list of answered Questions
   */
  removeQuestionFromRequiredAnsweredQuestionsList(question) {
    if (question) {
      let requiredAnsweredQuestionsList = this.answeredRequiredQuestionsList;
      if (question.required) {
        //check if question is already in the list and remove it
        for (let i = 0; i < requiredAnsweredQuestionsList.length; i++) {
          if (JSON.stringify(requiredAnsweredQuestionsList[i]) === JSON.stringify(question)) {
            requiredAnsweredQuestionsList.splice(i, 1);
          }
        }
      }

      this.answeredRequiredQuestionsList = requiredAnsweredQuestionsList;
    } else {
      throw new Error('The given Question was ' + question);
    }
  }

  /**
   * Resets the List of already answered Questions
   */
  resetAnsweredQuestionsList() {
    this.answeredRequiredQuestionsList = [];
  }

  /**
   * load Questionnaire if questionnaire is null and questionnaireUrl is given. Adds GroupIds to items and restructures the groups so they contain their display
   * questions.
   */
  async handleQuestionnaire() {
    if (this.questionnaire) {
      if (typeof this.questionnaire === 'string') {
        this.currentQuestionnaire = JSON.parse(this.questionnaire);
      } else {
        this.currentQuestionnaire = this.questionnaire;
      }
      // Add Group-Ids to Questions in Groups
      for (let i = 0; i < this.currentQuestionnaire.item.length; i++) {
        if (this.currentQuestionnaire.item[i].type === 'group') {
          this.addGroupIdToItems(this.currentQuestionnaire.item[i].item, this.currentQuestionnaire.item[i].linkId);
          await this.putDisplayQuestionsIntoGroups(this.currentQuestionnaire.item[i]);
        }
      }
      await this.removeGroupedDisplayQuestions(this.currentQuestionnaire.item);
    } else if (this.questionnaireUrl) {
      try {
        this.currentQuestionnaire = await fhirApi.fetchByUrl(this.questionnaireUrl, null, this.token, this.basicAuth);
        // Add Group-Ids to Questions in Groups
        for (let i = 0; i < this.currentQuestionnaire.item.length; i++) {
          if (this.currentQuestionnaire.item[i].type === 'group') {
            this.addGroupIdToItems(this.currentQuestionnaire.item[i].item, this.currentQuestionnaire.item[i].linkId);
            await this.putDisplayQuestionsIntoGroups(this.currentQuestionnaire.item[i]);
          }
        }
        await this.removeGroupedDisplayQuestions(this.currentQuestionnaire.item);
      } catch (error) {
        this.emitError(error);
        if (this.enableErrorConsoleLogging) {
          console.error(error);
        }
      }
    } else {
      let error = new Error("No questionnaire found, please check that the questionnaire property is properly used")
      this.emitError(error);
      if (this.enableErrorConsoleLogging) {
        console.error(error);
      }
    }
  }

  /**
   * Removes questions of the type "display" from the list. Does not remove display-questions containing a groupId
   */
  async removeGroupedDisplayQuestions(list) {
    await list.reduceRight((_acc, question, index, object) => {
      if (question.type === 'display' && question.groupId) {
        object.splice(index, 1);
      }
      if (question.type === 'group') {
        this.removeGroupedDisplayQuestions(question.item);
      }
    }, []);
  }

  /**
   * Looks for all the questions of type "display" and pushes them into a new List in the group
   */
  async putDisplayQuestionsIntoGroups(group) {
    let displayQuestions = [];
    group.displays = [];
    let item = group.item;
    for (let i = 0; i < item.length; i++) {
      if (item[i].type === 'display' && item[i].groupId) {
        displayQuestions.push(item[i]);
      }
      if (item[i].type === 'group') {
        await this.putDisplayQuestionsIntoGroups(item[i]);
      }
    }
    for (let a = 0; a < displayQuestions.length; a++) {
      group.displays.push(displayQuestions[a]);
    }
  }

  /**
   * Adds a GroupId to all Questions inside a Group.
   */
  addGroupIdToItems(item, linkId) {
    for (let i = 0; i < item.length; i++) {
      item[i].groupId = linkId;
      if (item[i].type === 'group') {
        this.addGroupIdToItems(item[i].item, item[i].linkId);
      }
    }
  }

  /**
   * 
   */
  handleVariants() {
    // if (this.variant.toLowerCase() === 'form') {
    //   if (this.currentMode === 'stepper-questionnaire' || this.mode === 'stepper-questionnaire') {
    //     this.currentMode = 'full-questionnaire';
    //   }
    // }
    // if (this.variant.toLowerCase() === 'compact') {
    //   if (this.currentMode === 'stepper-questionnaire' || this.mode === 'stepper-questionnaire') {
    //     this.currentMode = 'full-questionnaire';
    //   }
    // }
    if (this.variant.toLowerCase() === 'touch') {
      if (this.currentMode === 'stepper-questionnaire' || this.mode === 'stepper-questionnaire') {
        this.currentMode = 'stepper-questionnaire';
      }
      if (this.currentMode === 'full-questionnaire' || this.mode === 'full-questionnaire') {
        this.currentMode = 'full-questionnaire';
      }
      if (this.currentMode === 'grouped-questionnaire' || this.mode === 'grouped-questionnaire') {
        this.currentMode = 'grouped-questionnaire';
      }
    }
  }

  /**
   * Adds and Removes Questions from the requiredAnswersList
   */
  handleAnsweredQuestionsList() {
    if (this.currentQuestionnaireResponse) {
      let qr = questionnaireResponseController.createItemList(this.currentQuestionnaireResponse);
      let aRQL = this.answeredRequiredQuestionsList;
      for (let i = 0; i < qr.length; i++) {
        let result = this.filteredItemList.find(element => element.linkId === qr[i].linkId);
        if (result) {
          if (qr[i].answer && qr[i].answer.length >= 1) {
            this.addQuestionToRequiredAnsweredQuestionsList(this.filteredItemList[this.filteredItemList.findIndex(item => item.linkId === qr[i].linkId)]);
          } else {
            this.removeQuestionFromRequiredAnsweredQuestionsList(this.filteredItemList[this.filteredItemList.findIndex(item => item.linkId === qr[i].linkId)]);
          }
        } else {
          let questionToRemove = aRQL.find(function (element) {
            return element.linkId === qr[i].linkId;
          });
          if (questionToRemove) {
            this.removeQuestionFromRequiredAnsweredQuestionsList(questionToRemove);
          }
        }
      }
    }
  }

  /**
   *  Creates a new QuestionnaireResponse if no QuestionnaireResponse was given via props or the given questionnaire-reference-id
   *  does not match the id of the given questionnaire
   */
  handleQuestionnaireResponse() {
    if (this.questionnaireResponse) {
      if (this.questionnaireResponse.questionnaire) {
        let split = this.questionnaireResponse.questionnaire.split('/');
        let id = split[1];
        if (this.questionnaireResponse.questionnaire === this.questionnaire.url || id && id === this.questionnaire.id) {
          this.createQuestionnaireResponse();
          let questionaireResponseItems = questionnaireResponseController.createItemList(this.questionnaireResponse);
          this.transferQuestionnaireResponseAnswers(this.currentQuestionnaireResponse, questionaireResponseItems);
          //filtern?
          this.filterItemList();
        } else {
          if (this.enableErrorConsoleLogging) {
            console.info('QuestionnaireRenderer | Info: Created new questionnaireResponse because neither questionnaireResponse and Questionnaire url or id matched');
          }
          this.createQuestionnaireResponse();
        }
      } else {
        if (this.enableErrorConsoleLogging) {
          console.info('QuestionnaireRenderer | Info: Created new questionnaireResponse because the given questionnaireResponse did not contain a valid reference to the questionnaire');
        }
        this.createQuestionnaireResponse();
      }
    } else {
      this.createQuestionnaireResponse();
    }


  }

  /**
   * Compares the answers in the given answeredItemList and baseList. tranfers the answers of the answeredItemList into the baseList
   * @param {Array} baseList Items of an empty QuestionnaireResponse to be filled
   * @param {Array} answeredItemList List containing answers
   */
  transferQuestionnaireResponseAnswers(baseList, answeredItemList) {
    baseList.item.forEach((element, index) => {
      let result = answeredItemList.find(item => item.linkId === element.linkId);
      if (result) {
        if (element.item && element.item.length > 0) {
          this.transferQuestionnaireResponseAnswers(element, answeredItemList);
        } else {
          baseList.item[index].answer = result.answer;
        }
      }
    });
  }

  /**
   * Gets a list of all ValueSets needed to display the questionnaire, then compares the list to the list of valuesets
   * given as properties. If the lists are not the same or no valueSets were given, then new ValueSets will be fetched, added and used
   */
  async handleValueSets() {
    let neededReferencesList = [];
    let givenValueSetReferences = [];
    let itemList = questionnaireResponseController.createItemList(this.currentQuestionnaire);
    let valueSets = valueSetController.getQuestionsWithValueSet(itemList);
    neededReferencesList = valueSetController.getReferencesFromValueSets(valueSets);
    givenValueSetReferences = valueSetController.getReferencesFromValueSets(this.valueSets);
    if (this.valueSets) {
      let missingReferences = [];

      for (let i = 0; i < neededReferencesList.length; i++) {
        let push = true;
        for (let a = 0; a < givenValueSetReferences.length; a++) {
          if (neededReferencesList[i] === givenValueSetReferences[a]) {
            push = false;
          }
        }
        if (push) {
          missingReferences.push(neededReferencesList[i]);
        }
      }
      this.currentValueSets.push(this.valueSets);
      if (missingReferences.length !== 0) {
        if (this.baseUrl) {
          this.currentValueSets.concat(await valueSetController.getValueSetsWithReferences(this.baseUrl, missingReferences, this.token, this.basicAuth, this.enableExpand));
        }
      }
    } else {
      try {
        this.currentValueSets = await valueSetController.getNewValueSets([this.currentQuestionnaire], this.baseUrl, this.token, this.basicAuth, this.enableExpand);
      } catch (error) {
        this.emitError(error);
        if (this.enableErrorConsoleLogging) {
          console.error(error);
        }
      }
    }
  }

  /**
   * Uses the given question to find the index in the questionnaire itemlist and checks if it is a group.
   * It will set the startCount to the index of the question
   * @param question
   */
  handleStartQuestion(question) {
    if (question && this.filteredItemList) {
      if (this.mode === 'grouped-questionnaire') {
        let questionItem = null;
        for (let i = 0; i < this.filteredItemList.length; i++) {
          if (question.linkId === this.filteredItemList[i].linkId) {
            questionItem = this.filteredItemList[i];
          }
        }
        if (questionItem && questionItem.groupId) {
          let groupQuestion = this.getParentGroupQuestion(questionItem.groupId);
          this.handleCurrentStartCount(groupQuestion);
        } else {
          this.handleCurrentStartCount(question);
        }
      } else {
        this.handleCurrentStartCount(question);
      }
    }
  }

  /**
   * finds the index of the given question in the filtered ItemList and sets the startCount
   */
  handleCurrentStartCount(question) {
    if (this.mode === 'grouped-questionnaire') {
      this.currentStartCount = this.questionnaire.item.findIndex(object => object.linkId === question.linkId);
    } else {
      this.currentStartCount = this.filteredItemList.findIndex(object => object.linkId === question.linkId);
    }

    if (this.currentStartCount < 0) {
      this.show_questionnaire = true;
      this.currentStartCount = 0;
    }
  }

  /**
   * Takes the given groupId and searches for the fitting Group-Question with the matching link-Id. If the Group-Question is in a Group itself, the Method will
   * call itself to find the parent Group-Question.
   *
   * @returns the parent groupQuestion
   */
  getParentGroupQuestion(groupId) {
    let parentQuestion = null;
    for (let i = 0; i < this.filteredItemList.length; i++) {
      if (this.filteredItemList[i].linkId === groupId) {
        if (this.filteredItemList[i].groupId) {
          parentQuestion = this.getParentGroupQuestion(this.filteredItemList[i].groupId);
        } else {
          parentQuestion = this.filteredItemList[i];
        }
      }
    }
    return parentQuestion;
  }

  /**
   * Filters the itemlist of the current questionnaire. Removes questions that are hidden and not active
   */
  filterItemList() {
    const URL_QUESTIONNAIRE_HIDDEN = "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden"

    let newItemList = [];

    //erstellt neue Liste mit Fragen nach Filterung durch Enable-When
    if (this.currentQuestionnaireResponse && this.currentQuestionnaire) {
      newItemList = questionnaireController.handleEnableWhen(this.currentQuestionnaireResponse, this.currentQuestionnaire.item);
    }

    newItemList = newItemList.filter(item => {
      let hiddenExtension = questionnaireController.lookForExtension(URL_QUESTIONNAIRE_HIDDEN, item);
      return hiddenExtension == null || !hiddenExtension.hidden;
    });

    this.filteredItemList = newItemList;
  }

  /**
   * Emits an Event to exit the Renderer. Contains the current questionnaireResponse
   */
  @Event() exit: EventEmitter;
  leaveQuestionnaireRenderer() {
    if (this.enableInformationPage) {
      this.show_summary = false;
      this.show_questionnaire = false;
      this.show_informationPage = true;
    } else {
      this.exit.emit(this.filterQuestionnaireResponse(this.currentQuestionnaireResponse));
    }
  }

  /**
   * Emits an error-event
   */
  @Event() errorLog: EventEmitter;
  emitError(error) {
    this.errorLog.emit(error);
  }

  /**
   * Emits the addRemarks if the "remarks"-button in the summary as been pressed.
   */
  @Event() addRemarks: EventEmitter;
  addAdditionalRemarks() {
    this.addRemarks.emit('addRemarks');
  }

  /**
   * Emits an event to close the summary
   */
  @Event() closeSummary: EventEmitter;
  closesSummary() {
    this.closeSummary.emit('closeSummary');
  }
  /* Lifecycle Methods */

  async componentWillLoad(): Promise<void> {
    try {
      this.strings = await getLocaleComponentStrings(this.element, this.locale, this.enableInformalLocale);
      this.spinner = { ...this.spinner, loading: true };
      this.spinner = { ...this.spinner, message: this.strings.loading.questionnaire };
      await this.handleQuestionnaire();
      this.spinner = { ...this.spinner, message: this.strings.loading.valueset };
      await this.handleValueSets();
      this.spinner = { ...this.spinner, message: this.strings.loading.data };
      await this.handleQuestionnaireResponse();
      await this.filterItemList();
      this.handleAnsweredQuestionsList();
      if (!this.enableSummary) {
        this.start_question = this.startQuestion;
        this.last_question = this.lastQuestion;
        this.edit_mode = this.editMode;
      }
      this.currentMode = this.mode;
      this.handleVariants();
      await this.handleStartQuestion(this.start_question);
      this.handleInformationPage();
      setTimeout(() => {
        this.spinner = { ...this.spinner, loading: false };
      }, 250);
    } catch (e) {
      if (this.enableErrorConsoleLogging) {
        console.error(e);
      }
      this.emitError(e);

    }
  }
  render() {
    const Tag = this.currentMode;
    return (
      <div class="qr-questionnaireRenderer-container">
        {this.show_questionnaire && !this.showOnlySummary ? (
          <div class="qr-questionnaireRenderer-questions">
            <Tag
              // variant={this.variant.toLowerCase()}
              variant="touch"
              filteredItemList={this.filteredItemList}
              questionnaireResponse={this.currentQuestionnaireResponse}
              questionnaire={this.currentQuestionnaire}
              requiredQuestionList={this.answeredRequiredQuestionsList}
              valueSets={this.currentValueSets}
              lastQuestion={this.last_question}
              startCount={this.currentStartCount}
              baseUrl={this.baseUrl}
              editMode={this.edit_mode}
              primary={this.primary}
              secondary={this.secondary}
              danger={this.danger}
              enableReturn={this.enableReturn}
              enableNext={this.enableNext}
              locale={this.locale}
              spinner={this.spinner}
              enableSummary={this.enableSummary}
              enableInformalLocale={this.enableInformalLocale}
              vasVertical={this.vasVertical}
              vasShowSelectedValue={this.vasShowSelectedValue}
              vasSelectedValueLabel={this.vasSelectedValueLabel}
              trademarkText={this.trademarkText}
              enableGroupDescription={this.enableGroupDescription}
              enableErrorConsoleLogging={this.enableErrorConsoleLogging}
              enableFinishButton={this.enableFinishButton}
              onSummary={() => this.backToSummary()}
              onFinish={() => this.finishQuestionnaire(this.currentQuestionnaireResponse)}
              onReturn={() => this.leaveQuestionnaireRenderer()}
              onEmitAnswer={ev => this.handleQuestionnaireResponseEvent(ev)}
              onAddRemarks={() => this.addAdditionalRemarks()}
              onErrorLog={error => this.emitError(error.detail)}
            ></Tag>
          </div>
        ) : null}
        {this.show_questionnaire && this.show_summary && !this.showOnlySummary ? (
          // TODO does calc work like this?
          <div class="qr-questionnaireRenderer-questionNotFound" style={{ height: 'calc(100vh - 200px)' }}>
            <div class="qr-questionnaireRenderer-questionNotFound-noteModal">
              <div>
                <div>{this.strings.questionDeactivated}</div>
                <div class="qr-questionnaireRenderer-questionNotFound-button-container ">
                  <button class="btn btn-primary qr-questionnaireRenderer-questionNotFound-button" onClick={() => this.backToSummary()}>
                    {this.strings.backtoSummary}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {this.show_summary || this.showOnlySummary ? (
          <div class="qr-questionnaireResponse-questionnaireSummary">
            <questionnaire-summary
              subject={this.subject}
              baseUrl={this.baseUrl}
              locale={this.locale}
              task={this.task}
              summary_text={this.summaryText}
              questionnaire={this.questionnaire}
              questionnaireResponse={this.enableFullQuestionnaireResponse ? this.currentQuestionnaireResponse : this.filterQuestionnaireResponse(this.currentQuestionnaireResponse)}
              onToQuestionnaireRenderer={() => this.toQuestionnaire(true)}
              onEditQuestion={question => this.editQuestion(question)}
              onFinishQuestionnaire={() => this.finishQuestionnaire(this.currentQuestionnaireResponse)}
              onErrorLog={error => this.emitError(error.detail)}
              onCloseSummary={() => this.closesSummary()}
              token={this.token}
              basicAuth={this.basicAuth}
              editable={!this.showOnlySummary}
              showSummaryRemarks={this.showSummaryRemarks}
              enableSendQuestionnaireResponse={this.enableSendQuestionnaireResponse}
              enableErrorConsoleLogging={this.enableErrorConsoleLogging}
              enableInformalLocale={this.enableInformalLocale}
              trademarkText={this.trademarkText}
              questionnaireResponseStatus={this.questionnaireResponseStatus}
            ></questionnaire-summary>
          </div>
        ) : null}
        {this.show_informationPage && this.enableInformationPage && !this.showOnlySummary ? (
          <div>
            <information-page
              informationPageText={this.informationPageText}
              questionnaire={this.questionnaire}
              filteredItemList={this.filteredItemList}
              enableInformalLocale={this.enableInformalLocale}
              enableErrorConsoleLogging={this.enableErrorConsoleLogging}
              locale={this.locale}
              onStartQuestionnaire={() => this.toQuestionnaire(false)}
              trademarkText={this.trademarkText}
            // onErrorLog={error => this.emitError(error)}
            ></information-page>
          </div>
        ) : null}
      </div>
    );
  }
}
