<?php
// PHP twin of card-testimonial.template.js: a quote card (quote mark, quote, photo, author and role).
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../atoms/text/text.template.php';

defined('DS_CARD_TESTIMONIAL_QUOTE_MARK') || define(
    'DS_CARD_TESTIMONIAL_QUOTE_MARK',
    '<svg class="ds-card-testimonial__mark" viewBox="0 0 135 82" fill="currentColor" aria-hidden="true" focusable="false"><path d="M32.5 60.94C50.45 60.94 65 47.3 65 30.47 65 13.64 50.45 0 32.5 0 14.55 0 0 13.64 0 30.47c0 16.83 14.55 30.47 32.5 30.47Z"/><path d="M35.61 81.56 31 45l26 5.58-21.39 30.98Z"/><path d="M102.5 60.94c17.95 0 32.5-13.64 32.5-30.47C135 13.64 120.45 0 102.5 0 84.55 0 70 13.64 70 30.47c0 16.83 14.55 30.47 32.5 30.47Z"/><path d="M105.61 81.56 101 45l26 5.58-21.39 30.98Z"/></svg>'
);

if (!function_exists('ds_render_card_testimonial')) {
    function ds_render_card_testimonial(array $args = []): string
    {
        ['quote' => $quote, 'author' => $author, 'role' => $role, 'photo' => $photo, 'active' => $active] = $args + [
            'quote' => 'Współpraca z DCC pomogła nam uporządkować komunikację w zespole i jasno podzielić odpowiedzialności. Warsztaty były konkretne, osadzone w naszej branży i od razu przełożyły się na codzienną pracę.',
            'author' => 'Agnieszka Nowicka-Petri',
            'role' => 'Dyrektor HR, Cardiac-Technika',
            'photo' => './placeholders/avatar.svg',
            'active' => false,
        ];
        $photoMarkup = ds_truthy($photo) ? '<img class="ds-card-testimonial__photo" src="' . ds_escape_html($photo) . '" alt="" loading="lazy">' : '';
        $name = '<span class="ds-card-testimonial__name">' . ds_render_text(['text' => $author, 'variant' => 'xl', 'tag' => 'span', 'className' => 'ds-card-testimonial__author'])
            . (ds_truthy($role) ? ds_render_text(['text' => $role, 'variant' => 'body', 'tag' => 'span', 'className' => 'ds-card-testimonial__role']) : '') . '</span>';
        return '<figure class="ds-card-testimonial' . (ds_truthy($active) ? ' is-active' : '') . '"><div class="ds-card-testimonial__top">' . DS_CARD_TESTIMONIAL_QUOTE_MARK . '</div><blockquote class="ds-card-testimonial__quote">' . ds_render_text(['text' => $quote, 'variant' => 'body']) . '</blockquote><figcaption class="ds-card-testimonial__caption">' . $photoMarkup . $name . '</figcaption></figure>';
    }
}
