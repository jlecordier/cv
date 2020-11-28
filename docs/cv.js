var data;
var translation;
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

Handlebars.registerHelper("i18n", function (key) {
    console.log("key");
    console.log(key);
    console.log(lang);
    console.log(translation[key]);
    try {
        return translation[key][lang];
    } catch (TypeError) {
        return "error";
    }
});

Handlebars.registerHelper("sensible", function (info) {
    if (censored) {
        return "[Censuré]";
    }
    return info;
});

const getData = async function() {
    return await $.getJSON("data.json");
}

const getTranslation = async function() {
    return await $.getJSON("translation.json");
}

const compile = async function() {
    data = await getData();
    translation = await getTranslation();
    const body = document.getElementsByTagName("body")[0];
    const template = Handlebars.compile(body.innerHTML);
    const result = template(data);
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
