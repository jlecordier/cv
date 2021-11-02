'use strict';

var Handlebars;
var $;

var data;
var translations;
var structure;
var lang = 'fr';
var censored = false;

Handlebars.registerHelper('age', ddn => {
  const date = new Date(ddn);
  const today = new Date();
  const age = new Date(today.getTime() - date.getTime()).getFullYear() - 1970;
  return age;
});

const getTranslation = key => {
  try {
    return translations[key][lang];
  } catch (TypeError) {
    return key;
  }
};

Handlebars.registerHelper('i18n', getTranslation);

Handlebars.registerHelper('sensible', info => {
  if (censored) {
    return '[Censuré]';
  }
  return info;
});

Handlebars.registerHelper('progress-width', value => {
  if (!isNaN(value)) {
    return 100 * value / 5;
  }
  return 0;
});

Handlebars.registerHelper('list', (items, options) => {
  return items
    .map(item => options.fn(item))
    .join(options.hash['sep'])
    .replace(' ,', ',');
});

Handlebars.registerHelper('date', (dateISO, options) => {
  const date = new Date(dateISO);
  const dateString = date.toLocaleDateString(lang ? lang : 'en', { dateStyle: lang ? options?.hash['dateStyle'] || 'medium' : 'short' });
  return dateString;
});

const getData = async () => {
  return await $.getJSON('data.json');
};

const getTranslations = async () => {
  return await $.getJSON('translation.json');
};

const getStructure = async () => {
  return await $.getJSON('structure.json');
};

const compile = async () => {
  data = await getData();
  translations = await getTranslations();
  structure = await getStructure();
  const templateData = {
    data: data,
    structure: structure,
    translations: translations
  };
  const body = document.getElementById('cv');
  const htmlTemplate = document.querySelector('#template');
  const template = Handlebars.compile(htmlTemplate.innerHTML);
  const result = template(templateData);
  body.innerHTML = result;
};

const getParam = (name, defaultValue) => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const param = urlSearchParams.get(name);
  if (param === null) {
    return defaultValue;
  }
  return param;
};

const getOnOffParam = (name, defaultValue) => {
  const onOffParam = getParam(name, undefined);
  switch (onOffParam) {
    case 'on':
      return true;
    case 'off':
      return false;
    default:
      return defaultValue;
  }
};

window.addEventListener('DOMContentLoaded', () => {
  lang = getParam('lang', 'fr');
  censored = getOnOffParam('censored', false);
  const printMode = getOnOffParam('print', true);
  if (!printMode) {
    document.querySelector('#print').removeAttribute('hidden');
  }
  compile().catch(err => console.error(err));
});
