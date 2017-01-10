app.controller('HomeScreen', ($element, $timeout, $scope) => {

    var guides = [];

    var getGuides = () => guides;

    var addGuide = () => {
        guides.push({
            title: "Guide " + (guides.length + 1),
            content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, modi."
        });

        $timeout(() => {
            $(".guide-number").draggable({
                containment: "parent"
            });
        });
    };

    var removeGuide = (guide) => {
        console.log('guide', guide)
        _.pull(guides, guide);
    };

    var render = () => {
        var scaleBy = 2;
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
            canvas:canvas,
            onrendered: function (canvas) {
                //$('body').append($(canvas));
                window.open(
                   canvas.toDataURL()
                );
            }
        });
    };

    var events = () => {
        var imageLoader = document.getElementById('filePhoto');
        imageLoader.addEventListener('change', handleImage, false);

        function handleImage(e) {
            var reader = new FileReader();
            reader.onload = function (event) {
                $('.image-web').attr('src', event.target.result);
            }
            reader.readAsDataURL(e.target.files[0]);
        }

    };

    var init = () => {
        //$timeout(() => $element.find('[screen]').addClass('active'), 50);

        //var editor = new MediumEditor('.editable');

        $timeout(events);
        $timeout(html2canvas(document.body, {
            onrendered: function (canvas) {
                $('body').append($(canvas).attr('height',0).css('height',0));
            }
        }));
    };

    init();

    _.extend($scope, {
        addGuide,
        removeGuide,
        getGuides,
        render
    });
});


app.directive("editable", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {

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