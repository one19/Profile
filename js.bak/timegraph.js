var layers = [];
d3.text("timelines.csv", function(text) {
  var csv = d3.csv.parseRows(text);
  layers = buildLayers(csv);
});

function buildLayers(csv) {
  var root = [[],[],[],[],[]];
  for (var i = 1; i < csv.length; i++) {
    root[0].push({x: parseInt(csv[i][0]), y: parseInt(csv[i][1]), y0: 0});
    root[1].push({x: parseInt(csv[i][0]), y: parseInt(csv[i][2]), y0: parseInt(csv[i][1])});
    root[2].push({x: parseInt(csv[i][0]), y: parseInt(csv[i][3]), y0: parseInt(csv[i][1]) + parseInt(csv[i][2])});
    root[3].push({x: parseInt(csv[i][0]), y: parseInt(csv[i][4]), y0: parseInt(csv[i][1]) + parseInt(csv[i][2]) + parseInt(csv[i][3])});
    root[4].push({x: parseInt(csv[i][0]), y: parseInt(csv[i][5]), y0: parseInt(csv[i][1]) + parseInt(csv[i][2]) + parseInt(csv[i][3]) + parseInt(csv[i][4])});
  }
};

var n = 5, // number of layers
  m = 50, // number of samples per layer
  stack = d3.layout.stack(),
  yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
  yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

var margin = {top: 40, right: 10, bottom: 20, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
          .domain(d3.range(m))
          .rangeRoundBands([0, width], .08);

var y = d3.scale.linear()
          .domain([0, yStackMax])
          .range([height, 0]);

var color = d3.scale.linear()
              .domain([0, n - 1])
              .range(["#aad", "#556"]);

var xAxis = d3.svg.axis()
              .scale(x)
              .tickSize(0)
              .tickPadding(6)
              .orient("bottom");

var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var layer = svg.selectAll(".layer")
                .data(layers)
              .enter().append("g")
                .attr("class", "layer")
                .style("fill", function(d, i) { return color(i); });

var rect = layer.selectAll("rect")
                .data(function(d) { return d; })
              .enter().append("rect")
                .attr("x", function(d) { return x(d.x); })
                .attr("y", height)
                .attr("width", x.rangeBand())
                .attr("height", 0);

rect.transition()
    .delay(function(d, i) { return i * 10; })
    .attr("y", function(d) { return y(d.y0 + d.y); })
    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

d3.selectAll("input").on("change", change);

var timeout = setTimeout(function() {
  d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
}, 2000);

function change() {
  clearTimeout(timeout);
  if (this.value === "grouped") transitionGrouped();
  else transitionStacked();
}

function transitionGrouped() {
  y.domain([0, yGroupMax]);

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
      .attr("width", x.rangeBand() / n)
    .transition()
      .attr("y", function(d) { return y(d.y); })
      .attr("height", function(d) { return height - y(d.y); });
}

function transitionStacked() {
  y.domain([0, yStackMax]);

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.y0 + d.y); })
      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
    .transition()
      .attr("x", function(d) { return x(d.x); })
      .attr("width", x.rangeBand());
}