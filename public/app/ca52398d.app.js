(function(){"use strict";angular.module("nodeDdShortenerApp",["ngCookies","ngResource","ngSanitize","ui.router","ui.bootstrap"]).config(["$stateProvider","$urlRouterProvider","$locationProvider","$httpProvider",function(a,b,c,d){return b.otherwise("/"),c.html5Mode(!0),d.interceptors.push("authInterceptor")}]).factory("authInterceptor",["$rootScope","$q","$cookieStore","$location",function(a,b,c,d){return{request:function(a){return a.headers=a.headers||{},c.get("token")&&(a.headers.Authorization="Bearer "+c.get("token")),a},responseError:function(a){return 401===a.status&&(d.path("/login"),c.remove("token")),b.reject(a)}}}]).run(["$rootScope","$location","Auth",function(a,b,c){return a.$on("$stateChangeStart",function(a,d){return c.isLoggedInAsync(function(a){return d.authenticate&&!a?b.path("/login"):void 0})})}])}).call(this),function(){"use strict";angular.module("nodeDdShortenerApp").config(["$stateProvider",function(a){return a.state("login",{url:"/login",templateUrl:"app/account/login/login.html",controller:"LoginCtrl"}).state("signup",{url:"/signup",templateUrl:"app/account/signup/signup.html",controller:"SignupCtrl"}).state("settings",{url:"/settings",templateUrl:"app/account/settings/settings.html",controller:"SettingsCtrl",authenticate:!0})}])}.call(this),function(){"use strict";angular.module("nodeDdShortenerApp").controller("LoginCtrl",["$scope","Auth","$location",function(a,b,c){return a.user={},a.errors={},a.login=function(d){return a.submitted=!0,d.$valid?b.login({email:a.user.email,password:a.user.password}).then(function(){return c.path("/")})["catch"](function(b){return a.errors.other=b.message}):void 0}}])}.call(this),function(){"use strict";angular.module("nodeDdShortenerApp").controller("SettingsCtrl",["$scope","User","Auth",function(a,b,c){return a.errors={},a.changePassword=function(b){return a.submitted=!0,b.$valid?c.changePassword(a.user.oldPassword,a.user.newPassword).then(function(){return a.message="Password successfully changed."})["catch"](function(){return b.password.$setValidity("mongoose",!1),a.errors.other="Incorrect password",a.message=""}):void 0}}])}.call(this),function(){"use strict";angular.module("nodeDdShortenerApp").controller("SignupCtrl",["$scope","Auth","$location",function(a,b,c){return a.user={},a.errors={},a.register=function(d){return a.submitted=!0,d.$valid?b.createUser({name:a.user.name,email:a.user.email,password:a.user.password}).then(function(){return c.path("/")})["catch"](function(b){return b=b.data,a.errors={},angular.forEach(b.errors,function(b,c){return d[c].$setValidity("mongoose",!1),a.errors[c]=b.message})}):void 0}}])}.call(this),function(){"use strict";angular.module("nodeDdShortenerApp").config(["$stateProvider",function(a){return a.state("admin",{url:"/admin",templateUrl:"app/admin/admin.html",controller:"AdminCtrl"})}]),angular.module("nodeDdShortenerApp").controller("AdminCtrl",["$scope","$http","Auth","User",function(a,b,c,d){return b.get("/api/users").success(function(b){return a.users=b}),a["delete"]=function(b){return d.remove({id:b._id}),_.remove(a.users,b)}}])}.call(this),function(){"use strict";angular.module("nodeDdShortenerApp").config(["$stateProvider",function(a){return a.state("history",{url:"/history",templateUrl:"app/history/history.html",controller:"HistoryCtrl"})}]),angular.module("nodeDdShortenerApp").controller("HistoryCtrl",["$scope","$http","$window",function(a,b,c){return b.get("/api/1.0/history").success(function(b,c){return b?(a.totalUrl=b.total,a.history=b.history):void 0})}])}.call(this),function(){"use strict";angular.module("nodeDdShortenerApp").config(["$stateProvider",function(a){return a.state("main",{url:"/",templateUrl:"app/main/main.html",controller:"MainCtrl"})}]),angular.module("nodeDdShortenerApp").controller("MainCtrl",["$scope","$http","$window",function(a,b,c){return a.shorten=function(){return a.longUrl?b.post("/api/1.0/url",{longUrl:a.longUrl}).success(function(b,c){return a.shortUrl=b.shortUrl,b.executionTime&&(a.message=" "+b.executionTime.sec+"sec "+(" "+Math.floor(b.executionTime.ms/1e6)+"ms ")),a.urls.unshift({shortenId:b.shortUrl.split(/[\/ ]+/).pop(),longUrl:a.longUrl,createdAt:moment().format(),clicked:0})}).error(function(b){return a.message="Error: "+b,delete a.shortUrl}):void 0},b.get("/api/1.0/url/list").success(function(b,c){return b?(a.totalUrl=b.total,a.urls=b.urls):void 0}),a.host=c.location.origin}]).filter("fromNow",function(){return function(a){return moment(a).fromNow()}})}.call(this),function(){"use strict";angular.module("nodeDdShortenerApp").factory("Auth",["$location","$rootScope","$http","User","$cookieStore","$q",function(a,b,c,d,e,f){var g;return g=e.get("token")?d.get():{},{login:function(a,b){var h;return h=f.defer(),c.post("/auth/local",{email:a.email,password:a.password}).success(function(a){return e.put("token",a.token),g=d.get(),h.resolve(a),"function"==typeof b?b():void 0}).error(function(a){return function(c){return a.logout(),h.reject(c),"function"==typeof b?b(c):void 0}}(this)),h.promise},logout:function(){e.remove("token"),g={}},createUser:function(a,b){return d.save(a,function(c){return e.put("token",c.token),g=d.get(),"function"==typeof b?b(a):void 0},function(a){return function(c){return a.logout(),"function"==typeof b?b(c):void 0}}(this)).$promise},changePassword:function(a,b,c){return d.changePassword({id:g._id},{oldPassword:a,newPassword:b},function(a){return"function"==typeof c?c(a):void 0},function(a){return"function"==typeof c?c(a):void 0}).$promise},getCurrentUser:function(){return g},isLoggedIn:function(){return g.hasOwnProperty("role")},isLoggedInAsync:function(a){return g.hasOwnProperty("$promise")?g.$promise.then(function(){"function"==typeof a&&a(!0)})["catch"](function(){"function"==typeof a&&a(!1)}):"function"==typeof a?a(g.hasOwnProperty("role")):void 0},isAdmin:function(){return"admin"===g.role},getToken:function(){return e.get("token")}}}])}.call(this),function(){"use strict";angular.module("nodeDdShortenerApp").factory("User",["$resource",function(a){return a("/api/users/:id/:controller",{id:"@_id"},{changePassword:{method:"PUT",params:{controller:"password"}},get:{method:"GET",params:{id:"me"}}})}])}.call(this),function(){"use strict";angular.module("nodeDdShortenerApp").factory("Modal",["$rootScope","$modal",function(a,b){var c;return c=function(c,d){var e;return e=a.$new(),c=c||{},d=d||"modal-default",angular.extend(e,c),b.open({templateUrl:"components/modal/modal.html",windowClass:d,scope:e})},{confirm:{"delete":function(a){return a=a||angular.noop,function(){var b,d,e;b=Array.prototype.slice.call(arguments),e=b.shift(),d=void 0,d=c({modal:{dismissable:!0,title:"Confirm Delete",html:"<p>Are you sure you want to delete <strong>"+e+"</strong> ?</p>",buttons:[{classes:"btn-danger",text:"Delete",click:function(a){d.close(a)}},{classes:"btn-default",text:"Cancel",click:function(a){d.dismiss(a)}}]}},"modal-danger"),d.result.then(function(c){a.apply(c,b)})}}}}}])}.call(this),function(){"use strict";angular.module("nodeDdShortenerApp").directive("mongooseError",function(){return{restrict:"A",require:"ngModel",link:function(a,b,c,d){return b.on("keydown",function(){return d.$setValidity("mongoose",!0)})}}})}.call(this),function(){"use strict";angular.module("nodeDdShortenerApp").controller("NavbarCtrl",["$scope","$location","Auth",function(a,b,c){return a.menu=[{title:"Home",link:"/"},{title:"History",link:"/history"}],a.isCollapsed=!0,a.isLoggedIn=c.isLoggedIn,a.isAdmin=c.isAdmin,a.getCurrentUser=c.getCurrentUser,a.logout=function(){return c.logout(),b.path("/login")},a.isActive=function(a){return a===b.path()}}])}.call(this),angular.module("nodeDdShortenerApp").run(["$templateCache",function(a){"use strict";a.put("app/account/login/login.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Login</h1><p>Accounts are reset on server restart from <code>server/config/seed.js</code>. Default account is <code>test@test.com</code> / <code>test</code></p><p>Admin account is <code>admin@admin.com</code> / <code>admin</code></p></div><div class=col-sm-12><form class=form name=form ng-submit=login(form) novalidate><div class=form-group><label>Email</label><input type=email name=email class=form-control ng-model=user.email required></div><div class=form-group><label>Password</label><input type=password name=password class=form-control ng-model=user.password required></div><div class="form-group has-error"><p class=help-block ng-show="form.email.$error.required && form.password.$error.required && submitted">Please enter your email and password.</p><p class=help-block ng-show="form.email.$error.email && submitted">Please enter a valid email.</p><p class=help-block>{{ errors.other }}</p></div><div><button class="btn btn-inverse btn-lg btn-login" type=submit>Login</button> <a class="btn btn-default btn-lg btn-register" href=/signup>Register</a></div></form></div></div><hr></div>'),a.put("app/account/settings/settings.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Change Password</h1></div><div class=col-sm-12><form class=form name=form ng-submit=changePassword(form) novalidate><div class=form-group><label>Current Password</label><input type=password name=password class=form-control ng-model=user.oldPassword mongoose-error><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.other }}</p></div><div class=form-group><label>New Password</label><input type=password name=newPassword class=form-control ng-model=user.newPassword ng-minlength=3 required><p class=help-block ng-show="(form.newPassword.$error.minlength || form.newPassword.$error.required) && (form.newPassword.$dirty || submitted)">Password must be at least 3 characters.</p></div><p class=help-block>{{ message }}</p><button class="btn btn-lg btn-primary" type=submit>Save changes</button></form></div></div></div>'),a.put("app/account/signup/signup.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Sign up</h1></div><div class=col-sm-12><form class=form name=form ng-submit=register(form) novalidate><div class=form-group ng-class="{ \'has-success\': form.name.$valid && submitted,\n                                            \'has-error\': form.name.$invalid && submitted }"><label>Name</label><input name=name class=form-control ng-model=user.name required><p class=help-block ng-show="form.name.$error.required && submitted">A name is required</p></div><div class=form-group ng-class="{ \'has-success\': form.email.$valid && submitted,\n                                            \'has-error\': form.email.$invalid && submitted }"><label>Email</label><input type=email name=email class=form-control ng-model=user.email required mongoose-error><p class=help-block ng-show="form.email.$error.email && submitted">Doesn\'t look like a valid email.</p><p class=help-block ng-show="form.email.$error.required && submitted">What\'s your email address?</p><p class=help-block ng-show=form.email.$error.mongoose>{{ errors.email }}</p></div><div class=form-group ng-class="{ \'has-success\': form.password.$valid && submitted,\n                                            \'has-error\': form.password.$invalid && submitted }"><label>Password</label><input type=password name=password class=form-control ng-model=user.password ng-minlength=3 required mongoose-error><p class=help-block ng-show="(form.password.$error.minlength || form.password.$error.required) && submitted">Password must be at least 3 characters.</p><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.password }}</p></div><div><button class="btn btn-inverse btn-lg btn-login" type=submit>Sign up</button> <a class="btn btn-default btn-lg btn-register" href=/login>Login</a></div></form></div></div><hr></div>'),a.put("app/admin/admin.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><p>The delete user and user index api routes are restricted to users with the \'admin\' role.</p><ul class=list-group><li class=list-group-item ng-repeat="user in users"><strong>{{user.name}}</strong><br><span class=text-muted>{{user.email}}</span> <a ng-click=delete(user) class=trash><span class="glyphicon glyphicon-trash pull-right"></span></a></li></ul></div>'),a.put("app/history/history.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><header class=hero-unit id=banner><div class=container><h2>DD URL Shortener</h2></div></header><div class="body container"><div class=row><div class=col-lg-12><div><label class=control-label>HISTORY</label></div></div></div></div><div class=container><div class=row><div data-ng-repeat="data in history"><pre>{{data}}</pre></div></div></div><footer class=footer><div class=container><p>by <a href=https://github.com/harryoh target=_blank>harryoh</a></p></div></footer>'),a.put("app/main/main.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><header class=hero-unit id=banner><div class=container><h2>DD URL Shortener</h2></div></header><div class="body container"><div class=row><div class=col-lg-12><form class=form-inline data-ng-submit=shorten()><div class="form-group form-group-sm"><label class=sr-only for=url>Input URL included http:// or https://</label><input class=form-control id=url data-ng-model=longUrl placeholder="Input URL included http:// or https://" autofocus required></div><button type=submit class="btn btn-default btn-sm">Shorten URL</button></form></div></div></div><div class="body container"><div class=row><div class=col-lg-12><div><label class=control-label>Result</label></div><div><input readonly data-ng-model=shortUrl class=result onclick=this.select()></div></div></div></div><div class=container data-ng-show=message><div class=row><div class="text-center message">{{message}}</div></div></div><div class="container url-list"><div class=row>Total: {{totalUrl | number}}<table class=table><thead><tr><th class=short-url>Short URL</th><th class=long-url>Long URL</th><th class=created>Created</th><th class=clicks>Clicks</th></tr></thead><tbody><tr data-ng-repeat="data in urls"><td><a href={{host}}/{{data.shortenId}} target=_blank>{{data.shortenId}}</a></td><td><a href={{data.longUrl}} target=_blank>{{data.longUrl}}</a></td><td>{{data.createdAt | fromNow}}</td><td>{{data.clicked | number}}</td></tr></tbody></table><div style=text-align:center>...</div></div></div><footer class=footer><div class=container><p>by <a href=https://github.com/harryoh target=_blank>harryoh</a></p></div></footer>'),a.put("components/modal/modal.html",'<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat="button in modal.buttons" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>'),a.put("components/navbar/navbar.html",'<div class="navbar navbar-default navbar-static-top" ng-controller=NavbarCtrl><div class=container><div class=navbar-header><button class=navbar-toggle type=button ng-click="isCollapsed = !isCollapsed"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a href="/" class=navbar-brand>DD URL Shortener</a></div><div collapse=isCollapsed class="navbar-collapse collapse" id=navbar-main><ul class="nav navbar-nav"><li ng-repeat="item in menu" ng-class="{active: isActive(item.link)}"><a ng-href={{item.link}}>{{item.title}}</a></li><li ng-show=isAdmin() ng-class="{active: isActive(\'/admin\')}"><a href=/admin>Admin</a></li></ul><ul ng-show=false class="nav navbar-nav navbar-right"><li ng-hide=isLoggedIn() ng-class="{active: isActive(\'/signup\')}"><a href=/signup>Sign up</a></li><li ng-hide=isLoggedIn() ng-class="{active: isActive(\'/login\')}"><a href=/login>Login</a></li><li ng-show=isLoggedIn()><p class=navbar-text>Hello {{ getCurrentUser().name }}</p></li><li ng-show=isLoggedIn() ng-class="{active: isActive(\'/settings\')}"><a href=/settings><span class="glyphicon glyphicon-cog"></span></a></li><li ng-show=isLoggedIn() ng-class="{active: isActive(\'/logout\')}"><a href="" ng-click=logout()>Logout</a></li></ul></div></div></div>')}]);