<?php
// PHP twin of card-person.template.js: a person card (photo, name, role lines), a link when href is set.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../_shared/heading-tags.php';
require_once __DIR__ . '/../../atoms/text/text.template.php';

if (!function_exists('ds_render_card_person')) {
    function ds_render_card_person(array $args = []): string
    {
        ['name' => $name, 'roles' => $roles, 'image' => $image, 'imageAlt' => $imageAlt, 'href' => $href, 'headingTag' => $headingTag] = $args + [
            'name' => 'Anna Grygorcewicz',
            'roles' => ['Executive coaching  |  Coaching menedżerski', 'Gramy do jednej bramki  |  Konsulting'],
            'image' => './placeholders/portrait.svg',
            'imageAlt' => '',
            'href' => '#',
            'headingTag' => 'h3',
        ];
        $tag = in_array($headingTag, DS_CARD_HEADING_TAGS, true) ? $headingTag : 'h3';
        $photo = ds_truthy($image) ? '<span class="ds-card-person__photo"><img src="' . ds_escape_html($image) . '" alt="' . ds_escape_html($imageAlt) . '" loading="lazy"></span>' : '';
        $roleList = is_array($roles) && array_is_list($roles) ? $roles : [$roles];
        $roleLines = implode('<br>', array_map('ds_escape_html', array_values(array_filter($roleList, 'ds_truthy'))));
        $body = '<div class="ds-card-person__body">' . ds_render_text(['text' => $name, 'variant' => '2xl', 'tag' => $tag, 'className' => 'ds-card-person__name'])
            . ($roleLines !== '' ? '<p class="ds-card-person__roles">' . $roleLines . '</p>' : '') . '</div>';
        if (ds_truthy($href)) {
            return '<a class="ds-card-person" href="' . ds_escape_html($href) . '">' . $photo . $body . '</a>';
        }
        return '<article class="ds-card-person">' . $photo . $body . '</article>';
    }
}
