MY_NAME = "Evan M. Peck";
USE_ICONS = true;
ICON_PATH =  "images/";
ICON_SIZE = 95;

// Assumes that we are only going to have 10
var tagColor;

d3.json('pubs.json', function(d){
    createTypeColors(d.publications);
    renderPubs(d.publications, '#publications');
});

function createTypeColors(d) {
  var types = [];
  d.forEach(function(pub) {
    if (types.indexOf(pub.type) < 0) {
      types.push(pub.type);
    }
  });
  tagColor = d3.scale.category10().domain(types);
}

function renderPubs(d, target) {
  var div = d3.select(target);
  var pubs = div.selectAll('pub')
      .data(d);

  pubs.enter().append('div')
      .classed('pub', true);

  // representative image
  var pubIcon = pubs.append('img')
    .classed('thumbnail', true)
    .attr('src', function(d) {
      return ICON_PATH + d.thumbnail;
    })
    .attr('width', ICON_SIZE)
    .attr('height',ICON_SIZE);

  // tag that shows pub type
  pubs.append('text')
    .classed('type-tag', true)
    .text(function(d) { return d.type + ''; })
    .style('background-color', function(d) {
      return tagColor(d.type);
    })
    .style('opacity', 0.5);

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

  // Add award icon and text
  var awardIcon = pubInfo.selectAll('.title')
      .filter(function(d) { return d.award || ''});

  awardIcon.append('img')
      .classed('award-icon', true)
      .attr('src', 'icons/cert.png')
      .attr('width', 13);

  awardIcon.append('text')
    .classed('award-text', true)
    .text(function(d) { return d.award; });

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

  // add supplemental links
  pubInfo.append('text')
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


}
