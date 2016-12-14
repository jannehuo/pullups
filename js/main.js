require("../less/style.less");

function Pullup() {
    var ref = this;
    this.api = 'https://pullup-api.azurewebsites.net/add/';
    this.dataUrl = 'https://pullup-api.azurewebsites.net/getResults';
    //this.api = 'http://localhost:8080/add/';
    //this.dataUrl = 'http://localhost:8080/getResults';
}
var pullup = new Pullup();

window.onload = function() {
    pullup.ajax(pullup.dataUrl,"GET", function(data) {
        pullup.renderApp(data);
        pullup.renderPulluplist(data);
    });
};

Pullup.prototype.ajax = function(url,type, cb) {
    var ref = this;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);
            cb(res);
        }
    };
    xhttp.open(type, url, true);
    xhttp.send();
};

Pullup.prototype.renderApp = function(data) {
    this.app = new Vue({
        el: "#app",
        data: {
            names:data,
            user:null,
            amount:0,
            added:false,
            set:0
        },
        methods: {
			addPullUps:function(){
                this.set = this.amount;
				pullup.add(this.user , this.amount, this.set);
			},
            updateAmount: function(val) {
                this.amount = val;
                this.set = val;
            }
		}
    });
};

Pullup.prototype.renderPulluplist = function(data) {
    this.pullUpList = new Vue({
    	el:"#pullups-list",
    	data: {
    		results:data,
            total: pullup.calculateTotal(data)
    	}
    });
};

Pullup.prototype.add = function(user,amount,set) {
	var ref = this;
	if (user.length > 0 && amount > 0) {
        var url = this.api + user + "/" + amount + "/" + set;
        this.ajax(url,"POST",function(data){
        	ref.pullUpList.results = data;
            ref.pullUpList.total = pullup.calculateTotal(data);
            ref.app.names = data;
        	ref.showNotification();
        });
    }
};

Pullup.prototype.showNotification = function() {
	var ref = this;
	this.app.added = true;
    setTimeout(function() {
        ref.app.added = false;
        ref.app.amount = 0;
    }, 700);
};

Pullup.prototype.calculateTotal = function(data) {
    var total = 0;
    for(var key in data) {
        total += data[key].amount;
    }
    return total;
}