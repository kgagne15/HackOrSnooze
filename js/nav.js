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
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
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
  $favoritesList.hide();
  $allStoriesList.hide();
  $newStoryForm.hide();
  $myList.show();
  getMyStories(currentUser);
})

$newStoryBtn.on('click', function(){
  $favoritesList.hide();
  $newStoryForm.show();
})

$favScreenBtn.on('click', function(){
  $newStoryForm.hide();
  hidePageComponents()
  $navLogOut.show();

  getFavoriteStories();

  // const userFavorites = [];
  // for (let fav of currentUser.favorites){
  //   userFavorites.push(fav.storyId)
  // }
  // console.log(userFavorites)
  // for (let fav of userFavorites) {
  //   const res = await axios({
  //     url: `${BASE_URL}/stories/${fav}`,
  //     method: "GET",
  //   });
  //   console.log(res, 'this is the response inner loop of fav')
  //   const favStory = {
  //     StoryId: res.data.story.storyId,
  //     Title: res.data.story.title,
  //     Author: res.data.story.author,
  //     Url: res.data.story.url,
  //     Username: res.data.story.username
  //   }
  //   console.log(favStory)
  //   const favorite = getFavoriteMarkup(favStory.StoryId, favStory.Title, favStory.Url, favStory.Author, favStory.Username);
  //   $favoritesList.append(favorite);
  // }
  $favoritesList.show();

})

async function getFavoriteStories(){
  const userFavorites = [];
  for (let fav of currentUser.favorites){
    userFavorites.push(fav.storyId)
  }
  console.log(userFavorites, 'look here')
  for (let fav of userFavorites) {
    console.log(fav);
    const res = await axios({
      url: `${BASE_URL}/stories/${fav}`,
      method: "GET",
    });
    //console.log(res, 'this is the response inner loop of fav')
    const favStory = {
      StoryId: res.data.story.storyId,
      Title: res.data.story.title,
      Author: res.data.story.author,
      Url: res.data.story.url,
      Username: res.data.story.username
    }
    console.log(favStory)
    const favorite = getFavoriteMarkup(favStory.StoryId, favStory.Title, favStory.Url, favStory.Author, favStory.Username);
    $favoritesList.append(favorite);
  }
}

async function getMyStories(user){
  console.log(user.ownStories);
  const myStories = [];
  for (let story of user.ownStories){
    const myStory = {
      StoryId: story.storyId,
      Title: story.title,
      Author: story.author,
      Url: story.url 
    }
    const myStoryMarkUp = getMyStoryMarkup(myStory.StoryId, myStory.Title, myStory.Author, myStory.Url)
    $myList.append(myStoryMarkUp);
  }
}