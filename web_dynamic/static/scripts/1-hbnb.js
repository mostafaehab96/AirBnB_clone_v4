'use strict';

$(document).ready(function () {
  const selectors = $('.amenity_select');
  let amenities = {};
  
  $.each(selectors, function(index, element) {
    $(element).click(function() {
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
});
