MY_NAME = "Evan M. Peck"
USE_ICONS = true
ICON_PATH =  "images/"
ICON_SIZE = 80

d3.json('pubs.json', function(d){
    renderPubs(d.publications, '#publications');
});

function renderPubs(d, target) {
  var div = d3.select(target);
  var pubs = div.selectAll('pub')
      .data(d);

  pubs.enter().append('div')
      .classed('pub', true);

  // Add icon
  if (USE_ICONS) {
    pubs
      .append('img')
      .classed('thumbnail', true)
      .attr('src', function(d) {
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

  // add links for supplementals
  pubInfo.append('div')
      .classed('supp', true)
      .html(function(d) {
        // First add paper pdf (if there is one)
        var supplementals = ''
        if (d.hasOwnProperty('pdf'))
          supplementals += '<a href="' + d.pdf + '"> pdf </a>';
        // then add everything else
        for (var link in d.supp) {
          supplementals += '| <a href="' + d.supp[link] + '"> ' + link + '</a> ';
        }
        return supplementals;
      });


  // award
  // pubInfo.filter(function(d) { return d.award || ''; })
  //     .append('div')
  //     .classed('award', true)
  //     .text(function(d) { return d.award; });
}
