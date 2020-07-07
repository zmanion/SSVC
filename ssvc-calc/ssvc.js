/* SSVC code for graph building */
const _version = 2.8
var showFullTree = false
var diagonal,tree,svg,duration,root
var treeData = []
/* Extend jQuery to support simulate D3 click events */
jQuery.fn.simClick = function () {
    this.each(function (i, e) {
	var evt = new MouseEvent("click");
	e.dispatchEvent(evt);
    });
};
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
    if(localStorage.getItem("beenhere")) {
	tooltip_cycle_through()
    } else {
	$('#helper').show()
	localStorage.setItem("beenhere",1)
    }
    load_tsv_score()
})
var raw = [
    {name:"Exploitation",id:254,children:[],parent:null,props:"{}"},
    {name:"Virulence:none",id:1,children:[],parent:"Exploitation",props:"{}"},
    {name:"Virulence:poc",id:2,children:[],parent:"Exploitation",props:"{}"},
    {name:"Virulence:active",id:3,children:[],parent:"Exploitation",props:"{}"},
    {name:"Technical Impact:none:slow",id:4,children:[],parent:"Virulence:none",props:"{}"},
    {name:"Technical Impact:none:rapid",id:5,children:[],parent:"Virulence:none",props:"{}"},
    {name:"Technical Impact:poc:slow",id:6,children:[],parent:"Virulence:poc",props:"{}"},
    {name:"Technical Impact:poc:rapid",id:7,children:[],parent:"Virulence:poc",props:"{}"},
    {name:"Technical Impact:active:slow",id:8,children:[],parent:"Virulence:active",props:"{}"},
    {name:"Technical Impact:active:rapid",id:9,children:[],parent:"Virulence:active",props:"{}"},
    {"name":"Mission & Well-being:none:slow:partial","id":11,"children":[],"parent":"Technical Impact:none:slow",props:"{}"},{"name":"Mission & Well-being:none:slow:total","id":12,"children":[],"parent":"Technical Impact:none:slow",props:"{}"},{"name":"Mission & Well-being:none:rapid:partial","id":13,"children":[],"parent":"Technical Impact:none:rapid",props:"{}"},{"name":"Mission & Well-being:none:rapid:total","id":14,"children":[],"parent":"Technical Impact:none:rapid",props:"{}"},{"name":"Mission & Well-being:poc:slow:partial","id":15,"children":[],"parent":"Technical Impact:poc:slow",props:"{}"},{"name":"Mission & Well-being:poc:slow:total","id":16,"children":[],"parent":"Technical Impact:poc:slow",props:"{}"},{"name":"Mission & Well-being:poc:rapid:partial","id":17,"children":[],"parent":"Technical Impact:poc:rapid",props:"{}"},{"name":"Mission & Well-being:poc:rapid:total","id":18,"children":[],"parent":"Technical Impact:poc:rapid",props:"{}"},{"name":"Mission & Well-being:active:slow:partial","id":19,"children":[],"parent":"Technical Impact:active:slow",props:"{}"},{"name":"Mission & Well-being:active:slow:total","id":20,"children":[],"parent":"Technical Impact:active:slow",props:"{}"},{"name":"Mission & Well-being:active:rapid:partial","id":21,"children":[],"parent":"Technical Impact:active:rapid",props:"{}"},{"name":"Mission & Well-being:active:rapid:total","id":22,"children":[],"parent":"Technical Impact:active:rapid",props:"{}"},
    {"name":"Track:none:slow:partial:low","id":24,"children":[],"parent":"Mission & Well-being:none:slow:partial",props:"{}"},
    {"name":"Track:none:slow:partial:medium","id":25,"children":[],"parent":"Mission & Well-being:none:slow:partial",props:"{}"},
    {"name":"Track:none:slow:partial:high","id":26,"children":[],"parent":"Mission & Well-being:none:slow:partial",props:"{}"},
    {"name":"Track:none:slow:total:low","id":27,"children":[],"parent":"Mission & Well-being:none:slow:total",props:"{}"},
    {"name":"Track:none:slow:total:medium","id":28,"children":[],"parent":"Mission & Well-being:none:slow:total",props:"{}"},
    {"name":"Track*:none:slow:total:high","id":29,"children":[],"parent":"Mission & Well-being:none:slow:total",props:"{}"},
    {"name":"Track:none:rapid:partial:low","id":30,"children":[],"parent":"Mission & Well-being:none:rapid:partial",props:"{}"},
    {"name":"Track:none:rapid:partial:medium","id":31,"children":[],"parent":"Mission & Well-being:none:rapid:partial",props:"{}"},
    {"name":"High:none:rapid:partial:high","id":32,"children":[],"parent":"Mission & Well-being:none:rapid:partial",props:"{}"},
    {"name":"Track:none:rapid:total:low","id":33,"children":[],"parent":"Mission & Well-being:none:rapid:total",props:"{}"},
    {"name":"Track:none:rapid:total:medium","id":34,"children":[],"parent":"Mission & Well-being:none:rapid:total",props:"{}"},
    {"name":"High:none:rapid:total:high","id":35,"children":[],"parent":"Mission & Well-being:none:rapid:total",props:"{}"},
    {"name":"Track:poc:slow:partial:low","id":36,"children":[],"parent":"Mission & Well-being:poc:slow:partial",props:"{}"},
    {"name":"Track:poc:slow:partial:medium","id":37,"children":[],"parent":"Mission & Well-being:poc:slow:partial",props:"{}"},
    {"name":"Track*:poc:slow:partial:high","id":38,"children":[],"parent":"Mission & Well-being:poc:slow:partial",props:"{}"},
    {"name":"Track:poc:slow:total:low","id":39,"children":[],"parent":"Mission & Well-being:poc:slow:total",props:"{}"},
    {"name":"Track*:poc:slow:total:medium","id":40,"children":[],"parent":"Mission & Well-being:poc:slow:total",props:"{}"},
    {"name":"High:poc:slow:total:high","id":41,"children":[],"parent":"Mission & Well-being:poc:slow:total",props:"{}"},
    {"name":"Track:poc:rapid:partial:low","id":42,"children":[],"parent":"Mission & Well-being:poc:rapid:partial",props:"{}"},
    {"name":"Track:poc:rapid:partial:medium","id":43,"children":[],"parent":"Mission & Well-being:poc:rapid:partial",props:"{}"},
    {"name":"High:poc:rapid:partial:high","id":44,"children":[],"parent":"Mission & Well-being:poc:rapid:partial",props:"{}"},
    {"name":"Track:poc:rapid:total:low","id":45,"children":[],"parent":"Mission & Well-being:poc:rapid:total",props:"{}"},
    {"name":"Track*:poc:rapid:total:medium","id":46,"children":[],"parent":"Mission & Well-being:poc:rapid:total",props:"{}"},
    {"name":"High:poc:rapid:total:high","id":47,"children":[],"parent":"Mission & Well-being:poc:rapid:total",props:"{}"},
    {"name":"Track:active:slow:partial:low","id":48,"children":[],"parent":"Mission & Well-being:active:slow:partial",props:"{}"},
    {"name":"Track:active:slow:partial:medium","id":49,"children":[],"parent":"Mission & Well-being:active:slow:partial",props:"{}"},
    {"name":"High:active:slow:partial:high","id":50,"children":[],"parent":"Mission & Well-being:active:slow:partial",props:"{}"},
    {"name":"Track:active:slow:total:low","id":51,"children":[],"parent":"Mission & Well-being:active:slow:total",props:"{}"},
    {"name":"High:active:slow:total:medium","id":52,"children":[],"parent":"Mission & Well-being:active:slow:total",props:"{}"},
    {"name":"Critical:active:slow:total:high","id":53,"children":[],"parent":"Mission & Well-being:active:slow:total",props:"{}"},
    {"name":"High:active:rapid:partial:low","id":54,"children":[],"parent":"Mission & Well-being:active:rapid:partial",props:"{}"},
    {"name":"High:active:rapid:partial:medium","id":55,"children":[],"parent":"Mission & Well-being:active:rapid:partial",props:"{}"},
    {"name":"Critical:active:rapid:partial:high","id":56,"children":[],"parent":"Mission & Well-being:active:rapid:partial",props:"{}"},
    {"name":"High:active:rapid:total:low","id":57,"children":[],"parent":"Mission & Well-being:active:rapid:total",props:"{}"},
    {"name":"Critical:active:rapid:total:medium","id":58,"children":[],"parent":"Mission & Well-being:active:rapid:total",props:"{}"},
    {"name":"Critical:active:rapid:total:high","id":59,"children":[],"parent":"Mission & Well-being:active:rapid:total",props:"{}"},

]

