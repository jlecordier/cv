"use strict";

var data;
var translations;
var structure;
var lang = "fr";
var censored = true;

Handlebars.registerHelper("age", function (ddn) {
    const date = new Date(ddn);
    const today = new Date();
    console.log(today);
    console.log(date);
    console.log(today-date);
    const age = new Date(today-date).getYear();
    console.log(new Date(today-date));
    console.log(age);
    return age;
});

const getTranslation = function (key) {
    console.log("key");
    console.log(key);
    console.log(lang);
    console.log(translations[key]);
    try {
        return translations[key][lang];
    } catch (TypeError) {
        return "error";
    }
}

Handlebars.registerHelper("i18n", getTranslation);

Handlebars.registerHelper("sensible", function (info) {
    if (censored) {
        return "[Censuré]";
    }
    return info;
});

Handlebars.registerHelper("list", function (items, options) {
    return items.map(item => options.fn(item)).join(options.hash["sep"]).replace(" ,", ",");
});

Handlebars.registerHelper("date", function (dateISO) {
    const date = new Date(dateISO);
    const dateString = date.toLocaleDateString();
    return dateString;
});

const getData = async function() {
    return await $.getJSON("data.json");
}

const getTranslations = async function() {
    return await $.getJSON("translation.json");
}

const getStructure = async function() {
    return await $.getJSON("structure.json");
}

const compile = async function() {
    data = await getData();
    translations = await getTranslations();
    structure = await getStructure();
    const templateData = {
        data: data,
        structure: structure,
        translations: translations
    };
    const body = document.getElementsByTagName("body")[0];
    const template = Handlebars.compile(body.innerHTML);
    const result = template(templateData);
    body.innerHTML = result;
    body.removeAttribute("hidden");
};

const getParam = function(name, defaultValue) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const param = urlSearchParams.get(name);
    if (param === null) {
        return defaultValue;
    }
    return param;
}

const getCensored = function(defaultValue) {
    const censoredParam = getParam("censored", undefined);
    switch (censoredParam) {
        case "on":
            return true;
        case "off":
            return false;
        default:
            return defaultValue;
    }
}

window.addEventListener("DOMContentLoaded", () => {
    lang = getParam("lang", "fr");
    censored = getCensored(true);
    compile().catch(err => console.error(err));
});
