MY_NAME = "Evan M. Peck"
USE_ICONS = true
ICON_PATH =  "images/"
ICON_SIZE = 70

d3.json('pubs.json', function(d){
    renderPubs(d.publications, '#publications');
});


function renderPubs(d, target){
  var div = d3.select(target);

  var pubs = div.selectAll('publications')
      .data(d)
      .enter().append('div')
        .classed('pub', true);

  // Add icon
  if (USE_ICONS) {
    pubs.append('img')
      .classed('thumbnail', true)
      .attr('src', function(d) {
        console.log(ICON_PATH + d.thumbnail);
        return ICON_PATH + d.thumbnail;
      })
      .attr('width', ICON_SIZE)
      .attr('height',ICON_SIZE);
  }

// Div for all the publication info
  var pubInfo = pubs.append('div')
    .classed('pubInfo', true)
    .style('height',ICON_SIZE);

  // title
  var titles = pubInfo.append('div')
      .classed('title', true)
      .append('a')
      .attr('href', function(d) { return d.pdf; })
      .text(function(d) { return d.title; });

  //authors
  pubInfo.append('div')
      .classed('authors', true)
      .html(function(d) {
        return d.author.join(", ")
                       .replace(MY_NAME, '<span class="me">' + MY_NAME + '</span>');
      });

  // venue, year
  pubInfo.append('div')
      .classed('venue', true)
      .text(function(d) { return d.venue + ' '+ d.year; });

  // award
  // pubInfo.filter(function(d) { return d.award || ''; })
  //     .append('div')
  //     .classed('award', true)
  //     .text(function(d) { return d.award; });
}