document.onkeyup = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
	console.log("Escape hit")
	$('.tescape').fadeOut()
    }
}
function cve_table_toggle() {
    $('#cve_table').toggleClass('d-none')
    if($('#cve_table').hasClass('d-none'))
	$('#table_toggle').html("&#8853;")
    else
	$('#table_toggle').html("&#8854;")
}
function tooltip_cycle_through() {
    var tips = ['#dt_start','#dt_full_tree','#dt_clear']
    $(tips[0]).tooltip('show')
    var itip =1
    var ix = setInterval(function() {
	$('button').tooltip('hide')
	$(tips[itip]).tooltip('show')
	itip++
	if(itip > tips.length) {
	    clearInterval(ix)
	    $('button').tooltip('dispose')
	}
    },1300)

}

function usage_privacy() {
    var msg = $('#privacy').html()
    var title = 'Usage and Privacy'
    swal(title,msg)
}
function calculate_mwb() {
    var options = ["Low","Medium","High"]
    var mp = parseInt($('#mp').val())
    var wb = parseInt($('#wb').val())
    var result = options[Math.max(mp,wb)]
    var xcolor={"Low":"text-success","Medium":"text-warning","High":"text-danger"}
    $('#wscore').removeClass().addClass(xcolor[result]).html(result)
    $('#wsdiv').show()
    $('circle[nameid="'+result.toLowerCase()+'"]').parent().simClick()
    $('#wsdiv').fadeOut('slow')
    setTimeout(function() {
	$('#mwb').modal('hide')
	var ptranslate = "translate(120,-250)"
	if(window.innerWidth <= 1000)
	    ptranslate = "translate(30,-90) scale(0.4,0.4)"
	d3.select("#pgroup").transition()
	    .duration(600).attr("transform", ptranslate)
    }, 900)
    
}
function readFile(input) {
    var file = input.files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
	//console.log(reader.result);
	try {
	    if(input.id == "dtreecsvload")
		parse_file(reader.result)
	    else
		tsv_load(reader.result)
	}catch(err) {
	    topalert("Reading data in file as text failed, Sorry check format and try again!","danger")
	    console.log(err)
	}
    };
    
    reader.onerror = function() {
	console.log(reader.error);
	topalert("Reading data in file as text failed","danger")
    };
    
}
function topalert(msg,level) {
    if(!level)
	level = "info"
    $('#topalert').html(msg).removeClass().addClass("alert alert-"+level,msg).fadeIn("fast",function() {
	$(this).delay(2000).fadeOut("slow"); })
}
function process(w) {
    var cve = $(w).val()
    var cve_data = $('#'+cve).data()
    if(!cve_data) {
	alert("Some error in loading this CVE data check the template and try again")
	return
    }
    dt_clear()
    $('#biscuit').fadeIn()
    dt_start()
    $('#cve_table tbody tr td').remove()
    var steps = ['Exploit','Virulence','Technical']
    var stimes = [1600,3200,5100]
    //console.log(new Date().getTime())    
    for(var i=0; i< steps.length; i++) {
	clickprocess(steps[i],cve_data,stimes[i])
    }
    $('#biscuit').fadeOut(4930)
    for(var k in cve_data)
	$('#cve_table tbody tr').append("<td class='d-temp'>"+cve_data[k]+"</td>")
    $('#table_toggle').show()
}
function clickprocess(tstep,cve_data,stime) {
    setTimeout(function() {
	//console.log(tstep)
	//console.log(stime)
	//console.log(new Date().getTime())
	if(tstep in cve_data) {
	    if($(".prechk-"+cve_data[tstep].toLowerCase()).length == 1) {
		$(".prechk-"+cve_data[tstep].toLowerCase()).simClick()
	    } else {
		console.log("Try again in a few seconds "+tstep)
		//clickprocess(tstep,cve_data,stime-1000)
	    }
	} else {
	    console.log("Some strange error "+tstep)
	    console.log(cve_data)
	}
    },stime)
}

