// When the DOM is ready
$(document).ready(function() {
    // For each <svg-icon> element
    $('svg-icon').each(function() {
      var $svgIcon = $(this);
      var src = $svgIcon.attr('src');
  
      // Load the SVG file
      $.get(src, function(data) {
        // Find the SVG element in the loaded content
        var $svgContent = $(data).find('svg');
  
        // Remove the <style> element from the SVG content
        $svgContent.find('style').remove();
  
        // Add the class "svg_icon" to the SVG element
        $svgContent.addClass('svg_icon');
  
        // Replace <svg-icon> with the modified SVG content
        $svgIcon.replaceWith($svgContent);
      }, 'xml');
    });
  });

//Thanks ChatGPT...