async function fetchLocaleStringsForComponent(componentName: string, locale: string, enableInformalLocale: boolean): Promise<any> {
  try {
    switch (locale.toLowerCase()) {
      case 'en': {
        const response = await import('../i18n/i18n.en.js');
        return response.default;
      }
      case 'es': {
        const response = await import('../i18n/i18n.es.js');
        return response.default;
      }
      case 'de': {
        if (enableInformalLocale) {
          const response = await import('../i18n/i18n.de-informal.js');
          return response.default;
        } else {
          const response = await import('../i18n/i18n.de.js');
          return response.default;
        }
      }
      default: {
        throw new TypeError('The provided locale (' + locale + ") wasn't valid");
      }
    }
  } catch (e) {
    console.error('An error occured while fetching the Language File for the Component (' + componentName + '): ' + e);
  }
}

export async function getLocaleComponentStrings(element: HTMLElement, componentLanguage: string, enableInformalLocale: boolean): Promise<any> {
  let componentName = element.tagName.toLowerCase();
  let strings;
  try {
    strings = await fetchLocaleStringsForComponent(componentName, componentLanguage, enableInformalLocale);
  } catch (e) {
    console.error('An error occured while fetching the resources: ' + e);
  }
  return strings;
}