function load_tsv_score() {
    $.get("sample-ssvc.txt",tsv_load);
}
function tsv_load(data) {
    var rmv = $('#cve_samples option:nth-child(n+2)').remove().length
    $('#cve_table thead tr th').remove()
    var y = data.split("\n")
    var heads = y.shift().split("\t")
    var scores = y.map(x => { return x
			      .split("\t")
			      .reduce((map,obj,i) => {
				  map[heads[i]] = obj; return map;
			      },{}) })
	.filter(x => 'CVE' in x && x.CVE.length > 3)
	.sort(function(a, b) { if(a.CVE < b.CVE) return -1; else return 1})
    for(var i=0; i<scores.length;i++) {
	if(!('CVE' in scores[i])) continue
	$('#cve_samples').append($("<option></option>")
				 .attr("id",scores[i].CVE)
				 .text(scores[i].CVE)
				 .data(scores[i]))
    }
    $('#cve_samples').removeClass("d-none").addClass("form-control cve_samples")
    for(var i=0; i<heads.length;i++)
	$('#cve_table thead tr').append("<th>"+heads[i]
					.replace(/(\([^)]+\))/,
						 '<br><span class="text-muted">$1</span>')+
					"</th>")
    if(rmv) 
	topalert("Loaded TSV CVE samples count of "+scores.length,"success")
}
function parse_file(xraw) {
    //var xraw = 'TSV data'
    var zraw=[]

    /* CSV or TSV looks like 
       ID,Exploitation,Utility,TechnicalImpact,SafetyImpact,Outcome
    */

    var xarray = xraw.split('\n')
    var xr = xarray.map(x=>x.split(/[\s,]+/))
    /* Remove first row has the headers */
    var y = xr.splice(1)
    /* Remove ID column in the first row to create x*/
    var x = xr[0].splice(1)
    /* Now xr looks like */
    /* (6)["Row", "Exploitation", "Virulence", "Technical", "Mission_Well-being", "Decision"] */
    var yraw=[[],[],[],[],[]]
    var id=1;
    /* This will create just the last branches of the tree */
    var thash = {}
    for(var i=0; i< y.length-1; i++) {
	/* Remove ID column */
	if(y[i].length < 1) continue
	y[i].shift();
	var tname = y[i].pop()+":"+y[i].join(":")
	if(tname == "undefined") continue;
	for( var j=0; j< x.length-1; j++) {
	    /*y[i] look like 0,none,laborious,partial,none,defer */
	    var tparent = x[x.length-2-j]+":"+y[i].slice(0,x.length-2-j).join(":")
	    if(!(tname in thash))
		var yt = {name:tname.replace(/\:+$/,''),id:id++,parent:tparent.replace(/\:+$/,''),props:"{}",children:[]}
	    else
		continue
	    thash[yt.name] = 1
	    tname = tparent
	    yraw[j].push(yt)
	}
	
    }
    for(var j=yraw.length; j> -1; j--)  {
	if(yraw.length > 0)
	    zraw = zraw.concat(yraw[j])
    }

    /* Next part of the tree data  */
    zraw[0] = {name:x[0],id:id+254,children:[],parent:null,props:"{}"}
    /* yraw[0].push({name:"Exploitation:",id:1024,children:[],parent:null,props:"{}"}) */
    raw = zraw
    topalert("Decision tree has been updated with "+raw.length+" nodes, You can use it now!","success")
    dt_clear()
}

