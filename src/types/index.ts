export interface Coding {
  system?: string;
  code?: string;
  display?: string;
}

export interface Reference {
  reference?: string;
  display?: string;
}

export interface Identifier {
  system?: string;
  value?: string;
}

export interface Task {
  focus?: Reference;
  input?: Array<{
    type?: { coding?: Coding[] };
    valueReference?: Reference;
  }>;
  extension?: Array<{
    url?: string;
    valueString?: string;
  }>;
  partOf?: Reference[];
}

export interface Questionnaire {
  id?: string;
  url?: string;
  version?: string;
  identifier?: Identifier[];
}

export interface QuestionnaireResponse {
  id?: string;
}
