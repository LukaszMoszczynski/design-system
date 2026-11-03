<?php
// PHP twin of testimonials.template.js: the testimonials section (centred heading group, carousel of quote cards).
declare(strict_types=1);

require_once __DIR__ . '/../../molecules/heading-group/heading-group.template.php';
require_once __DIR__ . '/../../molecules/card-testimonial/card-testimonial.template.php';
require_once __DIR__ . '/../../organisms/carousel/carousel.template.php';

defined('DS_TESTIMONIALS_HEADING_TAGS') || define('DS_TESTIMONIALS_HEADING_TAGS', ['h2', 'h3']);

defined('DS_TESTIMONIALS_DEFAULTS') || define('DS_TESTIMONIALS_DEFAULTS', [
    [
        'quote' => 'Współpraca z DCC pomogła nam uporządkować komunikację w zespole i jasno podzielić odpowiedzialności. Warsztaty były konkretne, osadzone w naszej branży i od razu przełożyły się na codzienną pracę.',
        'author' => 'Agnieszka Nowicka-Petri',
        'role' => 'Dyrektor HR, Cardiac-Technika',
    ],
    [
        'quote' => 'Program dla kierowników zmian dał naszym liderom wspólny język. Po trzech modułach widzimy mniej eskalacji i spokojniejsze odprawy na produkcji.',
        'author' => 'Tomasz Wieczorek',
        'role' => 'Dyrektor zakładu, Elmet',
    ],
    [
        'quote' => 'Trenerzy szybko zrozumieli specyfikę zespołu IT. Ćwiczenia były na naszych przykładach, a nie z podręcznika, i to zrobiło różnicę.',
        'author' => 'Marta Zielińska',
        'role' => 'Head of Engineering, Softline',
    ],
    [
        'quote' => 'Coaching zarządu był dla nas momentem, w którym naprawdę zaczęliśmy rozmawiać o strategii, a nie tylko o bieżących sprawach.',
        'author' => 'Piotr Kamiński',
        'role' => 'Prezes zarządu, Portum',
    ],
    [
        'quote' => 'Szkolenie z negocjacji przygotowało handlowców do trudnych rozmów z klientami. Wyniki kwartału mówią same za siebie.',
        'author' => 'Katarzyna Lis',
        'role' => 'Dyrektor sprzedaży, Agrovita',
    ],
    [
        'quote' => 'Diagnoza ról w zespole pokazała, gdzie tracimy energię. Dziś lepiej dzielimy zadania i rzadziej się dublujemy.',
        'author' => 'Michał Nowak',
        'role' => 'Kierownik projektu, Baltic Logistics',
    ],
]);

if (!function_exists('ds_render_testimonials')) {
    function ds_render_testimonials(array $args = []): string
    {
        ['overline' => $overline, 'title' => $title, 'lead' => $lead, 'items' => $items, 'photo' => $photo, 'headingTag' => $headingTag, 'ariaLabel' => $ariaLabel] = $args + [
            'overline' => 'Rekomendacje',
            'title' => 'Co mówią nasi klienci o współpracy z DCC?',
            'lead' => '',
            'items' => DS_TESTIMONIALS_DEFAULTS,
            'photo' => './placeholders/avatar.svg',
            'headingTag' => 'h2',
            'ariaLabel' => '',
        ];
        $tag = in_array($headingTag, DS_TESTIMONIALS_HEADING_TAGS, true) ? $headingTag : 'h2';
        $heading = ds_render_heading_group(['overline' => $overline, 'title' => $title, 'lead' => $lead, 'leadStrong' => '', 'variant' => 'centered', 'headingTag' => $tag]);
        $slides = array_map(static fn (array $item): string => ds_render_card_testimonial(array_merge(['photo' => $photo], $item, ['active' => false])), array_values($items));
        $carouselName = ds_truthy($ariaLabel) ? $ariaLabel : (ds_truthy($title) ? $title : 'Opinie klientów');
        $carousel = ds_render_carousel(['slides' => $slides, 'items' => 3, 'nav' => 'below', 'heading' => null, 'centered' => true, 'mobileArrows' => false, 'ariaLabel' => $carouselName]);
        return '<section class="ds-testimonials"><div class="ds-testimonials__container"><div class="ds-testimonials__head" data-ds-reveal>' . $heading . '</div>' . $carousel . '</div></section>';
    }
}
