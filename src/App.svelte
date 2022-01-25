<script lang="ts">
  import data from "./data.json";
  import List from "./List.svelte";
  import structure from "./structure.json";
  import translations from "./translation.json";

  const getAgeFromBirthday = (birthday: string) => {
    const date = new Date(birthday);
    const today = new Date();
    const age = new Date(today.getTime() - date.getTime()).getFullYear() - 1970;
    return age;
  };

  const getTranslation = (key: string) => {
    try {
      return translations[key][lang];
    } catch (error) {
      if (error instanceof TypeError) {
        return key;
      }
    }
  };

  const getSensibleInformation = (info: string) => {
    return censored ? "[Censuré]" : info;
  };

  const getPercentageFromLevel = (level: number) => {
    return isNaN(level) ? 0 : (100 * level) / 5;
  };

  const getLocaleDateString = (
    dateISO: string,
    dateStyle: "medium" | "short" | "full" | "long"
  ) => {
    const date = new Date(dateISO);
    const dateString = date.toLocaleDateString(lang ? lang : "en", {
      dateStyle: lang ? dateStyle || "medium" : "short",
    });
    return dateString;
  };

  const getList = (items: any[], separator: string, fn = (x: any) => x) => {
    return items
      .map(fn)
      .join(separator)
      .replace(` ${separator}`, `${separator}`);
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
      case "on":
        return true;
      case "off":
        return false;
      default:
        return defaultValue;
    }
  };

  let lang = getParam("lang", "fr");
  let censored = getOnOffParam("censored", false);
  const printMode = getOnOffParam("print", true);
  if (!printMode) {
    document.querySelector("#print").removeAttribute("hidden");
  }

  const countriesBanningPicture = ["en"];

  const shouldShowPicture = !countriesBanningPicture.includes(lang);
</script>

