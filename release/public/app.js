'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var app = angular.module('app', ['ui.router']);

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind('keypress', function (event) {
            if (event.which !== 13) return;
            scope.$apply(function () {
                return scope.$eval(attrs.ngEnter, { $event: event });
            });
            event.preventDefault();
        });
    };
});

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    //this controls the animations for each transition
    var resolve = {
        timeout: function timeout($timeout) {
            $('[screen]').removeClass('active');
            $timeout(function () {
                return $('[screen]').addClass('active');
            }, 350);
            return $timeout(300);
        }
    };

    // For any unmatched url, redirect to /
    $urlRouterProvider.otherwise("/");

    // Now set up the states
    $stateProvider.state(new Route('home', "/", resolve)).state(new Route('about', "/about", resolve));

    //use real urls instead of hashes
    //$locationProvider.html5Mode(true);
});

var Route = function Route(name, url, resolve) {
    _classCallCheck(this, Route);

    _.extend(this, {
        name: name,
        url: url,
        templateUrl: _.kebabCase(name) + '-screen.html',
        controller: _.upperFirst(_.camelCase(name + 'Screen')),
        resolve: resolve
    });
};

app.service('Menu', function ($state, $stateParams, $timeout) {

    var currentPage,
        pages = [{ name: "Home", slug: "home" }, { name: "About", slug: "about" }];

    var setPage = function setPage(slug) {
        currentPage = slug;
        $state.go(slug);
    };

    var isCurrentPage = function isCurrentPage(slug) {
        return slug == (currentPage || $state.current.name);
    };

    var init = function init() {
        console.log($state);
        console.log('$state.get()', $state.get());
    };

    init();

    return {
        getPages: function getPages() {
            return pages;
        },
        setPage: setPage,
        isCurrentPage: isCurrentPage
    };
});

app.component('contentItem', {
    templateUrl: 'content.html',
    controllerAs: 'content',
    transclude: {
        content: '?content'
    },
    bindings: {},
    controller: function controller($element, $timeout) {

        var init = function init() {};

        init();

        _.extend(this, {});
    }
});

app.component('headerItem', {
    templateUrl: 'header.html',
    controllerAs: 'header',
    bindings: {
        img: '@'
    },
    controller: function controller(Menu) {

        var init = function init() {};

        init();

        _.extend(this, {
            getPages: Menu.getPages,
            setPage: Menu.setPage,
            isCurrentPage: Menu.isCurrentPage
        });
    }
});

app.component('heroItem', {
    templateUrl: 'hero.html',
    controllerAs: 'hero',
    bindings: {
        img: '@',
        heading: '@'
    },
    controller: function controller($element, $timeout) {

        var init = function init() {};

        init();

        _.extend(this, {});
    }
});

app.controller('AboutScreen', function ($element, $timeout, $scope) {

    var init = function init() {
        //$timeout(() => $element.find('[screen]').addClass('active'), 50);
    };

    init();

    _.extend($scope, {});
});

app.controller('HomeScreen', function ($element, $timeout, $scope) {

    var guides = [];

    var getGuides = function getGuides() {
        return guides;
    };

    var addGuide = function addGuide() {
        guides.push({
            title: "Guide " + (guides.length + 1),
            content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, modi."
        });

        $timeout(function () {
            $(".guide-number").draggable({
                containment: "parent"
            });
        });
    };

    var removeGuide = function removeGuide(guide) {
        console.log('guide', guide);
        _.pull(guides, guide);
    };

    var render = function render() {
        var scaleBy = 1.5;
        var w = 1200;
        var h = $(document).height();
        var div = document.querySelector('#screen');
        var canvas = document.createElement('canvas');
        canvas.width = w * scaleBy;
        canvas.height = h * scaleBy;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        var context = canvas.getContext('2d');
        context.scale(scaleBy, scaleBy);

        html2canvas(document.body, {
            canvas: canvas,
            onrendered: function onrendered(canvas) {
                //$('body').append($(canvas));
                window.open(canvas.toDataURL());
            }
        });
    };

    var events = function events() {
        var imageLoader = document.getElementById('filePhoto');
        imageLoader.addEventListener('change', handleImage, false);

        function handleImage(e) {
            var reader = new FileReader();
            reader.onload = function (event) {
                $('.image-web').attr('src', event.target.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    var init = function init() {
        //$timeout(() => $element.find('[screen]').addClass('active'), 50);

        //var editor = new MediumEditor('.editable');

        $timeout(events);
        $timeout(html2canvas(document.body, {
            onrendered: function onrendered(canvas) {
                $('body').append($(canvas).attr('height', 0).css('height', 0));
            }
        }));
    };

    init();

    _.extend($scope, {
        addGuide: addGuide,
        removeGuide: removeGuide,
        getGuides: getGuides,
        render: render
    });
});

app.directive("editable", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function link(scope, element, attrs, ngModel) {

            function read() {
                ngModel.$setViewValue(element.html());
            }

            ngModel.$render = function () {
                element.html(ngModel.$viewValue || "");
            };

            element.bind("blur keyup change", function () {
                scope.$apply(read);
            });
        }
    };
});