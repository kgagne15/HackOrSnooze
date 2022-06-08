"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  $favoritesList.hide();
  $newStoryForm.hide();
  $myList.hide();
  getAndShowStoriesOnStart(); 
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $myStoriesBtn.hide();
  $newStoryBtn.hide();
  $favScreenBtn.hide();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

$myStoriesBtn.on('click', function(){
  $myList.empty();
  $favoritesList.hide();
  $allStoriesList.hide();
  $newStoryForm.hide();
  $myList.show();
  getMyStories();
})

$newStoryBtn.on('click', function(){
  $favoritesList.hide();
  $allStoriesList.hide(); 
  $myList.hide();
  $newStoryForm.show();
})

$favScreenBtn.on('click', function(){
  $favoritesList.empty();
  $newStoryForm.hide();
  hidePageComponents()
  $navLogOut.show();
  $myList.hide();
  getFavoriteStories();
  $favoritesList.show();
})

async function getFavoriteStories(){
  const userFavorites = [];
  for (let fav of currentUser.favorites){
    userFavorites.push(fav.storyId)
  }
  for (let fav of userFavorites) {
    const res = await axios({
      url: `${BASE_URL}/stories/${fav}`,
      method: "GET",
    });
    const favStory = {
      StoryId: res.data.story.storyId,
      Title: res.data.story.title,
      Author: res.data.story.author,
      Url: res.data.story.url,
      Username: res.data.story.username
    }
    const favorite = getFavoriteMarkup(favStory.StoryId, favStory.Title, favStory.Url, favStory.Author, favStory.Username);
    $favoritesList.append(favorite);
  }
}

async function getMyStories(){
  const myStories = []; 
  for (let story of currentUser.ownStories) {
    //console.log(story.storyId);
    myStories.push(story.storyId);
  }
  //console.log(myStories.length);
  if (myStories.length >= 1) {
    for (let story of myStories) {
      const res = await axios({
        url: `${BASE_URL}/stories/${story}`,
        method: "GET",
      });
      const myStory = {
        StoryId: res.data.story.storyId,
        Title: res.data.story.title,
        Author: res.data.story.author,
        Url: res.data.story.url,
        Username: res.data.story.username
      }
      const ownStory = getMyStoryMarkup(myStory.StoryId, myStory.Title, myStory.Url, myStory.Author, myStory.Username);
      $myList.append(ownStory);
    }
  } else if (myStories.length === 0) {
    let $item = $(`
    <h3>No Stories Posted Yet</h3>
    `);
    $myList.append($item);
  }
}