<div id="cv">
  <section id="header" class="block">
    {#if shouldShowPicture}
      <img class="round shadow" src="images/profil.jpg" alt="profil" />
    {/if}
    <div class="">
      <h1 class="font-bold">
        {data["infos-perso"].prenom}
        {data["infos-perso"].nom}
      </h1>
      <div class="info-grid">
        <img
          class="icon rounded-sm shadow-sm"
          src="images/bootstrap-icons/envelope-fill.svg"
          alt="adresse"
        />
        <div class="info">
          {getSensibleInformation(data["infos-perso"].adresse)}
        </div>

        <img
          class="icon rounded-sm shadow-sm"
          src="images/bootstrap-icons/telephone-fill.svg"
          alt="telephone"
        />
        <div class="info">
          {getSensibleInformation(data["infos-perso"].tel)}
        </div>

        <img
          class="icon rounded-sm shadow-sm"
          src="images/bootstrap-icons/at.svg"
          alt="email"
        />
        <div class="info">
          <a href="mailto:{data['infos-perso'].email}">
            {data["infos-perso"].email}
          </a>
        </div>

        <img
          class="icon rounded-sm shadow-sm"
          src="images/linkedin-brands.svg"
          alt="linkedin"
        />
        <div class="info">
          <a href="http://www.{data['infos-perso'].linkedin}">
            {data["infos-perso"].linkedin}
          </a>
        </div>

        <img
          class="icon rounded-sm shadow-sm"
          src="images/birthday-cake-solid.svg"
          alt="date de naissance"
        />
        <div class="info">
          {getLocaleDateString(data["infos-perso"].ddn, "long")} ({getAgeFromBirthday(
            data["infos-perso"].ddn
          )}
          {getTranslation(structure.age)})
        </div>
      </div>
    </div>
    <div class="text-center">
      <h2 class="font-bold">{getTranslation(data.recherche.titre)}</h2>
      <h3 class="font-bold">{getTranslation(data.recherche.objet)}</h3>
      <span class="font-light font-italic">
        {getList(data.recherche.interets, " – ")}
      </span><br />
      {getTranslation(data.recherche.contexte)}<br />
      {getTranslation(structure.conjonctions.des)}
      {getLocaleDateString(data.recherche.dates.debut, "long")}<br />
      {#if data.recherche.lieux.presentiel.length > 0}
        {getList(data.recherche.lieux.presentiel, ", ", getTranslation)} ({getTranslation(
          "#presentiel"
        )})<br />
      {/if}
      {#if data.recherche.lieux.remote.length > 0}
        {getList(data.recherche.lieux.remote, ", ", getTranslation)} ({getTranslation(
          "#remote"
        )})<br />
      {/if}
      <!-- {getTranslation(data.recherche.permis.texte)} – {getTranslation(
        data.recherche.vehicule.texte
      )} -->
    </div>
  </section>

  <section id="skills" class="block">
    <h4 class="block-header">
      {getTranslation(structure.sections.competences)}
    </h4>
    <div class="skills">
      <fieldset id="soft-skills">
        <legend>{getTranslation(structure.competences.personnelles)}</legend>
        <div class="text-center">
          {getList(data.competences.personnelles, " • ", (x) =>
            getTranslation(x)
          )}
        </div>
      </fieldset>

      <fieldset id="dev-skills">
        <legend>{getTranslation(structure.competences.dev)}</legend>
        <div class="horizontal-skills-levels">
          {#each data.competences.dev as skill}
            <div class="language skill" style="text-align: right">
              {skill.langage}
            </div>

            {#if skill.niveau}
              <progress
                class="level"
                max="100"
                value={getPercentageFromLevel(skill.niveau)}
              />
            {/if}

            {#if skill.remarque}
              <div class="level text-center font-italic font-light">
                {getTranslation(skill.remarque)}
              </div>
            {/if}
          {/each}
        </div>
      </fieldset>

      <fieldset id="web-skills">
        <legend>{getTranslation(structure.competences.web)}</legend>
        <div class="vertical-skills-levels">
          {#each data.competences.web as skill}
            <div class="skill">
              <div>
                {getList(skill.technos, " • ")}
              </div>

              {#if skill.niveau}
                <progress
                  class="level"
                  max="100"
                  value={getPercentageFromLevel(skill.niveau)}
                />
              {/if}

              {#if skill.remarque}
                <div class="level font-italic font-light">
                  {getTranslation(skill.remarque)}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </fieldset>

      <fieldset id="notions">
        <legend>{getTranslation(structure.competences.notions)}</legend>
        <div class="vertical-skills-levels">
          {#each data.competences.notions as skill}
            <div class="skill">
              <div>
                {getTranslation(skill.notion)}
              </div>

              {#if skill.niveau}
                <progress
                  class="level"
                  max="100"
                  value={getPercentageFromLevel(skill.niveau)}
                />
              {/if}

              {#if skill.remarque}
                <div class="level font-italic font-light">
                  {getTranslation(skill.remarque)}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </fieldset>

      <fieldset id="tools">
        <legend>{getTranslation(structure.competences.outils)}</legend>
        <div class="text-center">
          {getList(data.competences.outils, " • ")}
        </div>
      </fieldset>

      <fieldset id="languages-skills">
        <legend>{getTranslation(structure.competences.langues)}</legend>
        <div class="icon-data-grid">
          {#each data.competences.langues as langue}
            <img
              class="icon round shadow-sm"
              src="images/{langue.code_iso}.png"
              alt={langue.langue}
            />
            <div class="data">
              {#each langue.niveau as niveau, i}
                {#if !i}
                  {getTranslation(niveau)}
                {:else}
                  <span class="font-italic">{getTranslation(niveau)}</span>
                {/if}
                <br />
              {/each}
            </div>
          {/each}
        </div>
      </fieldset>

      <fieldset>
        <legend>{getTranslation(structure.competences.os)}</legend>
        <div id="os">
          {#each data.competences.os as os}
            <img class="round shadow-sm" src="images/{os}.png" alt={os} />
          {/each}
        </div>
      </fieldset>
    </div>
  </section>

  <section id="education" class="block">
    <h4 class="block-header">{getTranslation(structure.sections.formation)}</h4>
    <div class="date-icon-data-grid">
      {#each data.formations as formation}
        <div class="date-icon-data-cell">
          <div class="header">
            <div class="date font-bold">
              <div>
                {formation.dates.fin}
              </div>
              <div>
                {formation.dates.debut}
              </div>
            </div>

            <div class="icon">
              <img
                src="images/{formation.id}.png"
                alt={formation.id}
                class="round shadow-sm"
              />
            </div>
          </div>
          <div class="data">
            {getTranslation(formation.formation)}
            {getTranslation(formation.ecole)}<br />

            {#if formation.departement}
              {getTranslation(formation.departement)}<br />
            {/if}

            {getTranslation(formation.specialite)}<br />

            {#if formation.cours}
              <span class="font-italic">
                {getList(formation.cours, " – ", (x) => getTranslation(x))}
              </span><br />
            {/if}

            {#if formation.mention}
              {getTranslation(formation.mention)}<br />
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <section id="projects" class="block">
    <h4 class="block-header">{getTranslation(structure.sections.projets)}</h4>
    <div class="icon-data-grid">
      {#each data.projets as projet}
        <img
          src="images/{projet.id}.png"
          alt={projet.id}
          class="icon round shadow-sm"
        />

        <div class="data">
          {getTranslation(projet.projet)}<br />
          <span class="font-italic">
            {#if projet.temps}
              {getTranslation(projet.temps)} –
            {/if}

            {#if projet.contexte}
              {getTranslation(projet.contexte)} –
            {/if}

            {#if projet.employeur}
              {projet.employeur} –
            {/if}

            {getList(projet.technos, " – ")}
          </span><br />
        </div>
      {/each}
    </div>
    <div class="font-italic font-light">
      {getTranslation("#more")}
    </div>
  </section>

  <section id="jobs" class="block">
    <h4 class="block-header">
      {getTranslation(structure.sections.experiences)}
    </h4>
    <div class="date-icon-data-grid">
      {#each data.experiences as experience}
        <div
          class="date-icon-data-cell {experience.annee ? 'single-date' : ''}"
        >
          <div class="header">
            <div class="date font-bold">
              {#if experience.annee}
                <div class="">
                  {experience.annee}
                </div>
              {/if}

              {#if experience.annees}
                <div>
                  {experience.annees.fin}
                </div>
                <div>
                  {experience.annees.debut}
                </div>
              {/if}
            </div>

            <div class="icon">
              <img
                src="images/{experience.id}.png"
                alt={experience.id}
                class="round shadow-sm"
              />
            </div>
          </div>

          <div class="data">
            <List
              items={experience.experience}
              separator={"<br />"}
              transformer={(x) => getTranslation(x)}
            /><br />
            <span class="font-italic">
              {#if experience.duree}
                {getTranslation(experience.duree)}
                {#if experience.contexte} – {/if}
              {/if}

              {#if experience.contexte}
                {getTranslation(experience.contexte)} –
              {/if}

              {#if experience.employeur}
                {experience.employeur}
              {/if}

              {#if experience.technos}
                – {getList(experience.technos, " – ", (x) => getTranslation(x))}
              {/if}
            </span><br />
          </div>
        </div>
      {/each}
    </div>
  </section>

  <section id="interests" class="block">
    <h4 class="block-header">{getTranslation(structure.sections.interets)}</h4>
    <div class="title-data-grid">
      {#each data.interets as interest}
        <div class="title font-bold">
          {getTranslation(interest.interet)}
        </div>

        <div class="data">
          {#each interest.liste as interet, i}
            {getTranslation(interet.nom)}
            {#if interet.details}
              <span class="font-italic font-light">
                ({getTranslation(interet.details)})
              </span>
            {/if}
            {#if i < interest.liste.length - 1} •&nbsp;{/if}
          {/each}
        </div>
      {/each}
    </div>
  </section>
</div>

<style>
  /* main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  } */
</style>
