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

function getMyStoryMarkup(storyId, title, url, author) {
  return $(`
      <li id="${storyId}">
      <a class="btn btn-md trash">
        <i class="fas fa-trash-alt"></i>
         </a>
        <a href="${url}" target="a_blank" class="story-link">
          ${title}
        </a>
        <small class="story-hostname">(hostname.com)</small>
        <small class="story-author">by ${author}</small>
      </li>
    `);
}

function getFavoriteMarkup(storyId, title, url, author, username){
  return $(`
      <li id="${storyId}">
      <a class="btn btn-md star">
        <i class="fa-star fas"></i>
         </a>
        <a href="${url}" target="a_blank" class="story-link">
          ${title}
        </a>
        <small class="story-hostname">(hostname.com)</small>
        <small class="story-author">by ${author}</small>
        <small class="story-user">posted by ${username}</small>
      </li>
    `);
}

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  if (currentUser) {
    const favIds = []; 
    for (let fav of currentUser.favorites){
      favIds.push(fav.storyId)
    }

    if (favIds.includes(story.storyId)){
      return $(`
        <li id="${story.storyId}">
        <a class="btn btn-md star">
          <i class="fa-star fas"></i>
          </a>
          <a href="${story.url}" target="a_blank" class="story-link">
            ${story.title}
          </a>
          <small class="story-hostname">(${hostName})</small>
          <small class="story-author">by ${story.author}</small>
          <small class="story-user">posted by ${story.username}</small>
        </li>
      `);
    } else {
      return $(`
        <li id="${story.storyId}">
        <a class="btn btn-md star">
          <i class="fa-star far"></i>
          </a>
          <a href="${story.url}" target="a_blank" class="story-link">
            ${story.title}
          </a>
          <small class="story-hostname">(${hostName})</small>
          <small class="story-author">by ${story.author}</small>
          <small class="story-user">posted by ${story.username}</small>
        </li>
      `);
    }
    
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

$myList.on('click', '.trash', function(e){
  let $item = $(e.target);
  let $closestLi = $item.closest('li');
  let storyId = $closestLi.attr('id');
  //console.log(storyId, 'storyId of story to delete')
  deleteStory(currentUser, storyId);
  
})

async function deleteStory(user, storyId){
  const token = user.loginToken;
  console.log(user.ownStories, 'BEFORE')
  for (let i = 0; i < user.ownStories.length; i++) {
    console.log(user.ownStories[i].storyId);
    if (user.ownStories[i].storyId === storyId) {
      user.ownStories.splice(i, 1);

    } 
    
  }
  console.log(user.ownStories, 'AFTER')

  //console.log(user.ownStories, storyId)
  const res = await axios({
    url: `${BASE_URL}/stories/${storyId}`,
    method: "DELETE",
    data: {token}
  });
 $myList.empty();
   getMyStories();
}

$allStoriesList.on('click', '.star', function(e){
  //console.log(e.target, 'e.target here')
  let $item = $(e.target);
  let $closestLi = $item.closest('li');
  let storyId = $closestLi.attr('id');
  //toggleFav(currentUser, storyId);
  //console.log(storyId)
  //console.log(currentUser.favorites.storyId)

  const favIds = []; 
  for (let fav of currentUser.favorites){
    favIds.push(fav.storyId)
  }
  //console.log('favIds', favIds)

  if (favIds.includes(storyId)) {
    removeFav(currentUser, storyId)
    console.log('i\'ve removed this as a favorite')
    $item.removeClass('fas').addClass('far'); 
  } else {
    console.log('this is not a favorite yet, I\'ll add it')
    addFav(currentUser, storyId)
    $item.removeClass('far').addClass('fas');
  }

})

$favoritesList.on('click', '.star', function(e){
  //console.log(e.target, 'e.target here')
  let $item = $(e.target);
  let $closestLi = $item.closest('li');
  let storyId = $closestLi.attr('id');
  //toggleFav(currentUser, storyId);
  //console.log(storyId)
  //console.log(currentUser.favorites.storyId)

  const favIds = []; 
  for (let fav of currentUser.favorites){
    favIds.push(fav.storyId)
  }
  //console.log('favIds', favIds)

  if (favIds.includes(storyId)) {
    removeFav(currentUser, storyId)
    console.log('i\'ve removed this as a favorite')
    $item.removeClass('fas').addClass('far'); 
  } else {
    console.log('this is not a favorite yet, I\'ll add it')
    addFav(currentUser, storyId)
    $item.removeClass('far').addClass('fas');
  }


})





async function addFav(user, storyId){
  //console.log(user.loginToken, storyId)
  const token = user.loginToken;
  const res =  await axios({
    url: `${BASE_URL}/users/${user.name}/favorites/${storyId}`,
    method: "POST",
    data: {token}
  });
  console.log(res);
  
  user.favorites.push(res.data.user.favorites[res.data.user.favorites.length-1])
}

async function removeFav(user, storyId){
  //console.log(user.loginToken, storyId)
  const token = user.loginToken;
  const res =  await axios({
    url: `${BASE_URL}/users/${user.name}/favorites/${storyId}`,
    method: "DELETE",
    data: {token}
  });
  
  user.favorites.pop(res.data.user.favorites[0])
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

  $myList.empty(); 
  $favoritesList.empty();
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

