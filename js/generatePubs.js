MY_NAME = "Evan M. Peck";

// DISPLAY OPTIONS -------
SHOW_THUMBNAILS = true;
SHOW_TYPE_TAGS = true;
SHOW_YEAR_HEADINGS = true;
// Note that this is still organized by year,
// so it doesn't make sense for this to be true
// and SHOW_YEAR_HEADINGS to be false.
SHOW_TYPE_HEADINGS = false;
//-------------------------

// The order the that types are grouped during each year
GROUP_ORDER = ['dissertation', 'journal', 'conference', 'chapter', 'workshop', 'poster', 'article', 'demo'];

ICON_PATH =  "images/";
ICON_SIZE = 95;

// Assumes that we are only going to have 10
var tagColor;

d3.json('pubs.json', function(json){
    createTypeColors(json.publications);

    var nested_data = d3.nest()
      .key(function(d) {return d.year;})
        .sortKeys(d3.descending)
      .key(function(d) {return d.type;})
        .sortKeys(function(a,b) { return GROUP_ORDER.indexOf(a) - GROUP_ORDER.indexOf(b); })
      .entries(json.publications);

    buildYears(nested_data, '#publications');
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

// Organize by year of publication
function buildYears(pubData, target) {
  var years = d3.select(target).selectAll('.yearGroup')
    .data(pubData)
    .enter().append('div')
    .classed('yearGroup', true);

  if (SHOW_YEAR_HEADINGS)
    years.append('h2').text(function(d) {return d.key; });

  years.each(buildTypes);
}

// Organize by type of publication
function buildTypes() {
  var types = d3.select(this).selectAll('.typeGroup')
    .data(function(d) {return d.values; })
    .enter().append('div')
    .classed('typeGroup', true);

  if (SHOW_TYPE_HEADINGS)
    types.append('h3').text(function(d) { return d.key; });
  types.each(renderPubs);
}

// Generate publications
function renderPubs(pubData, target) {
  var pubs = d3.select(this).selectAll('pub')
      .data(function(d) {return d.values;});

  pubs.enter().append('div')
      .classed('pub', true);

  if (SHOW_THUMBNAILS) {
    // representative image
    var pubIcon = pubs.append('img')
      .classed('thumbnail', true)
      .attr('src', function(d) {
        return ICON_PATH + d.thumbnail;
      })
      .attr('width', ICON_SIZE)
      .attr('height',ICON_SIZE);
  }

  if (SHOW_TYPE_TAGS) {
    // tag that shows pub type
    pubs.append('text')
      .classed('type-tag', true)
      .text(function(d) { return d.type + ''; })
      .style('background-color', function(d) {
        return tagColor(d.type);
      })
      .style('opacity', 0.5);
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
      else
        supplementals += ''

      // then add everything else
      for (var link in d.supp) {
        supplementals += '| <a href="' + d.supp[link] + '"> ' + link + '</a> ';
      }
      return supplementals;
    });
}