function add_invalid_feedback(xel,msg) {
    $('.invalid-feedback').remove()
    $('.valid-feedback').remove()    
    if(msg == "")
	msg = 'Please provide valid data for '+$(xel).attr('name')
    var err = $('<div>').html(msg)
    $(xel).after(err)
    $(err).addClass('invalid-feedback').show()
    $(xel).focus()
}
function add_valid_feedback(xel,msg) {
    $('.invalid-feedback').remove()
    $('.valid-feedback').remove()        
    if(msg == "")
	msg = 'Looks good'
    var gdg = $('<div>').html(msg)
    $(xel).after(gdg)
    $(gdg).addClass('valid-feedback').show()
}
function verify_inputs() {
    var inputs=$('#main_table :input').not('button')
    for (var i=0; i< inputs.length; i++) {
	if(!$(inputs[i]).val()) {
	    if(!$(inputs[i]).hasClass("not_required")) {
		add_invalid_feedback(inputs[i],"")
		return false
	    }
	}
    }
    return true
}
function generate_uuid() {
    var uuid = Math.random().toString(16).substr(2,8)
    for (var i=0; i<3; i++)
	uuid += '-'+Math.random().toString(16).substr(2,4)
    return uuid+'-'+Math.random().toString(16).substr(2,12)
}

