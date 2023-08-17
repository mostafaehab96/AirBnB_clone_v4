'use strict';

$(document).ready(function () {
  const selectors = $('.amenity_select');
  const amenities = {};

  $.each(selectors, function (index, element) {
    $(element).click(function () {
      const id = $(this).attr('data-id');
      if ($(this).prop('checked')) {
        amenities[id] = $(this).attr('data-name');
      } else {
        delete amenities[id];
      }
      let text = Object.values(amenities).toString();
      if (text.length > 30) {
        text = text.slice(0, 30) + '...';
      }
      $('.amenities h4').text(text);
    });
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
      $('div#api_status').removeClass('unavailable');
    } else {
      $('div#api_status').removeClass('available');
      $('div#api_status').addClass('unavailable');
    }
  });
  const articles = $('section#places');

  $.ajax('http://0.0.0.0:5001/api/v1/places_search/', {
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function (data) {
      $.each(data, function (index, place) {
        const titleBox = `
        <div class="title_box">
          <h2>${place.name}</h2>
          <div class="price_by_night">$${place.price_by_night}</div>
        </div>`;
        const guestString = place.max_guest != 1 ? 'Guests' : 'Guest';
        const bedroomString = place.number_rooms != 1 ? 'Bedrooms' : 'Bedroom';
        const bathroomString = place.number_bathrooms != 1 ? 'Bathrooms' : 'Bathroom';
        const information = `
        <div class="information">
            <div class="max_guest">${place.max_guest} ${guestString}</div>
            <div class="number_rooms">${place.number_rooms} ${bedroomString}</div>
            <div class="number_bathrooms">${place.number_bathrooms} ${bathroomString}</div>
        </div>`;
        // be careful from xss attack | safe in jinja
        const description = `
        <div class="description">
          ${place.description}
        </div>`;
        const article = `
        <article>
          ${titleBox}
          ${information}
          ${description}
        </article>`;
        articles.append(article);
      });
    }
  });
});
