var missions = $('.details').map(function(){
  var img = $(this).find('.mission-image').attr('src');
  var title = $(this).find('.mission-title-published,.mission-title-submitted,.mission-title-draft');
  var published = $(title).attr('class').indexOf('published') > 0 ? true : false;
  var draft = $(title).attr('class').indexOf('draft') > 0 ? true : false;
  var number = $(this).html().match(/[\(\[](.+)\/.+[\)\]]/i);
  number = number ? number[1]*1 : 1;
  return {
    title: $(title).html().trim(),
    number: number,
    published: published,
    draft: draft,
    img: img,
  }
});
var series = {};
$.each(missions, function(){
  var key = this.title.replace(/[\(\[].+[\)\]]/i, '').trim();
  if(!series[key]){
    series[key] = [ this ];
  }
  else {
    series[key].push(this);
  }
});
var html = "";
html = `
<html>
<head>
<title>Ingress Mission Summary</title>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.2.3/css/bulma.min.css">
<style>
  html { background-color: #000; }
  h1 { color: #FFF !important; }
  img.circle { border-radius: 50%; }
  img.bw {
    opacity: 0.5;
    -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
    filter: grayscale(100%);
  }
  .container {
    max-width: 1300px;
  }
</style>
</head>
<body>
<div class='container has-text-centered'>
<div class='content'>
`;
$.each(Object.keys(series).sort(), function(i, k){
  var rr = series[k];
  rr.sort(function(a, b){
    return a.number - b.number;
  });
  html += `<div class='columns is-desktop'>`;
  html += `<div class='column'>`;
  html += `<h1>`+ k +`</h1>`;
  var rrr = rr.slice(0).reverse();
  for(var i=1; i<=rrr.length; i++){
    var o = rrr[i-1];
    o.img = o.img.replace('s60-c', 's96-c');
    if(o.published){
      html += `<img title='`+ o.title +`' class='circle' src='`+ o.img +`' />`;
    }
    else {
      html += `<img title='`+ o.title +`' class='bw circle' src='`+ o.img +`' />`;
    }
    html += `&nbsp;&nbsp;`;
    if(i%6==0){
      html += '<br />';
    }
  }
  html += `</div>`;
  html += `<div class='column'>`;
  html += `<table class='table'>`;
  html += `<thead><tr><th>#</th><th>Title</th><th style='width: 100px;'>Status</th></tr></thead>`;
  $.each(rr, function(i, r){
    var status = '<span class="tag is-danger">Pending</span>';
    if(r.published){
      status = '<span class="tag is-success">Published</span>';
    }
    else if(r.draft){
      status = '<span class="tag is-warning">Draft</span>';
    }
    html += `<tr><td>`+ r.number +`</td><td>`+ r.title +`</td><td>`+ status +`</td></tr>`;
  });
  html += `</table>`;
  html += `</div>`;
  html += `</div>`;
});
html += `
</div>
</div>
</div>
</body>
</html>
`;
if(typeof(win) != "undefined"){ win.close(); }
win = window.open();
win.document.write(html);