function draw_graph() {
    var margin = {top: 20, right: 120, bottom: 20, left: 120},
	width = 1000 - margin.right - margin.left,
	height = 800 - margin.top - margin.bottom;
    if(showFullTree) {
	var add_offset = 0
	if(raw.length > 60 )
	    add_offset = (raw.length - 60)*5
	width = 1000 - margin.right - margin.left + add_offset
	height = 1200 - margin.top - margin.bottom + add_offset
    }
    duration = 750
    tree = d3.layout.tree()
	.size([height, width]);

    diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.y, d.x]; });

    //xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    var default_translate =  "translate(" + margin.left + "," + margin.top + ")"
    var svg_width = width + margin.right + margin.left
    var svg_height = height + margin.top + margin.bottom
    if(window.innerWidth <= 1000) {
	default_translate =  "translate(10,0) scale(0.75)"
	if(window.innerWidth <= 750)
	    default_translate =  "translate(30,0) scale(0.42)"
    }
    svg = d3.select("#graph").append("svg")
	.attr("xmlns","http://www.w3.org/2000/svg")
	.attr("preserveAspectRatio","none")
	.attr("class","mgraph")
	.attr("width", svg_width)
	.attr("height", svg_height)
	.append("g")
	.attr("transform", default_translate)
	.attr("id","pgroup")

    root = treeData[0];
    root.x0 = height / 2;
    root.y0 = 0;

    update(root)

    d3.select(self.frameElement).style("height", "700px");
    /*
      var svgx = $('svg')[0].outerHTML
      $('#dlsvg').attr('href','data:image/svg+xml;charset=utf-8,'+ encodeURIComponent(svgx))
      $('#dlsvg').attr('download','SVG-'+timefile()+'.svg')
    */
}
function check_children(d,a,b) {
    if((d.children) && (d.children.length)) return a
    if((d._children) && (d._children.length)) return a
    return b
}
function update(source) {
    var i = 0
    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse()
    var links = tree.links(nodes)

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 200;})

    // Update the nodes…
    var node = svg.selectAll("g.node")
	.data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
	.attr("class", "node")
	.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
	.on("click", doclick)
	.on("contextmenu",dorightclick)
	.on("mouseover",showdiv)
	.on("mouseout",hidediv)

    nodeEnter.append("circle")
	.attr("r", 1e-6)
	.attr("class","junction")
	.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
    
    var lcolors = {"Track":"#28a745","Track*":"#ffc107","High":"#EE8733","Critical":"#dc3545"}
    /*
      nodeEnter.append("text")
      .attr("x", function(d) { return check_children(d,"-13","-60")})
      .attr("y", "+10")
      .attr("dy", ".35em")
      .attr("class","dfork")
      .attr("text-anchor", function(d) { return check_children(d,"end","start") })
      .text( function(d) {
      if(d.name.split(":").length > 1) return d.name.split(":").pop();
      return "";
      })
      .style("fill-opacity", 1e-6)
      .style("font-size","14px")
      .style("fill","white")
    */
    var font = "20px"
    if(showFullTree) 
	font = "18px"
    nodeEnter.append("text")
	.attr("x",function(d) { return check_children(d,"-55","+20") })
	.attr("y",function(d) { return check_children(d,"-37","0") })
	.attr("dy", ".35em")
	.text(function(d) { return d.name.split(":")[0]; })
	.style("font-size",font)
	.style("fill", function(d) { var t = d.name.split(":")[0]
				     var x = "white"
				     if(t in lcolors) x = lcolors[t]
				     return x
				   })


    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
	.duration(duration)
	.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
	.attr("r", 10)
	.attr("sid",function(d) { return d.id;})
	.attr("nameid",function(d) { if(!d) return "1";
				     if(d.name) return d.name.split(":").pop();
				   })
	.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeUpdate.select("text")
	.style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
	.duration(duration)
	.attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
	.remove();

    nodeExit.select("circle")
	.attr("r", 1e-6);

    nodeExit.select("text")
	.style("fill-opacity", 1e-6);

    // Update the links…

    var link = svg.selectAll("path.link")
	.data(links, function(d) { if(d.target) return d.target.id; })
    /*        .enter()
              .append("g")
              .attr("class", "link")
    */
    // Enter any new links at the parent's previous position.
    //var linkx = link.enter().append("g").attr("class","pathlink").attr("d","")
    //linkx.append("path")
    link.enter().insert("path","g")
	.attr("class", "link")
	.attr("id", function(d) { return 'l'+Math.random().toString(36).substr(3); })
	.attr("ldata", function(d) { return d.target.name.split(":").pop(); })
	.attr("ldeep", function (d) { return d.target.name.split(":").length })
	.attr("csid",function(d) { return d.target.id;})    
	.attr("d", function(d) {
	    var o = {x: source.x0, y: source.y0};
	    return diagonal({source: o, target: o});
	})

    // Transition links to their new position.
    link.transition()
	.duration(duration)
	.attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
	.duration(duration)
	.attr("d", function(d) {
	    var o = {x: source.x, y: source.y};
	    return diagonal({source: o, target: o});
	})
	.remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
	d.x0 = d.x;
	d.y0 = d.y;
    });
    setTimeout(update_links,1500)
}
function pathclick(w) {
    var sid = $(this).attr("csid")
    if(sid) {
	$('circle[sid="'+sid+'"]').parent().simClick()
    }
}
function update_links() {
    /* d3.select("g").append("g").attr("class","pathlink").append("path").attr("d","M0,480C90,480 90,800 180,800").attr("class","link")
       <path class="link" id="mo7ejxrk19" ldata="low" d="M540,920C630,920 630,900 720,900"></path>
    */
    $('.pathlink').remove()
    var i = 0
    d3.selectAll("path.link").each(function(w) {
	var t = $(this);
	var id=t.attr("id");
	var xd = t.attr("d")
	var csid = t.attr("csid")
	var depth = parseInt(t.attr("ldeep")) || 0
	var text = t.attr("ldata")
	var xclass = "btext prechk-"+text
	var mclass = $(this).attr("class")
	if((mclass) && mclass.indexOf("chosen") > -1) {
	    xclass += " chosen"
	}
	if(showFullTree)
	    xclass += " fullTree"
	d3.select("g")
	    .insert("g","path.link").attr("class","pathlink").attr("id","x"+id)
	    .append("path").attr("d",xd).attr("id","f"+id).attr("class","xlink")
	// depth 4 => 70 , depth 0 => 40%
	var doffset = parseInt(70 - (4-depth)*5.5)
	var yoffset = -10
	if(showFullTree)
	    yoffset = -6
	d3.select("g#x"+id).append("text").attr("dx",-6).attr("dy",yoffset).attr("class","gtext")
	    .append("textPath").attr("href","#f"+id).attr("class",xclass)
	    .attr("id","t"+id)
	    .attr("csid",csid)
	    .text(text).attr("startOffset",doffset+"%")
	    .on("click",pathclick)
	    //.each(function() { console.log("Completed") })
	//$(this).remove() "fill","#17a2b8") "text-anchor","middle"
    })
}
function showdiv(d) {
    var iconPos = this.getBoundingClientRect();
    //console.log(JSON.parse(d.props))
    var props = JSON.parse(d.props)
    //console.log(this)
    var bgcolor = 'rgba(70, 130, 180, 1)'
    var name = ""
    if($(this).is('g'))
	name = $(this).find("text").text()
    else 
	name = $(this).parent().find("text").text()
    name=name.replace(/\W/g,'_')
    //console.log(name)
    //console.log(vul_data)
    var addons = ''
    if($('.'+name).length == 1) {
	$('#mpopup').html($('.'+name).html())
	$('#mpopup').css({left:(iconPos.right + 10) + "px",
			  top:(window.scrollY + iconPos.top - 20) + "px",
			  display:"block"})

    }
}
function hidediv(d) {
    $('#mpopup').hide()
}
function dorightclick(d) {
    return
}
function closeSiblings(d) {
    d.clickkill = true
    if (!d.parent) return; // root case
    /* 

     */
    var x = d.parent.children
    d.parent._children = d.parent.children
    d.parent.children = [d]
    //console.log(d.parent)
}

