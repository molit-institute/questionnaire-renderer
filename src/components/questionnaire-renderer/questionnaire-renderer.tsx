import { Component, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import * as fhirApi from '@molit/fhir-api';
import { getLocaleComponentStrings } from '../../utils/locale';
import questionnaireController from '../../utils/questionnaireController';
import questionnaireResponseController from '../../utils/questionnaireResponseController';
import valueSetController from '../../utils/valueSetController';

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
  @Event() updated: EventEmitter;
  @Watch('currentQuestionnaireResponse')
  async watchCurrentQuestionnaireResponse() {
    await this.filterItemList();
    this.handleAnsweredQuestionsList();
    this.updated.emit(this.currentQuestionnaireResponse);
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
   * FHIR-Resource Patient
   */
  @Prop() subject: any = null;
  /**
   * List of ValueSets that are needed to display the given questionnaire
   */
  @Prop() valueSets: Array<any> = null;
  /**
   * FHIR-Base Url
   */
  @Prop() baseUrl: string;
  /**
   * Current type of Questionnaire-Style to display
   * Available: stepper-questionnaire, grouped-questionnaire, full-questionnaire
   */
  @Prop() mode: string = 'StepperQuestionnaire';
  @Watch('mode')
  watchMode() {
    if (this.currentMode && this.mode !== this.currentMode) {
      this.handleStartQuestion(this.lastAnsweredQuestion);
    }
    this.currentMode = this.mode;
  }
  /**
   * The Url to fetch the Questionnaire from
   */
  @Prop() questionnaireUrl: string = null;
  /**
   * ID of the question in the ItemList where in the list of questions the renderer should start
   */
  @Prop() startQuestion: Object = null;
  /**
   * If true the render will show the button to exit the renderer
   */
  @Prop() editMode: boolean = false;
  /**
   * Enable the return-button to exit the render-view
   */
  @Prop() enableReturn: boolean = true;
  /**
   * If true, the Renderer will show the last question
   */
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
   * Text for back-button
   */
  back: string;
  /**
   * Text for next-button
   */
  next: string;
  /**
   * Language property of the component. </br>
   * Currently suported: [de, en, es]
   */
  @Prop() locale: string = 'en';
  @Watch('locale')
  async watchLocale(newValue: string) {
    
    this.strings = await getLocaleComponentStrings(this.element, newValue);
  }

  answeredRequiredQuestionsList: Array<any> = [];
  currentMode: string = null;
  currentQuestionnaire: any = null;
  currentValueSets: Array<any> = [];
  currentStartCount: number = null;
  lastAnsweredQuestion: any = null;
  modal: boolean = false;

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
  @Event() finished: EventEmitter;
  backToSummary() {
    this.modal = false;
    this.finished.emit(this.currentQuestionnaireResponse);
  }

  /**
   * Takes the given object, adds new answers to the curren QuestionnaireRespons and saves the question as the last answered Question
   */
  async handleQuestionnaireResponseEvent(object) {
    this.lastAnsweredQuestion = object.detail.question;
    let qrc = await questionnaireResponseController.addAnswersToQuestionnaireResponse(this.currentQuestionnaireResponse, object.detail.question.linkId, object.detail.value, object.detail.type)
    this.currentQuestionnaireResponse = {...this.currentQuestionnaireResponse, qrc};
    this.handleAnsweredQuestionsList();
  }

  /**
   * Creates a new QuestionnaireResponse
   */
  createQuestionnaireResponse() {
    this.currentQuestionnaireResponse = questionnaireResponseController.createQuestionnaireResponse(this.questionnaire, this.subject);
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
   *
   */
  resetAnsweredQuestionsList() {
    this.answeredRequiredQuestionsList = [];
  }

  /**
   * load Questionnaire if questionnaire is null and questionnaireUrl is given
   */
  async handleQuestionnaire() {
    if (this.questionnaire) {
      this.currentQuestionnaire = this.questionnaire;
      // Add Group-Ids to Questions in Groups
      for (let i = 0; i < this.currentQuestionnaire.item.length; i++) {
        if (this.currentQuestionnaire.item[i].type === 'group') {
          this.addGroupIdToItems(this.currentQuestionnaire.item[i].item, this.currentQuestionnaire.item[i].linkId);
        }
      }
    } else if (this.questionnaireUrl) {
      try {
        this.currentQuestionnaire = await fhirApi.fetchByUrl(this.questionnaireUrl);
        // Add Group-Ids to Questions in Groups
        for (let i = 0; i < this.currentQuestionnaire.item.length; i++) {
          if (this.currentQuestionnaire.item[i].type === 'group') {
            this.addGroupIdToItems(this.currentQuestionnaire.item[i].item, this.currentQuestionnaire.item[i].linkId);
          }
        }
      } catch (error) {
        //TODO Errorhandling
      }
    } else {
      //TODO handle missing Questionnaire | Spinner, info ...
    }
  }

  /**
   * Adds GroupId to all Questions inside a Group.
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
      let split = this.questionnaireResponse.questionnaire.split('/');
      let id = split[1];
      if (id === this.questionnaire.id) {
        this.currentQuestionnaireResponse = this.questionnaireResponse;
      } else {
        this.createQuestionnaireResponse();
      }
    } else {
      this.createQuestionnaireResponse();
    }
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
          this.currentValueSets.concat(await valueSetController.getValueSetsWithReferences(this.baseUrl, missingReferences));
        }
      }
    } else {
      try {
        // if (this.currentQuestionnaire && this.baseUrl) {
        this.currentValueSets = await valueSetController.getNewValueSets([this.currentQuestionnaire], this.baseUrl);
        // }
      } catch (error) {
        // console.log(error);
      }
    }
  }

  handleStartQuestion(question) {
    if (question && this.filteredItemList) {
      if (this.mode === 'GroupedQuestionnaire') {
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
    if (this.mode === 'GroupedQuestionnaire') {
      this.currentStartCount = this.questionnaire.item.findIndex(object => object.linkId === question.linkId);
    } else {
      this.currentStartCount = this.filteredItemList.findIndex(object => object.linkId === question.linkId);
    }

    if (this.currentStartCount < 0) {
      this.modal = true;
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

  async filterItemList() {
    let newList = [];
    if (this.currentQuestionnaireResponse && this.questionnaire) {
      // newList = await questionnaireResponseController.createItemList(this.currentQuestionnaire);
      newList = await questionnaireController.handleEnableWhen(this.currentQuestionnaireResponse, this.currentQuestionnaire.item);
    }
    this.filteredItemList = newList;
  }

  /**
   * Emits an Event wich includes the finished Questionnaire Response
   */
  finishQuestionnaire() {
    this.finished.emit(this.currentQuestionnaireResponse);
  }

  /**
   * Emits an Event to exit the Renderer
   */
  @Event() exit: EventEmitter;
  leaveQuestionnaireRenderer() {
    this.exit.emit(this.currentQuestionnaireResponse);
  }

  /* Lifecycle Methods */

  async componentWillLoad(): Promise<void> {
    try {
      this.strings = await getLocaleComponentStrings(this.element, this.locale);
      this.spinner = { ...this.spinner, loading: true };
      this.spinner = { ...this.spinner, message: this.strings.loading.questionnaire };
      await this.handleQuestionnaire();
      this.spinner = { ...this.spinner, message: this.strings.loading.valueset };
      await this.handleValueSets();
      this.spinner = { ...this.spinner, message: this.strings.loading.data };
      await this.handleQuestionnaireResponse();
      await this.filterItemList();
      this.handleAnsweredQuestionsList();
      this.currentMode = this.mode;
      this.handleStartQuestion(this.startQuestion);
      setTimeout(() => {
        this.spinner = { ...this.spinner, loading: false };
      }, 250);
    } catch (e) {
      console.error(e);
    }
  }
  render() {
    const Tag = this.mode;
    return (
      <div>
        {!this.modal ? (
          <Tag
            filteredItemList={this.filteredItemList}
            questionnaireResponse={this.currentQuestionnaireResponse}
            questionnaire={this.currentQuestionnaire}
            requiredQuestionList={this.answeredRequiredQuestionsList}
            valueSets={this.currentValueSets}
            lastQuestion={this.lastQuestion}
            startCount={this.currentStartCount}
            baseUrl={this.baseUrl}
            editMode={this.editMode}
            primary={this.primary}
            secondary={this.secondary}
            danger={this.danger}
            enableReturn={this.enableReturn}
            locale={this.locale}
            spinner={this.spinner}
            onSummary={() => this.backToSummary()}
            onFinished={() => this.finishQuestionnaire()}
            onReturn={() => this.leaveQuestionnaireRenderer()}
            onEmitAnswer={ev => this.handleQuestionnaireResponseEvent(ev)}
          ></Tag>
        ) : (
          // TODO does calc work like this?
          <div class="align-vertical" style={{ height: 'calc(100vh - 200px)' }}>
            <div class="note-modal">
              <div>
                <div>{this.strings.questionDeactivated}</div>
                <div class="button-container">
                  <button class="btn btn-primary" onClick={() => this.backToSummary()}>
                    {this.strings.backtoSummary}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
