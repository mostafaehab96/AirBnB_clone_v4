'use strict';

$(document).ready(function () {
 
  function filter(selector, inputs) {
    const filtered = {};
    $.each(inputs, function (index, element) {
      $(element).click(function () {
        const id = $(this).attr('data-id');
        if ($(this).prop('checked')) {
          filtered[id] = $(this).attr('data-name');
        } else {
          delete filtered[id];
        }
        let text = Object.values(filtered).toString();
        if (text.length > 30) {
          text = text.slice(0, 30) + '...';
        }
        $(selector + ' h4').text(text);
      });
    });

    return filtered;
  }
  let inputs = $('.amenity_selector');
  const amenities = filter('.amenities', inputs);
  inputs = $('.state_select');
  const states = filter('.locations', inputs);
  inputs = $('.city_select');
  const cities = filter('.locations', inputs);

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
  function display (data) {
    articles.empty();
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
  $.ajax('http://0.0.0.0:5001/api/v1/places_search/', {
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: display
  });
  $('button').click(function () {
    $.ajax('http://0.0.0.0:5001/api/v1/places_search/', {
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ 
                              amenities: Object.keys(amenities),
                              cities: Object.keys(cities),
                              states: Object.keys(states)
                            }),
      success: display
    });
  });
});