function doclick(d) {
    if(showFullTree === false) {
	if(('clickkill' in d) &&
	   (d.clickkill === true)) {
	    console.log("We have reached this already "+d)
	    return;
	}
	$('.pathlink').remove()
	if(('name' in d) &&
	   (d.name.indexOf("Mission ") == 0) ) {
	    $('#wb').val(0)
	    $('#mp').val(0)
	    $('#mwb').modal()
	}
	if('id' in d) {
	    var idl = $('[csid="'+d.id+'"]').attr("id")
	    d3.select('#f'+idl).attr('class','chosen link')
	    d3.select('#t'+idl).attr('class','chosen btext')		
	    d3.select('#'+idl).attr('class','chosen link')
	}
	if(d.parent) 
	    closeSiblings(d)
    }
	    
    $('.pathlink').remove()    
    if (d.children) {
	d._children = d.children;
	d.children = null;
    } else {
	d.children = d._children
	d._children = null
    }
    update(d);
}

function grapharray(array){
    var map = {};
    for(var i = 0; i < array.length; i++){
	var obj = array[i];
	obj._children= [];

	map[obj.name] = obj;

	var parent = obj.parent || '-';
	if(!map[parent]){
	    map[parent] = {
		_children: []
	    };
	}
	map[parent]._children.push(obj);
    }
    return map['-']._children;
}

