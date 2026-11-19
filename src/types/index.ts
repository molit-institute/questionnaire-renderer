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
  resourceType?: string;
  id?: string;
  meta?: any;
  status?: string;
  intent?: string;
  code?: {
    coding?: Coding[];
    text?: string;
  };
  focus?: Reference;
  for?: Reference;
  input?: Array<{
    type?: { coding?: Coding[] };
    valueReference?: Reference;
  }>;
  extension?: Array<{
    url?: string;
    valueString?: string;
  }>;
  partOf?: Reference[];
  executionPeriod?: {
    start?: string;
    end?: string;
  };
}

export interface Questionnaire {
  id?: string;
  url?: string;
  version?: string;
  title?: string;
  identifier?: Identifier[];
}

export interface QuestionnaireResponse {
  id?: string;
}
