
let people;
$('.overlay-container').hide();

//data.results is an array of 12 objects reprsenting each person
fetch("https://randomuser.me/api/?results=12&nat=au").then(result => result.json()).then(data => {
  people = data.results;
  display();
});

function display() {
  console.log(people);
  people.forEach((person, index) => {
    let cardDiv = $('<div>', {class: 'card'});
    let imageElement = $('<img />', {src: person.picture.medium});
    let detailsDiv = $('<div>', {class: 'details'});
    let span1 = $(`<span class='name'>${person.name.first} ${person.name.last}</span>`);
    let span2 = $(`<span class='email'>${person.email}</span>`);
    let span3 = $(`<span class='city'>${person.location.city}</span>`);

    detailsDiv.append(span1, span2, span3);
    cardDiv.append(imageElement, detailsDiv);
    cardDiv.data("current", index);
    $('.container').append(cardDiv);
    people[index].display = true;

  });
  $('.card').click(function() {
    let current = $(this).data("current");
    displayDetails(current);
  });
}

function displayDetails(current) {
  if (current < 0 || current >= people.length) {
    return;
  }
  let person = people[current];
  console.log(person);
  let popupDiv = $('<div>', {class: 'popup'});
  let imageElement = $('<img />', {src: person.picture.large});
  let name = $(`<span class='name'>${person.name.first} ${person.name.last}</span>`);
  let email = $(`<span class='email'>${person.email}</span>`);
  let city = $(`<span class='city'>${person.location.city}</span>`);
  let line = $(`<div class="line"></div>`);
  let phone = $(`<span class="phone">${person.phone}</span>`);
  let address = $(`<span class="address">${person.location.street}</span>`);
  let state = $(`<span class="state">${person.location.state} ${person.location.postcode}</span>`);
  let birthday = $(`<span class="birthday">Birthday:${new Date(Date.parse(person.dob.date)).toLocaleDateString(navigator.language)}</span>`);
  let closeButton = $(`<i class="far fa-times-circle close"></i>`);

  popupDiv.append(imageElement, name, email, city, line, phone, address, state, birthday, closeButton);

  $('.popup-container').append(popupDiv);
  updateNextArrow(findNextVisibleCard(current));
  updatePreviousArrow(findPreviousVisibleCard(current));
  $('.overlay-container').show();
  $('.close').click(function() {
    $('.popup-container').empty();
    $('.overlay-container').hide();
  });
  $('.next').click(function() {
    $('.popup-container').empty();
    let r = findNextVisibleCard(current);
    updateNextArrow(r);
    displayDetails(r);
  });
  $('.previous').click(function() {
    $('.popup-container').empty();
    let r = findPreviousVisibleCard(current);
    updatePreviousArrow(r);
    displayDetails(r);
  });
}

function updateNextArrow(current){
  let nextButton = $(`<i class="far fa-arrow-alt-circle-right next"></i>`);
  let popupDiv = $('.popup');

  if (current!==-1) {
    popupDiv.append(nextButton);
  }else{
    $('.next').remove();
  }

}

function updatePreviousArrow(current){
  let previousButton = $(`<i class="far fa-arrow-alt-circle-left previous"></i>`);
  let popupDiv = $('.popup');


  if (current !== -1) {
    popupDiv.append(previousButton);
  }else{
    $('.previous').remove();
  }
}

function findPreviousVisibleCard(current){
  for(let i=current-1;i>=0;i--){
    if(people[i].display===true){
      return i;
    }
  }
  return -1;
}

function findNextVisibleCard(current){
  for(let i=current+1;i<people.length;i++){
    if(people[i].display){
      return i;
    }
  }
  return -1;
}

//Search functionality
$("#txtSearch").on('keyup',function(){
  let phrase = $(this).val();
  $('.card').each(function(){
    let name = $(this).find('.details').find('.name').text();
    let $card = $(this);
    if(name.includes(phrase)){
      $card.show();
    }else{
      $card.hide();
    }
    updatePeople(phrase);
  });
});

function updatePeople(name){
  people.forEach((person,index)=>{
    let currentName = `${person.name.first} ${person.name.last}`;
    if(currentName.includes(name)){
      people[index].display = true;
    }else{
      people[index].display = false;
    }
  });
}