function grapharray_open(marray){
    var map = {};
    for(var i = 0; i < marray.length; i++){
	var obj = marray[i];
	obj.children= [];

	map[obj.name] = obj;

	var parent = obj.parent || '-';
	if(!map[parent]){
	    map[parent] = {
		children: []
	    };
	}
	map[parent].children.push(obj);
    }
    return map['-'].children;
}

function timefile() {
    var d = new Date();
    return d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + "-" +
	d.getHours() + "-" + d.getMinutes()
    
}
function showme(divid,vul_flag) {
    $('.scontent').hide()
    $(divid).show()
    if(vul_flag)
	$('#vuls').removeClass('d-none')
    else
	$('#vuls').addClass('d-none')
}

function dt_start() {
    showFullTree = false
    $('svg.mgraph').remove()
    var xraw = JSON.parse(JSON.stringify(raw))
    treeData=grapharray(xraw)
    draw_graph()
    setTimeout(function() {
	$('circle.junction').parent().simClick()
	/* Disable click on the first node */
	treeData[0].clickkill = true
    }, 900)
}
function dt_clear() {
    showFullTree = false
    raw.map(x => {  x.children=[]; delete x._children;})    
    $('svg.mgraph').remove()
}

function show_full_tree() {
    showFullTree = true
    $('svg.mgraph').remove()
    var xraw = JSON.parse(JSON.stringify(raw))
    treeData=grapharray_open(xraw);
    draw_graph();
}


function add_text(links) {
    var link = svg.selectAll(".link")
	.data(links)
	.enter()
	.append("g")
	.attr("class", "link");

    link.append("path")
	.attr("fill", "none")
	.attr("stroke", "#ff8888")
	.attr("stroke-width", "1.5px")
	.attr("d", diagonal);

    link.append("text")
	.attr("font-family", "Arial, Helvetica, sans-serif")
	.attr("fill", "Black")
	.style("font", "normal 12px Arial")
	.attr("transform", function(d) {
	    return "translate(" +
		((d.source.y + d.target.y)/2) + "," +
		((d.source.x + d.target.x)/2) + ")";
	})
	.attr("dy", ".35em")
	.attr("text-anchor", "middle")
	.text(function(d) {
	    //console.log(d.target.name);
	    return d.target.name;
	});
}
