"use strict";

var data;
var translations;
var structure;
var lang = "fr";
var censored = false;

Handlebars.registerHelper("age", function (ddn) {
    const date = new Date(ddn);
    const today = new Date();
    const age = new Date(today-date).getFullYear()-1970;
    return age;
});

const getTranslation = function (key) {
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

Handlebars.registerHelper("progress-width", function (value) {
    if (!isNaN(value)) {
        return 100*value/5;
    }
    return 0;
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
    const body = document.getElementById("cv");
    const htmlTemplate = document.getElementById("template");
    const template = Handlebars.compile(htmlTemplate.innerHTML);
    const result = template(templateData);
    body.innerHTML = result;
};

const getParam = function(name, defaultValue) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const param = urlSearchParams.get(name);
    if (param === null) {
        return defaultValue;
    }
    return param;
}

const getOnOffParam = function(name, defaultValue) {
    const onOffParam = getParam(name, undefined);
    switch (onOffParam) {
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
    censored = getOnOffParam("censored", false);
    const printMode = getOnOffParam("print", true);
    if (!printMode) {
        document.getElementById("print").removeAttribute("hidden");
    }
    compile().catch(err => console.error(err));
});
