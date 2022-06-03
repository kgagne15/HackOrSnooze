"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  if (currentUser) {
    return $(`
      <li id="${story.storyId}">
      <a class="btn btn-md">
        <i class="fa fa-regular fa-star"></i>
         </a>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
  } else{
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
  }
}



$newStorySubmit.on('click', async function(e){
  e.preventDefault();
  const author = $('#new-story-author').val();
  const title = $('#new-story-title').val(); 
  const url = $('#new-story-url').val(); 
  console.log(author, title, url)

  const story = {author, title, url}; 
  const newStory = await storyList.addStory(currentUser, story);
})

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


// function updateStoriesOnLogin(){

//   // console.log($allStoriesList.children()); 
//   for (let li of $allStoriesList.children()){
//     let star = $`<i class="fa fa-regular fa-star"></i>`
//   //   const star = `<div><a class="btn btn-md">
//   //   <i class="fa fa-regular fa-star"></i>
//   // </a></div>`
//     console.log(li);
//     li.prepend(star)
//   }
// }

