'use strict';
const templates = {
  articleLink: Handlebars.compile(
    document.querySelector('#template-article-link').innerHTML
  ),
  tagLink: Handlebars.compile(
    document.querySelector('#template-tag-link').innerHTML
  ),
  authorLink: Handlebars.compile(
    document.querySelector('#template-author-link').innerHTML
  ),
  tagCloudLink: Handlebars.compile(
    document.querySelector('#template-tag-cloud-link').innerHTML
  ),
  authorCloudList: Handlebars.compile(
    document.querySelector('#template-author-list').innerHTML
  ),
};
const opts = {
  tagSizes: {
    count: 5,
    classPrefix: 'tag-size-',
  },
};

const select = {
  all: {
    articles: '.post',
    linksTo: {
      tags: 'a[href^="#tag-"]',
      authors: 'a[href^="#author-"]',
    },
  },
  article: {
    title: '.post-title',
    tags: '.post-tags .list',
    author: '.post-author',
  },
  listOf: {
    titles: '.titles',
    tags: '.tags.list',
    authors: '.authors.list',
  },
};

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;

  /* remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */

  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.post');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');

  /* find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);

  /* add class 'active' to the correct article */

  targetArticle.classList.add('active');
}

function generateTitleLinks(customSelector = '') {
  /* remove contents of titleList */
  const titleList = document.querySelector(select.listOf.titles);
  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(
    select.all.articles + customSelector
  );

  let html = '';

  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    const articleTitle = article.querySelector(select.article.title).innerHTML;

    /* create HTML of the link */
    const linkHTMLData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);

    /* insert link into titleList */
    html += linkHTML;
  }
  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (opts.tagSizes.count - 1) + 1);

  return opts.tagSizes.classPrefix + classNumber;
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty array */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(select.all.articles);

  /* START LOOP: for every article: */

  for (let article of articles) {
    /* find tags wrapper */
    const tagList = article.querySelector(select.article.tags);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */

    for (let tag of articleTagsArray) {
      /* generate HTML of the link */
      // const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';

      const linkHTMLData = { id: tag, title: tag };
      const linkHTML = templates.tagLink(linkHTMLData);

      /* add generated code to html variable */
      html += linkHTML + ' ';

      /* [NEW] check if this link is NOT already in allTags */
      // if (allTags.indexOf(linkHTML) == -1) {
      //   /* [NEW] add generated code to allTags array */
      //   allTags.push(linkHTML);
      // }
      if (!allTags.hasOwnProperty(tag)) {
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */

    tagList.innerHTML = html;
    /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(select.listOf.tags);

  /* [NEW] add html from allTags to tagList */
  // tagList.innerHTML = allTags.join(' ');

  const tagsParams = calculateTagsParams(allTags);

  // let allTagsHTML = '';
  const allTagsData = { tags: [] };
  for (let tag in allTags) {
    // const tagLinkHTML = `<li class="${calculateTagClass(
    //   allTags[tag],
    //   tagsParams
    // )}"><a href="#tag-${tag}">${tag}</a></li>`; //<span> (${allTags[tag]})</span></li>
    // // allTagsHTML += `<li > <a href="#tag-${tag}">${tag}</a><span> (${allTags[tag]})</span></li>`;
    // allTagsHTML += tagLinkHTML;
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams),
    });
  }
  // tagList.innerHTML = allTagsHTML;
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */
  const tagActiveLinks = document.querySelectorAll(`a.active[href^="#tag-"]`);

  /* START LOOP: for each active tag link */
  for (let tagActiveLink of tagActiveLinks) {
    /* remove class active */
    tagActiveLink.classList.remove('active');

    /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */

  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */

  for (let tagLink of tagLinks) {
    /* add class active */

    tagLink.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */

  const allTagsLinks = document.querySelectorAll(select.all.linksTo.tags);
  /* START LOOP: for each link */

  for (let allTagsLink of allTagsLinks) {
    /* add tagClickHandler as event listener for that link */

    allTagsLink.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors() {
  let allAuthorsList = {};

  const articles = document.querySelectorAll(select.all.articles);

  for (let article of articles) {
    const authorWrapper = article.querySelector(select.article.author);

    let html = '';

    const articleAuthor = article.getAttribute('data-author');

    const linkHTMLData = { id: articleAuthor, title: articleAuthor };
    const linkHTML = templates.authorLink(linkHTMLData);

    if (!allAuthorsList.hasOwnProperty(articleAuthor)) {
      allAuthorsList[articleAuthor] = 1;
    } else {
      allAuthorsList[articleAuthor]++;
    }

    html += linkHTML;

    authorWrapper.innerHTML = html;
  }
  const authorList = document.querySelector(select.listOf.authors);

  // let authorListHTML = '';

  const allAuthorsData = { authors: [] };

  for (let author in allAuthorsList) {
    // authorListHTML +=
    //   '<li><a href="#author-' +
    //   author +
    //   '"><span>' +
    //   author +
    //   ' (' +
    //   allAuthorsList[author] +
    //   ')</span></a></li>';
    allAuthorsData.authors.push({
      author: author,
      count: allAuthorsList[author],
    });
  }
  // authorList.innerHTML = authorListHTML;
  authorList.innerHTML = templates.authorCloudList(allAuthorsData);
}

generateAuthors();

function authorClickHandler(event) {
  event.preventDefault();

  const clickedElement = this;

  const href = clickedElement.getAttribute('href');

  const author = href.replace('#author-', '');

  const authorActiveLinks = document.querySelectorAll(
    'a.active[href^="#author-"]'
  );

  for (let authorActiveLink of authorActiveLinks) {
    authorActiveLink.classList.remove('active');
  }

  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

  for (let authorLink of authorLinks) {
    authorLink.classList.add('active');
  }

  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  const allAuthorLinks = document.querySelectorAll(select.all.linksTo.authors);

  for (let allAuthorLink of allAuthorLinks) {
    allAuthorLink.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();

function calculateTagsParams(tags) {
  const params = {
    max: 0,
    min: 999999,
  };

  for (let tag in tags) {
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    }
    if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
}
