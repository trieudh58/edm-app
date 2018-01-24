
$(function () {

    $('.section-1 .list-slide').owlCarousel({
        singleItem: true,
        stopOnHover: false,
        paginationSpeed: 600,
        goToFirstSpeed: 1000,
        autoHeight: true,
        pagination: true,
        autoPlay: true,

    });

    $('.section-4 .list-slide').owlCarousel({
        singleItem: true,
        stopOnHover: false,
        paginationSpeed: 600,
        goToFirstSpeed: 1000,
        autoHeight: true,
        pagination: false,
        autoPlay: true,
        navigation: true,
        navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]

    });

});
